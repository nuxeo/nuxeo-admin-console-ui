export const REST_END_POINTS = {
    ELASTIC_SEARCH_REINDEX: "ELASTIC_SEARCH_REINDEX",
    PROBES: "PROBES",
    LAUNCH_PROBE: "LAUNCH_PROBE",
    CURRENT_USER: "CURRENT_USER",
    CAPABILITIES: "CAPABILITIES",
    LOGOUT: "LOGOUT",
    BULK_ACTION_MONITORING: "BULK_ACTION_MONITORING",
    VIDEO_RENDITIONS_GENERATION: "VIDEO_RENDITIONS_GENERATION"
} as const

type RestEndpointKey = keyof typeof REST_END_POINTS;

interface RestEndpointConfig {
    endpoint: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
}

export const REST_END_POINT_CONFIG: Record<RestEndpointKey, RestEndpointConfig> = {
    ELASTIC_SEARCH_REINDEX: {
        endpoint: "/management/elasticsearch/reindex",
        method: "POST"
    },
    PROBES: {
        endpoint: "/management/probes",
        method: "GET"
    },
    LAUNCH_PROBE: {
        endpoint: "/management/probes/{probeName}",
        method: "POST"
    },
    CAPABILITIES: {
        endpoint: "/capabilities",
        method: "GET"
    },
    LOGOUT: {
        endpoint: "/logout",
        method: "GET"
    },
    CURRENT_USER: {
        endpoint: "/me",
        method: "GET"
    },
    BULK_ACTION_MONITORING: {
        endpoint: "/management/bulk/{id}",
        method: "GET"
    },
    VIDEO_RENDITIONS_GENERATION: {
        endpoint: "/management/videos/recompute",
        method: "POST"
    },
};