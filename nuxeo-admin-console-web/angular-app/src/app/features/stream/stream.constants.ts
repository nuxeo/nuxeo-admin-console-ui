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

export const STREAM_ERROR_MESSAGES = {
  STREAMS_ERROR_MODAL_TITLE: "An error occurred while fetching stream records",
  CONSUMER_ERROR_MODAL_TITLE: "An error occurred while fetching consumer records",
  RECORDS_ERROR_MODAL_TITLE: "An error occurred while fetching records",
}
