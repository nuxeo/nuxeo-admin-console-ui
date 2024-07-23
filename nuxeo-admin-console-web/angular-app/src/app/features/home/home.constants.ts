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
  NEVER_EXECUTED: "Never Executed",
  COLUMN_HEADERS: {
    PROBE: "Probe",
    SUCCESS: "Success",
    LAST_EXECUTED: "Last Executed",
    INFORMATION: "Information",
  },
  SUCCESS_STATUS_ICONS: {
    TRUE: "assets/images/check.svg",
    UNKNOWN: "assets/images/question.svg",
    FALSE: "assets/images/error.svg",
  },
};

export const REGISTRATION_VERSION_LABELS = {
  VERSION_TITLE: "Version:",
  CLUSTER_ENABLED: "Cluster Enabled:",
  VERSION_INFO: "Version Info"
};

