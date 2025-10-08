export interface ClickHouseEvent {
  id: string;
  event_type: string;
  source: string;
  subject: string;
  data: any;
  event_time: Date;
}

export interface ClickHouseAnalytics {
  date: string;
  hour: number;
  event_type: string;
  source: string;
  count: number;
}

export interface EventsQuery {
  start_date?: string;
  end_date?: string;
  event_type?: string;
  source?: string;
  limit?: number;
  offset?: number;
}