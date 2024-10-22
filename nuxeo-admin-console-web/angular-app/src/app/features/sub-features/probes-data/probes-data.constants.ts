export interface Probe {
    name: string;
    displayName: string;
  }
  
  export const PROBES: Probe[] = [
    { name: "repositoryStatus", displayName: "Repository" },
    { name: "runtimeStatus", displayName: "Runtime" },
    { name: "elasticSearchStatus", displayName: "Elasticsearch" },
    { name: "streamStatus", displayName: "Stream" },
    { name: "ldapDirectories", displayName: "LDAP Directories" },
  ];
  
  export const PROBES_LABELS = {
    PROBE_TITLE: "Probes",
    PROBE_STATUS: "Probes status",
    NEVER_EXECUTED: "Never Executed",
    CHECK_AGAIN: "Check Again",
    DETAILS: "Details",
    NOT_RUN: 'N/A',
    PROBE_LAUNCHED_SUCCESS: "{probeName} checked. Success: True",
    PROBE_LAUNCHED_ERROR: "{probeName} checked. Success: False",
    COLUMN_HEADERS: {
      PROBE: "Probe",
      SUCCESS: "Success",
      LAST_EXECUTED: "Last Executed",
      INFORMATION: "Information",
      RUN: 'Run',               
      SUCCESS_COUNT: 'Success Count', 
      FAILURE_COUNT: 'Failure Count',
      TIME: 'Time',   
      HISTORY: 'History',
      ACTIONS: "Actions",
      STATUS: 'Status'
     
    },
    SUCCESS_STATUS_ICONS: {
      TRUE: "assets/images/check.svg",
      UNKNOWN: "assets/images/question.svg",
      FALSE: "assets/images/error.svg",
    },
  };
  