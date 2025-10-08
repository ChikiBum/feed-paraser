# ClickHouse Configuration

## Overview

This document describes the ClickHouse integration for analytics data collection and querying. The system automatically caches events in memory and flushes them to ClickHouse every minute for high-performance analytics.

## Table Structure

### events
Main table for storing events from Event Grid and analytics endpoints.

```sql
CREATE TABLE IF NOT EXISTS events (
    id String,
    event_type String,      -- ads_click, ads_view, ads_impression, etc.
    source String,          -- ads_analytics, event_grid
    subject String,         -- URL endpoint
    data String,            -- JSON data
    event_time DateTime,    -- Event timestamp
    created_at DateTime DEFAULT now(),
    partition_date Date DEFAULT toDate(event_time)
) ENGINE = MergeTree()
PARTITION BY partition_date
ORDER BY (event_time, id)
TTL partition_date + INTERVAL 30 DAY;
```

### events_analytics  
Aggregated table for fast analytics queries.

```sql
CREATE TABLE IF NOT EXISTS events_analytics (
    date Date,
    hour UInt8,
    event_type String,
    source String,
    count UInt64,
    created_at DateTime DEFAULT now()
) ENGINE = SummingMergeTree(count)
PARTITION BY date
ORDER BY (date, hour, event_type, source);
```

### events_hourly_mv
Materialized view for automatic hourly aggregation.

```sql
CREATE MATERIALIZED VIEW IF NOT EXISTS events_hourly_mv
TO events_analytics
AS SELECT
    toDate(event_time) as date,
    toHour(event_time) as hour,
    event_type,
    source,
    count() as count
FROM events
GROUP BY date, hour, event_type, source;
```

## Setup Instructions

### 1. Start ClickHouse Container
```bash
docker-compose up -d clickhouse
```

### 2. Initialize Database (New Docker Setup)

If you're setting up a new Docker container or have deleted volumes, you need to create the database structure:

#### Step 2.1: Connect to ClickHouse CLI
```bash
docker-compose exec clickhouse clickhouse-client --user default --password clickhouse123
```

#### Step 2.2: Execute Initialization SQL
Copy and execute the following SQL commands in the ClickHouse CLI:

```sql
-- Create database for news feed
CREATE DATABASE IF NOT EXISTS news_feed;

-- Use the created database
USE news_feed;

-- Create main events table
CREATE TABLE IF NOT EXISTS events (
    id String,
    event_type String,
    source String,
    subject String,
    data String,
    event_time DateTime,
    created_at DateTime DEFAULT now(),
    partition_date Date DEFAULT toDate(event_time)
) ENGINE = MergeTree()
PARTITION BY partition_date
ORDER BY (event_time, id)
TTL partition_date + INTERVAL 30 DAY;

-- Create analytics aggregation table
CREATE TABLE IF NOT EXISTS events_analytics (
    date Date,
    hour UInt8,
    event_type String,
    source String,
    count UInt64,
    created_at DateTime DEFAULT now()
) ENGINE = SummingMergeTree(count)
PARTITION BY date
ORDER BY (date, hour, event_type, source);

-- Create materialized view for automatic aggregation
CREATE MATERIALIZED VIEW IF NOT EXISTS events_hourly_mv
TO events_analytics
AS SELECT
    toDate(event_time) as date,
    toHour(event_time) as hour,
    event_type,
    source,
    count() as count
FROM events
GROUP BY date, hour, event_type, source;
```

#### Step 2.3: Exit ClickHouse CLI
```sql
EXIT;
```

### 3. Verify Setup

#### Check ClickHouse Health
```bash
curl http://localhost:3000/clickhouse/health
```
Expected response:
```json
{
    "status": "healthy",
    "timestamp": "2025-10-07T19:32:52.652Z"
}
```

#### Check Tables Creation
```bash
docker-compose exec clickhouse clickhouse-client --user default --password clickhouse123 --query "SHOW TABLES FROM news_feed"
```
Expected output:
```
events
events_analytics
events_hourly_mv
```

### 4. Test Data Flow

#### Create Test Events
Use Postman or curl to create some test events:

**POST Request:**
```
URL: http://localhost:3000/ads/event/click
Method: POST
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_TOKEN

Body:
{
  "anonId": "test-anon-123",
  "adId": "test-ad-456"
}
```

#### Check Events in ClickHouse (after 1 minute)
```bash
curl "http://localhost:3000/clickhouse/events?limit=10"
```

#### Check Analytics
```bash
curl "http://localhost:3000/clickhouse/analytics?group_by=event_type"
```

## API Endpoints

### Health Check
- **GET** `/clickhouse/health` - Check ClickHouse connection status

### Events
- **GET** `/clickhouse/events` - Get list of events with optional filtering
  - Query params: `start_date`, `end_date`, `event_type`, `source`, `limit`, `offset`

### Analytics  
- **GET** `/clickhouse/analytics` - Get aggregated analytics data
  - Query params: `start_date`, `end_date`, `event_type`, `source`, `group_by`
  - `group_by` options: `hour`, `day`, `event_type`, `source`

## Data Flow Architecture

```
Analytics Endpoint → Cache (Memory) → ClickHouse (Every minute)
                  ↓
               MongoDB (Real-time for UI)
```

1. **Data Collection**: Events from `/ads/event/*` endpoints are stored in both MongoDB (via Prisma) and cache
2. **Cache Management**: Events accumulate in memory cache
3. **Batch Processing**: Every minute, cached events are flushed to ClickHouse
4. **Automatic Aggregation**: Materialized view creates hourly statistics automatically
5. **Data Access**: Analytics API provides fast access to aggregated data

## Troubleshooting

### ClickHouse Container Issues
```bash
# Check container status
docker-compose ps

# View ClickHouse logs
docker-compose logs clickhouse

# Restart ClickHouse
docker-compose restart clickhouse
```

### Connection Issues
```bash
# Test direct connection
curl http://localhost:8123/ping

# Test through Docker
docker-compose exec clickhouse clickhouse-client --query "SELECT 1"
```

### Data Issues
```bash
# Check if data is being inserted
docker-compose exec clickhouse clickhouse-client --user default --password clickhouse123 --query "SELECT count() FROM news_feed.events"

# Check materialized view
docker-compose exec clickhouse clickhouse-client --user default --password clickhouse123 --query "SELECT * FROM news_feed.events_analytics LIMIT 5"
```