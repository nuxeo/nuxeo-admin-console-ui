export const STREAM_LABELS = {
  STREAM_PAGE_TITLE: "Stream Management",
  STREAMS: "Stream",
  STREAM_ID: "stream",
  REWIND_ID: "rewind",
  LIMIT_ID: "limit",
  TIMEOUT_ID: "timeout",
  POSITION_ID: "position",
  POSITION: "Position",
  POSITION_OPTIONS: {
    CONSUMER: {
      LABEL: "From a consumer position",
      VALUE: "consumer"
    },
    BEGINNING: {
      LABEL: "From Beginning",
      VALUE: "beginning"
    },
    TAIL: {
      LABEL: "From Tail",
      VALUE: "tail"
    },
    OFFSET: {
      LABEL: "From Offset",
      VALUE: "offset"
    },
    PARTITITON: {
      LABEL: "Partition",
      VALUE: "partition"
    },
  },
  REWIND: "Rewind",
  LIMIT: "Limit",
  TIMEOUT: "Timeout",
  VIEW_RECORDS: "View Records",
  STOP_FETCH: "Stop",
  CLEAR_RECORDS: "Clear",
  FETCHING_RECORDS: "Fetching Records .....",
  FETCHED_RECORDS_COUNT: "Fetched {{ recordCount }} records",
  STOPPED_FETCHING_RECORDS: "Stopped fetching records...",
  REWIND_VALUES: ["0", "1", "2", "3", "4", "5", "10", "20"],
  LIMIT_VALUES: ["1", "2", "3", "4", "5", "10", "20", "50", "100", "1000"],
  TIMEOUT_VALUES: ["0s", "5s", "10s", "30s", "1min", "5min", "10min"],
  DEFAULT_TIMEOUT_VALUE: "1ms",
  MINUTE: "min",
  SECOND: "s"
};

export const MAIN_TAB_LABELS = {
  STREAM: {
    ID: 0,
    LABEL: "stream-management",
  },
  CONSUMER: {
    ID: 1,
    LABEL: "consumer",
  },
  CONSUMER_POSITION: {
    ID: 2,
    LABEL: "consumer-position",
    SUB_TAB_LABELS: {
      CHANGE_CONSUMER_POSITION: {
        ID: 0,
        LABEL: "Change Consumer Position",
        ROUTE_LABEL: "change-consumer-position",
      },
      GET_CONSUMER_POSITION: {
        ID: 1,
        LABEL: "Get Consumer Position",
        ROUTE_LABEL: "get-consumer-position",
      },
    },
  },
  GET_SCALING_ANALYSIS: {
    ID: 3,
    LABEL: "Scaling Analysis",
    ROUTE_LABEL: "get-scaling-analysis",
  },

  GET_STREAM_PROCESSOR_INFO: {
    ID: 4,
    LABEL: "Nuxeo Stream Processor Info",
    ROUTE_LABEL: "nuxeo-stream-processor-info",
  },
};

export const CONSUMER_THREAD_POOL_LABELS = {
  CONSUMER_LABEL: 'consumer',
  CONSUMER_THREAD_POOL: "Consumer Group",
  START_CONSUMER_THREAD_POOL_BUTTON_LABEL: "Start Consumer Thread Pools",
  STOP_CONSUMER_THREAD_POOL_BUTTON_LABEL: "Stop Consumer Thread Pools",
  START_CONSUMER_THREAD_POOL: "start",
  STOP_CONSUMER_THREAD_POOL: "stop",
  CONSUMER_THREAD_POOL_OPERATION: "Consumer Thread Pool Operation",
  CONFIRMATION_MESSAGE: `This action will {operation} all consumer thread pools for all nodes in the cluster :<br> <b>  '{selectedConsumerName}' . </b> <br> <br> Would you like to continue?`,
  CONSUMER_THREAD_POOL_OPERATION_IN_PROGRESS_MSG: "An existing consumer thread pool operation is already in progress. Please wait until it completes.",
  START_CONSUMER_SUCCESS_MSG: "Consumer thread pool start request successfully sent",
  STOP_CONSUMER_SUCCESS_MSG: "Consumer thread pool stop request successfully sent",
  CONSUMER_THREAD_POOL_DIALOG_MSG: '{operation} Consumer Thread Pools',
  DIALOG_BOX_HEIGHT: '300px'
};

export const STREAM_MOCK_API_FAILURE = {
  STATUS_CODE: 404,
  MESSAGE: "Not Found"
};

export const EVENT_STREAM_ERROR_TYPE = {
  DISCONNECTED: "disconnect",
};

export const CONSUMER_POSITION_CONFIRM_MSGS = {
  BEGINNING_END_MSG:
    "This action will change the consumer position to <b> {positionName} </b> of the stream.",
  OFFSET_MSG:
    "This action will change the consumer position to a <b> Specific offset. </b>",
  DATE_MSG:
    "This action will change the consumer position <b> After a given date. </b>",
  GENERIC_MSG: `<br> Would you like to continue? <br> <br>
    <b> Note: </b> The consumer must be stopped before performing this operation. Please use the consumer thread pool tab to stop the consumer. <br>`,
};

export const CHANGE_CONSUMER_POSITION_LABELS = {
  STREAMS: STREAM_LABELS.STREAMS,
  CONSUMER: "Consumer Group",
  CONSUMER_POSITION_LABEL: "Change Consumer Position",
  CLEAR_RECORDS: 'Clear',
  POSITION_DETAILS: "Position Details:",
  OPERATION_TYPE: "Consumer Position",
  BEGINNING_END_CONFIRM_MESSAGE:
    CONSUMER_POSITION_CONFIRM_MSGS.BEGINNING_END_MSG +
    CONSUMER_POSITION_CONFIRM_MSGS.GENERIC_MSG,
  OFFSET_CONFIRM_MESSAGE:
    CONSUMER_POSITION_CONFIRM_MSGS.OFFSET_MSG +
    CONSUMER_POSITION_CONFIRM_MSGS.GENERIC_MSG,
  DATE_CONFIRM_MESSAGE:
    CONSUMER_POSITION_CONFIRM_MSGS.DATE_MSG +
    CONSUMER_POSITION_CONFIRM_MSGS.GENERIC_MSG,  
  DIALOG_BOX_HEIGHT: '330px',
  DIALOG_BOX_WIDTH: '590px',
  SUCCESS_SNACKBAR_MESSAGE: "Consumer position changed successfully",
  DATE_VALIDATION_MSG: "Please enter a valid date",
  POSITION: {
    LABEL: "position",
    VALUE: "value",
    BEGINNING: {
      LABEL: "Beginning",
      VALUE: "beginning",
    },
    END: {
      LABEL: "End",
      VALUE: "end",
    },
    OFFSET: {
      LABEL: "Offset",
      VALUE: "offset",
    },
    PARTITION: {
      LABEL: "Partition",
      VALUE: "partition",
    },
    DATE: {
      LABEL: "Date",
      VALUE: "after",
    },
  },
};

export const GET_CONSUMER_POSITION_LABELS = {
  STREAMS: 'Stream',
  CONSUMER: 'Consumer Group',
  GET_CONSUMER_POSITION: "Get Consumer Position",
  CLEAR: 'Clear',
  POSITION_DETAILS: "Position Details:",
}

export const ISO_DATE_FORMATS = { //To Override the default date format of Angular Material Datepicker
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'YYYY-MM-DD',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const GET_SCALING_ANALYSIS_LABELS = {
  NO_DATA_MSG: "No scaling analysis data available",
};

export const NUXEO_STREAM_PROCESSOR_INFO_LABELS = {
  NO_DATA_MSG: "No stream processor info data available",
  MAIN_LABEL: "Nuxeo Stream Processor Info",
};

export const GENERIC_API_LABELS = {
  API_FAILURE_MESSAGE: "An error occurred while fetching data from the server.",
  RETRY_BTN_LABEL: "Retry",
};

export const STREAM_MAIN_HEADINGS = {
  STREAM_RECORDS: "Get Stream Records",
  CONSUMER_THREAD_POOL: "Start / Stop Consumer Thread Pool",
  MANAGE_CONSUMER_POSITIONS: "Manage Consumer Positions",
  SCALING_ANALYSIS: "Get Scaling Analysis",
  NUXEO_STREAM_PROCESSOR_INFO: "Get Nuxeo Stream and Processor Information",
};