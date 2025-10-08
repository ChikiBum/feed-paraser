# ClickHouse Integration Architecture

## 🎯 Overview

This document provides a comprehensive technical overview of the ClickHouse integration architecture in the News Feed Analytics system. The implementation features dual storage strategy, memory caching, automated batch processing, and real-time analytics capabilities.

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend UI   │    │   Node.js API   │    │   ClickHouse    │
│                 │◄──►│                 │◄──►│   Analytics     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │    MongoDB      │
                       │   (Prisma)      │
                       └─────────────────┘
```

### Core Components

1. **Data Collection Layer**: API endpoints for event ingestion
2. **Memory Cache Layer**: Temporary event storage for batch processing
3. **Scheduler Layer**: Automated cache flushing mechanism
4. **Analytics Layer**: ClickHouse for high-performance queries
5. **Persistence Layer**: MongoDB for real-time UI data

## 🔄 Data Flow Process

### Phase 1: Event Collection
```
POST /ads/event/click
{
  "anonId": "user123",
  "adId": "ad456"
}
        │
        ▼
analyticsRoutes.route.ts
        │
        ├─► MongoDB (Prisma) ─► Real-time UI
        │
        └─► Memory Cache ─► Batch Processing
```

### Phase 2: Memory Cache Management
```
cacheService.addEvent({
  id: uuid(),
  event_type: "ads_click",
  source: "ads_analytics", 
  subject: "/ads/event/click",
  data: { anonId, adId },
  event_time: new Date()
})
        │
        ▼
Memory Buffer
[Event1, Event2, Event3, ...]
        │
        ▼ (Every 60 seconds)
Scheduler Trigger
```

### Phase 3: Automated Batch Processing
```
cache-flush.scheduler.ts
        │
        ├─► Check: eventCount = cache.length
        │
        ├─► If count > 0:
        │   ├─► Log: "Flushing X events..."
        │   └─► clickhouseService.flushCacheToClickHouse()
        │
        └─► Handle errors gracefully
```

### Phase 4: ClickHouse Storage & Analytics
```
Batch Insert
        │
        ▼
news_feed.events table
        │
        ▼ (Automatic via Materialized View)
news_feed.events_analytics
        │
        ▼
Analytics API
/clickhouse/analytics?group_by=event_type
```

## 📁 Component Architecture

### � Service Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              ClickHouse Integration Flow                        │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Request   │    │  Analytics      │    │  Event Grid     │
│                 │    │  Route          │    │  Route          │
│ POST /ads/event │───►│                 │    │                 │
│                 │    │ analytics       │    │ eventGrid       │
└─────────────────┘    │ Routes.route.ts │    │ .route.ts       │
                       └─────────┬───────┘    └─────────────────┘
                                 │
                       ┌─────────▼───────┐
                       │                 │
                       │  Cache Service  │◄────────────────────┐
                       │                 │                     │
                       │ cache.service.ts│                     │
                       │                 │                     │
                       │ • addEvent()    │                     │
                       │ • getEventCount()│                    │
                       │ • clearEvents() │                     │
                       └─────────┬───────┘                     │
                                 │                             │
                   ┌─────────────▼─────────────┐               │
                   │                           │               │
                   │     Memory Cache         │               │
                   │                           │               │
                   │ [Event1, Event2, ...]    │               │
                   │                           │               │
                   └─────────────┬─────────────┘               │
                                 │                             │
                       ┌─────────▼───────┐                     │
                       │                 │                     │
                       │   Scheduler     │                     │
                       │                 │                     │
                       │ cache-flush     │                     │
                       │ .scheduler.ts   │                     │
                       │                 │                     │
                       │ • Every 60s     │                     │
                       │ • createCacheFlushJob() │             │
                       └─────────┬───────┘                     │
                                 │                             │
                       ┌─────────▼───────┐                     │
                       │                 │                     │
                       │ ClickHouse      │                     │
                       │ Service         │                     │
                       │                 │                     │
                       │ clickhouse      │                     │
                       │ .service.ts     │                     │
                       │                 │                     │
                       │ • insertEvents()│                     │
                       │ • flushCache()  │                     │
                       └─────────┬───────┘                     │
                                 │                             │
              ┌──────────────────▼──────────────────┐          │
              │                                     │          │
              │         ClickHouse Database         │          │
              │                                     │          │
              │  ┌─────────────────────────────────┐ │          │
              │  │        events table             │ │          │
              │  │                                 │ │          │
              │  │ • Raw event data                │ │          │
              │  │ • Partitioned by date           │ │          │
              │  │ • TTL 30 days                   │ │          │
              │  └─────────────┬───────────────────┘ │          │
              │                │                     │          │
              │                │ (Materialized View) │          │
              │                │                     │          │
              │  ┌─────────────▼───────────────────┐ │          │
              │  │     events_analytics table      │ │          │
              │  │                                 │ │          │
              │  │ • Aggregated hourly data        │ │          │
              │  │ • SummingMergeTree engine       │ │          │
              │  │ • Fast analytics queries        │ │          │
              │  └─────────────────────────────────┘ │          │
              └──────────────────┬──────────────────┘          │
                                 │                             │
                       ┌─────────▼───────┐                     │
                       │                 │                     │
                       │ ClickHouse      │                     │
                       │ Query Service   │                     │
                       │                 │                     │
                       │ clickhouse-query│                     │
                       │ .service.ts     │                     │
                       │                 │                     │
                       │ • getEvents()   │                     │
                       │ • getAnalytics()│                     │
                       └─────────┬───────┘                     │
                                 │                             │
                       ┌─────────▼───────┐                     │
                       │                 │                     │
                       │ ClickHouse      │                     │
                       │ Routes          │                     │
                       │                 │                     │
                       │ clickhouse      │                     │
                       │ .route.ts       │                     │
                       │                 │                     │
                       │ • /health       │                     │
                       │ • /events       │                     │
                       │ • /analytics    │                     │
                       └─────────────────┘                     │
                                                               │
┌──────────────────────────────────────────────────────────────┼──────────────────┐
│                           Plugin System                      │                  │
└──────────────────────────────────────────────────────────────┼──────────────────┘
                                                               │
                       ┌─────────────────┐                     │
                       │                 │                     │
                       │ clickhouse      │                     │
                       │ .plugin.ts      │◄────────────────────┘
                       │                 │
                       │ • Connection    │
                       │ • Health Check  │
                       │ • fastify.clickhouse
                       └─────────┬───────┘
                                 │
                       ┌─────────▼───────┐
                       │                 │
                       │ clickhouse-cache│
                       │ .plugin.ts      │
                       │                 │
                       │ • Auto-start    │
                       │ • Scheduler     │
                       │ • Dependencies  │
                       └─────────────────┘
```

### 🔄 Service Interaction Flow

#### **1. Event Collection Phase**
```
API Request → analyticsRoutes.route.ts → cacheService.addEvent()
```
- **Input**: HTTP POST request with event data
- **Process**: Route validates data, saves to MongoDB, adds to cache
- **Output**: Event stored in memory cache + MongoDB

#### **2. Cache Management Phase**
```
Memory Cache → [Event1, Event2, Event3, ...]
```
- **Storage**: In-memory JavaScript objects
- **Management**: cacheService handles add/get/clear operations
- **Monitoring**: getEventCount() tracks cache size

#### **3. Scheduled Processing Phase**
```
Scheduler (60s) → cache-flush.scheduler.ts → createCacheFlushJob()
```
- **Trigger**: ToadScheduler every 60 seconds
- **Check**: getEventCount() > 0
- **Action**: Call clickhouseService.flushCacheToClickHouse()

#### **4. Batch Insert Phase**
```
ClickHouse Service → clearEvents() → insertEvents() → ClickHouse DB
```
- **Extract**: Get all cached events and clear cache
- **Transform**: Convert JavaScript objects to ClickHouse format
- **Insert**: Batch insert to news_feed.events table

#### **5. Auto-Aggregation Phase**
```
events table → Materialized View → events_analytics table
```
- **Trigger**: Automatic on data insert
- **Process**: Aggregate by date, hour, event_type, source
- **Result**: Pre-computed analytics for fast queries

#### **6. Query Phase**
```
API Request → clickhouse.route.ts → clickhouse-query.service.ts → ClickHouse DB
```
- **Input**: GET request with filters
- **Process**: Build SQL query with parameters
- **Output**: Filtered events or aggregated analytics

### 🔧 Key Service Interactions

#### **Cache Service ↔ Analytics Route**
```typescript
// In analyticsRoutes.route.ts
cacheService.addEvent({
  id: uuidv4(),
  event_type: `ads_${type}`,
  source: "ads_analytics",
  data: { anonId, adId, type }
});
```

#### **Scheduler ↔ Cache Service**
```typescript
// In cache-flush.scheduler.ts
const eventCount = cacheService.getEventCount();
if (eventCount > 0) {
  await clickhouseService.flushCacheToClickHouse();
}
```

#### **ClickHouse Service ↔ Cache Service**
```typescript
// In clickhouse.service.ts
const events = cacheService.clearEvents(); // Get and clear
await this.insertEvents(events);           // Insert to ClickHouse
```

#### **Query Service ↔ ClickHouse Plugin**
```typescript
// In clickhouse-query.service.ts
const client = this.fastify.clickhouse.client;
const result = await client.query({ 
  query: sqlQuery, 
  format: 'JSONEachRow' 
});
```

### 🏗️ Architecture Benefits

- **🔄 Loose Coupling**: Services communicate through well-defined interfaces
- **📊 Data Consistency**: Dual storage ensures no data loss
- **⚡ Performance**: Memory cache + batch processing optimizes throughput
- **🛡️ Reliability**: Each service handles errors independently
- **📈 Scalability**: Modular design allows independent scaling

### �🔌 Plugin Layer

#### clickhouse.plugin.ts
```typescript
Purpose: ClickHouse connection management
Location: src/plugins/clickhouse.plugin.ts

Key Features:
- Creates ClickHouse client connection
- Adds fastify.clickhouse decorator
- Provides health check methods
- Manages connection lifecycle

Interface:
fastify.clickhouse.client    // Client instance
fastify.clickhouse.ping()    // Health check
fastify.clickhouse.close()   // Cleanup
```

#### clickhouse-cache.plugin.ts
```typescript
Purpose: Automated cache flushing scheduler
Location: src/plugins/clickhouse-cache.plugin.ts
Dependencies: ["schedule-plugin", "clickhouse-plugin"]

Key Features:
- Sets up interval-based cache flushing
- Configurable timeout (default: 60 seconds)
- Background job lifecycle management
- Error handling and logging

Configuration:
CLICKHOUSE_CACHE_TIMEOUT=60000  // milliseconds
```

### 🛠️ Service Layer

#### cache.service.ts
```typescript
Purpose: In-memory event caching
Location: src/modules/clickhouse/services/cache.service.ts

Methods:
addEvent(event)      // Add event to cache
getEventCount()      // Get cached events count  
clearEvents()        // Remove all events and return them
getAllEvents()       // Get events without clearing

Cache Structure:
{
  id: string,
  event_type: string,    // ads_click, ads_view, etc.
  source: string,        // ads_analytics, event_grid
  subject: string,       // API endpoint
  data: any,            // Event payload
  event_time: Date      // Timestamp
}
```

#### clickhouse.service.ts
```typescript
Purpose: ClickHouse data operations
Location: src/modules/clickhouse/services/clickhouse.service.ts

Methods:
insertEvents(events[])           // Batch insert to ClickHouse
flushCacheToClickHouse()        // Move cache data to ClickHouse

Data Transformation:
JavaScript Object → ClickHouse Format
{
  data: object → JSON.stringify(data)
  event_time: Date → ISO timestamp string
}
```

#### clickhouse-query.service.ts
```typescript
Purpose: Analytics queries and data retrieval
Location: src/modules/clickhouse/services/clickhouse-query.service.ts

Methods:
getEvents(query)         // Filtered event listing
getAnalytics(query)      // Aggregated analytics data

Query Capabilities:
- Date range filtering (start_date, end_date)
- Event type filtering (event_type)
- Source filtering (source)
- Pagination support (limit, offset)
- Multiple grouping options (day, hour, event_type, source)
```

### ⏰ Scheduler System

#### cache-flush.scheduler.ts
```typescript
Purpose: Create flush job for toad-scheduler
Location: src/modules/clickhouse/utils/cache-flush.scheduler.ts

Job Creation Flow:
1. createCacheFlushJob(fastify, interval)
2. Creates Task with flush logic
3. Wraps in SimpleIntervalJob  
4. Returns ready-to-use job

Execution Logic (Every 60 seconds):
1. Check cache.getEventCount()
2. If events > 0:
   - Log flush operation
   - Call clickhouseService.flushCacheToClickHouse()
3. Handle errors gracefully
```

## 🌐 API Layer

### Health Check Endpoint
```http
GET /clickhouse/health

Response (Healthy):
{
  "status": "healthy",
  "timestamp": "2025-10-07T19:32:52.652Z"
}

Response (Unhealthy):
{
  "status": "unhealthy",
  "error": "Connection timeout", 
  "timestamp": "2025-10-07T19:32:52.652Z"
}
```

### Events Listing Endpoint
```http
GET /clickhouse/events?limit=10&event_type=ads_click

Query Parameters:
- limit (number): Max records to return (default: 100)
- offset (number): Records to skip (default: 0)
- start_date (string): Filter from date (YYYY-MM-DD)
- end_date (string): Filter to date (YYYY-MM-DD)
- event_type (string): Filter by event type
- source (string): Filter by source

Response:
{
  "data": [
    {
      "id": "uuid-123",
      "event_type": "ads_click",
      "source": "ads_analytics",
      "subject": "/ads/event/click",
      "data": "{\"anonId\":\"user123\",\"adId\":\"ad456\"}",
      "event_time": "2025-10-07 19:30:15",
      "created_at": "2025-10-07 19:31:00"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

### Analytics Endpoint
```http
GET /clickhouse/analytics?group_by=event_type

Query Parameters:
- group_by (string): day, hour, event_type, source
- start_date (string): Filter from date (YYYY-MM-DD)
- end_date (string): Filter to date (YYYY-MM-DD)
- event_type (string): Filter by event type
- source (string): Filter by source

Response Examples:

By Event Type:
[
  {
    "event_type": "ads_click",
    "count": 150,
    "date": ""
  },
  {
    "event_type": "ads_view",
    "count": 89, 
    "date": ""
  }
]

By Day:
[
  {
    "date": "2025-10-07",
    "count": 239
  },
  {
    "date": "2025-10-06",
    "count": 156
  }
]

By Hour:
[
  {
    "date": "2025-10-07",
    "hour": 19,
    "event_type": "ads_click",
    "source": "ads_analytics",
    "count": 25
  }
]
```

## 🗄️ Database Schema

### Main Events Table
```sql
CREATE TABLE IF NOT EXISTS events (
    id String,                                    -- Unique event identifier
    event_type String,                           -- ads_click, ads_view, ads_impression, etc.
    source String,                               -- ads_analytics, event_grid
    subject String,                              -- URL endpoint that generated event
    data String,                                 -- JSON event payload
    event_time DateTime,                         -- Event timestamp
    created_at DateTime DEFAULT now(),           -- Record creation time
    partition_date Date DEFAULT toDate(event_time) -- Partition key for performance
) ENGINE = MergeTree()
PARTITION BY partition_date                      -- Daily partitions
ORDER BY (event_time, id)                       -- Primary key for fast queries
TTL partition_date + INTERVAL 30 DAY;           -- Auto-cleanup after 30 days
```

### Analytics Aggregation Table
```sql
CREATE TABLE IF NOT EXISTS events_analytics (
    date Date,                                   -- Event date
    hour UInt8,                                  -- Event hour (0-23)
    event_type String,                           -- Event type
    source String,                               -- Event source
    count UInt64,                                -- Event count
    created_at DateTime DEFAULT now()            -- Record creation time
) ENGINE = SummingMergeTree(count)              -- Auto-sum counts on merge
PARTITION BY date                                -- Daily partitions
ORDER BY (date, hour, event_type, source);      -- Composite primary key
```

### Materialized View for Auto-Aggregation
```sql
CREATE MATERIALIZED VIEW IF NOT EXISTS events_hourly_mv
TO events_analytics
AS SELECT
    toDate(event_time) as date,                  -- Extract date from timestamp
    toHour(event_time) as hour,                  -- Extract hour from timestamp
    event_type,                                  -- Event type
    source,                                      -- Event source
    count() as count                             -- Count events
FROM events
GROUP BY date, hour, event_type, source;        -- Group by all dimensions
```

## ⚙️ Configuration Management

### Environment Variables
```bash
# ClickHouse Connection
CLICKHOUSE_HOST=http://localhost:8123     # ClickHouse HTTP endpoint
CLICKHOUSE_DB=default                     # Database name
CLICKHOUSE_USER=default                   # Username
CLICKHOUSE_PASSWORD=clickhouse123         # Password

# Cache Configuration  
CLICKHOUSE_CACHE_TIMEOUT=60000           # Flush interval (milliseconds)
```

### Docker Configuration
```yaml
# docker-compose.yml
clickhouse:
  image: clickhouse/clickhouse-server:latest
  ports:
    - "8123:8123"  # HTTP interface
    - "9000:9000"  # Native client port
  environment:
    - CLICKHOUSE_PASSWORD=clickhouse123
  volumes:
    - clickhouse_data:/var/lib/clickhouse
    - clickhouse_logs:/var/log/clickhouse-server
  healthcheck:
    test: ["CMD", "clickhouse-client", "--user", "default", "--password", "clickhouse123", "--query", "SELECT 1"]
    interval: 30s
    timeout: 10s 
    retries: 3
```

## 📊 Performance Characteristics

### Memory Cache
- **Storage**: In-memory JavaScript objects
- **Capacity**: Limited by Node.js heap memory
- **Persistence**: Volatile (lost on restart)
- **Access Time**: Microseconds (extremely fast)

### Batch Processing
- **Frequency**: Every 60 seconds (configurable)
- **Batch Size**: Variable (depends on traffic)
- **Processing Time**: Milliseconds to seconds
- **Error Handling**: Graceful failure with retry logic

### ClickHouse Storage
- **Engine**: MergeTree (optimized for analytics)
- **Partitioning**: Daily partitions for performance
- **Indexing**: Primary key on (event_time, id)
- **TTL**: 30-day automatic cleanup
- **Compression**: Automatic columnar compression

### Query Performance
- **Event Listing**: Milliseconds (with proper filtering)
- **Analytics Aggregation**: Sub-second (pre-aggregated data)
- **Large Date Ranges**: Seconds (leverages partitioning)
- **Real-time Data**: 1-minute delay (cache flush interval)

## 🔍 Monitoring & Observability

### Health Monitoring
```bash
# System health checks
curl http://localhost:3000/clickhouse/health
curl http://localhost:8123/ping
docker-compose ps clickhouse
```

### Data Verification
```sql
-- Count total events
SELECT count() FROM news_feed.events;

-- Recent events
SELECT * FROM news_feed.events ORDER BY event_time DESC LIMIT 5;

-- Events by type
SELECT event_type, count() FROM news_feed.events GROUP BY event_type;

-- Analytics data
SELECT * FROM news_feed.events_analytics ORDER BY date DESC LIMIT 10;
```

### Performance Metrics
```sql
-- Storage usage
SELECT 
    table, 
    formatReadableSize(sum(bytes)) as size,
    sum(rows) as rows
FROM system.parts 
WHERE database = 'news_feed'
GROUP BY table;

-- Query performance
SELECT 
    query_duration_ms,
    memory_usage,
    read_rows,
    query
FROM system.query_log 
WHERE type = 'QueryFinish'
ORDER BY event_time DESC 
LIMIT 10;
```

## 🚨 Error Handling & Recovery

### Connection Failures
- **Plugin Level**: Graceful degradation if ClickHouse unavailable
- **Service Level**: Retry logic with exponential backoff
- **Cache Level**: Data preserved until connection restored

### Data Consistency
- **Primary Storage**: MongoDB ensures immediate persistence
- **Analytics Storage**: ClickHouse provides eventual consistency
- **Recovery**: Manual cache flush available via API

### Monitoring Alerts
- **Health Check Failures**: Monitor `/clickhouse/health` endpoint
- **Cache Overflow**: Monitor memory usage and flush frequency
- **Query Performance**: Monitor slow query logs

## 🎯 Best Practices

### Development
- **Plugin Dependencies**: Always declare plugin dependencies correctly
- **Error Handling**: Use try-catch blocks in all async operations
- **Logging**: Log all significant operations for debugging
- **Type Safety**: Use TypeScript interfaces for all data structures

### Production
- **Monitoring**: Set up health checks and alerting
- **Backup**: Regular ClickHouse backups for analytics data
- **Scaling**: Monitor memory usage and adjust cache intervals
- **Security**: Use strong passwords and network isolation

### Performance
- **Batch Size**: Monitor and optimize cache flush intervals
- **Query Optimization**: Use appropriate filters and date ranges
- **Indexing**: Leverage ClickHouse partitioning and ordering
- **Memory Management**: Monitor Node.js heap usage

## 📈 Scalability Considerations

### Horizontal Scaling
- **Cache Distribution**: Implement Redis for distributed caching
- **Load Balancing**: Multiple Node.js instances with shared cache
- **ClickHouse Clustering**: Distributed ClickHouse setup for large datasets

### Vertical Scaling  
- **Memory Optimization**: Adjust cache flush intervals based on traffic
- **CPU Optimization**: Optimize batch processing algorithms
- **Storage Optimization**: ClickHouse compression and partitioning

### Future Enhancements
- **Real-time Analytics**: WebSocket integration for live dashboards
- **Advanced Aggregations**: Custom aggregation functions
- **Data Retention**: Automated archival to cold storage
- **ML Integration**: Real-time anomaly detection

---

This architecture provides a robust, scalable foundation for analytics data collection and analysis, with excellent performance characteristics and comprehensive monitoring capabilities.