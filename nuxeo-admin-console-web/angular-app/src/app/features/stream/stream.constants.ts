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
  CHANGE_CONSUMER: {
    ID: 2,
    LABEL: "change-consumer-position",
  },
  CONSUMER_THREAD_POOL: "Consumer Group",
  START_CONSUMER_THREAD_POOL_BUTTON_LABEL: "Start Consumer Thread Pool",
  STOP_CONSUMER_THREAD_POOL_BUTTON_LABEL: "Stop Consumer Thread Pool",
  START_CONSUMER_THREAD_POOL: "start",
  STOP_CONSUMER_THREAD_POOL: "stop",
  CONSUMER_THREAD_POOL_OPERATION: "Consumer Thread Pool Operation",
  CONFIRMATION_MESSAGE: `This action will {operation} the consumer thread pool on all Nuxeo nodes :<br> <b> { id = '{selectedConsumerName}', urn = '{selectedConsumerUrn}' }. </b> <br> Would you like to continue?`,
  CONSUMER_THREAD_POOL_OPERATION_IN_PROGRESS_MSG: "An existing consumer thread pool operation is already in progress. Please wait until it completes.",
  START_CONSUMER_SUCCESS_MSG: "Consumer Thread Pool started successfully",
  STOP_CONSUMER_SUCCESS_MSG: "Consumer Thread Pool stopped successfully",
  CONSUMER_THREAD_POOL_DIALOG_MSG: '{operation} Consumer Thread Pool',
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
    <b> Note: The consumer must be stopped before performing this operation. Please use the consumer thread pool tab to stop the consumer. </b> <br>`,
};

export const CHANGE_CONSUMER_POSITION_LABELS = {
  STREAMS: STREAM_LABELS.STREAMS,
  CONSUMER: "Consumer Group",
  CONSUMER_POSITION_LABEL: "Change Consumer Position",
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
      LABEL: "Choose a date",
      VALUE: "after",
    },
  },
};

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


