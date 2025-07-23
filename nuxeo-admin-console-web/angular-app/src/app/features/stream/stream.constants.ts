export const STREAM_LABELS = {
  STREAM_PAGE_TITLE: "Stream Management",
  STREAMS: "Streams",
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

export const CONSUMER_THREAD_POOL_LABELS = {
  STREAM :{
    ID: 0,
    LABEL: "stream-management",
  },
  CONSUMER: {
    ID: 1,
    LABEL: "consumer",
  },
  CONSUMER_THREAD_POOL: "Consumer Position",
  START_CONSUMER_THREAD_POOL_BUTTON_LABEL: "Start Consumer Thread Pool",
  STOP_CONSUMER_THREAD_POOL_BUTTON_LABEL: "Stop Consumer Thread Pool",
  START_CONSUMER_THREAD_POOL: "start",
  STOP_CONSUMER_THREAD_POOL: "stop",
  CONSUMER_THREAD_POOL_OPERATION: "Consumer Thread Pool Operation",
  CONFIRMATION_MESSAGE: `This action will {operation} the consumer thread pool on all Nuxeo nodes : <b> Name { id = '{selectedConsumerName}', urn = '{selectedConsumerUrn}' } </b> <br><br> Do you want to continue?`,
  CONSUMER_THREAD_POOL_OPERATION_IN_PROGRESS_MSG: "An existing consumer thread pool operation is already in progress. Please wait until it completes.",
  START_CONSUMER_SUCCESS_MSG: "Start consumer thread pool operation completed successfully.",
  STOP_CONSUMER_SUCCESS_MSG: "Stop consumer thread pool operation completed successfully.",
}

export const STREAM_MOCK_API_FAILURE = {
  STATUS_CODE: 404,
  MESSAGE: "Not Found"
};

export const EVENT_STREAM_ERROR_TYPE = {
  DISCONNECTED: "disconnect",
};
