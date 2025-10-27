
export const REST_END_POINTS = {
  ELASTIC_SEARCH_REINDEX: "ELASTIC_SEARCH_REINDEX",
  ELASTIC_SEARCH_REINDEX_OLD: "ELASTIC_SEARCH_REINDEX_OLD",
  PROBES: "PROBES",
  LAUNCH_PROBE: "LAUNCH_PROBE",
  LAUNCH_ALL_PROBES: "LAUNCH_ALL_PROBES",
  CURRENT_USER: "CURRENT_USER",
  CAPABILITIES: "CAPABILITIES",
  LOGOUT: "LOGOUT",
  BULK_ACTION_MONITORING: "BULK_ACTION_MONITORING",
  THUMBNAIL_GENERATION: "THUMBNAIL_GENERATION",
  PICTURE_RENDITIONS: "PICTURE_RENDITIONS",
  VIDEO_RENDITIONS_GENERATION: "VIDEO_RENDITIONS_GENERATION",
  FULLTEXT_REINDEX: "FULLTEXT_REINDEX",
  STREAM: "STREAM",
  STREAM_CONSUMERS: "STREAM_CONSUMERS",
  STREAM_RECORDS: "STREAM_RECORDS",
  START_CONSUMER_THREAD_POOL: "START_CONSUMER_THREAD_POOL",
  STOP_CONSUMER_THREAD_POOL: "STOP_CONSUMER_THREAD_POOL",
  INSTANCE_INFO: "INSTANCE_INFO",
  CHANGE_CONSUMER_POSITION: "CHANGE_CONSUMER_POSITION",
  FETCH_CONSUMER_POSITION: "FETCH_CONSUMER_POSITION",
  GET_SCALING_ANALYSIS: "GET_SCALING_ANALYSIS",
  GET_STREAM_PROCESSOR_INFO: "GET_STREAM_PROCESSOR_INFO",
} as const;

type RestEndpointKey = keyof typeof REST_END_POINTS;

interface RestEndpointConfig {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
}

export const REST_END_POINT_CONFIG: Record<
  RestEndpointKey,
  RestEndpointConfig
> = {
  ELASTIC_SEARCH_REINDEX: {
    endpoint: "/management/search/reindex",
    method: "POST",
  },
  ELASTIC_SEARCH_REINDEX_OLD: {
    endpoint: "/management/elasticsearch/reindex",
    method: "POST",
  },
  PROBES: {
    endpoint: "/management/probes",
    method: "GET",
  },
  LAUNCH_PROBE: {
    endpoint: "/management/probes/{probeName}",
    method: "POST",
  },
  LAUNCH_ALL_PROBES: {
    endpoint: "/management/probes",
    method: "POST",
  },
  CAPABILITIES: {
    endpoint: "/capabilities",
    method: "GET",
  },
  LOGOUT: {
    endpoint: "/logout",
    method: "GET",
  },
  CURRENT_USER: {
    endpoint: "/me",
    method: "GET",
  },
  BULK_ACTION_MONITORING: {
    endpoint: "/management/bulk/{id}",
    method: "GET",
  },
  THUMBNAIL_GENERATION: {
    endpoint: "/management/thumbnails/recompute",
    method: "POST",
  },
  PICTURE_RENDITIONS: {
    endpoint: "/management/pictures/recompute",
    method: "POST",
  },
  VIDEO_RENDITIONS_GENERATION: {
    endpoint: "/management/videos/recompute",
    method: "POST",
  },
  FULLTEXT_REINDEX: {
    endpoint: "/management/fulltext/extract",
    method: "POST",
  },
  STREAM: {
    endpoint: "/management/stream/streams",
    method: "GET",
  },
  STREAM_CONSUMERS: {
    endpoint: "/management/stream/consumers",
    method: "GET",
  },
  STREAM_RECORDS: {
    endpoint: "/management/stream/cat",
    method: "GET",
  },
  START_CONSUMER_THREAD_POOL:{
    endpoint: "/management/stream/consumer/start",
    method: "PUT",
  },
  STOP_CONSUMER_THREAD_POOL: {
    endpoint: "/management/stream/consumer/stop",
    method: "PUT",
  },
  INSTANCE_INFO: {
    endpoint: "/management/connect/status",
    method: "GET",
  },

  CHANGE_CONSUMER_POSITION: {
    endpoint: "/management/stream/consumer/position/{consumerPosition}",
    method: "PUT",
  },
  
  FETCH_CONSUMER_POSITION: {
    endpoint: "/management/stream/consumer/position",
    method: "GET",
  },

  GET_SCALING_ANALYSIS: {
    endpoint: "/management/stream/scale",
    method: "GET",
  },

  GET_STREAM_PROCESSOR_INFO: {
    endpoint: "/management/stream/",
    method: "GET",
  },
};
