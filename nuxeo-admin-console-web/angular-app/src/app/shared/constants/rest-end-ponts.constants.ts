export const REST_END_POINTS: any = {
    ELASTIC_SEARCH_REINDEX: "ELASTIC_SEARCH_REINDEX",
    PROBES: "PROBES",
    CURRENT_USER: "CURRENT_USER",
    CAPABILITIES: "CAPABILITIES",
    LOGOUT: "LOGOUT",
    SSO: "SSO",
};

export const REST_END_POINT_CONFIG: any = {
    [REST_END_POINTS.ELASTIC_SEARCH_REINDEX]: {
        endpoint: "/management/elasticsearch/reindex",
        method: "POST"
    },
    [REST_END_POINTS.PROBES]: {
        endpoint: "/management/probes",
        method: "GET"
    },
    [REST_END_POINTS.CAPABILITIES]: {
        endpoint: "/capabilities",
        method: "GET"
    },
    [REST_END_POINTS.LOGOUT]: {
        endpoint: "/logout",
        method: "GET"
    },
    [REST_END_POINTS.CURRENT_USER]: {
        endpoint: "/me",
        method: "GET"
    },
    [REST_END_POINTS.SSO]: {
        endpoint: "/users/sso",
        method: "POST"
    }
};
