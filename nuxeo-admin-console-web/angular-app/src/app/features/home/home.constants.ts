
export const REGISTRATION_VERSION_LABELS = {
  VERSION_TITLE: "Version:",
  CLUSTER_ENABLED: "Cluster Enabled:",
};

export const INSTANCE_INFO_LABELS = {
  ENTITY_TYPE: "Entity Type:",
  REGISTERED: "Registered:",
  REGISTRATION_EXPIRATION: "End Date:",
  INSTANCE_TYPE: "Instance Type:",
  CONTRACT_STATUS: "Contract Status:",
  DESCRIPTION: "Description:",
  MESSAGE: "Message:",
  END_DATE: "End Date:",
  CLID: "CLID:",
  CTID: "CTID:",
  INSTANCE_INFO_LABEL: "Instance Information",
};

export const INSTANCE_INFO_DATA_LABELS = [
  { label: INSTANCE_INFO_LABELS.REGISTERED, key: 'registered' },
  { label: INSTANCE_INFO_LABELS.REGISTRATION_EXPIRATION, key: 'registrationExpiration', isDate: true },
  { label: INSTANCE_INFO_LABELS.INSTANCE_TYPE, key: 'instanceType' },
  { label: INSTANCE_INFO_LABELS.CONTRACT_STATUS, key: 'contractStatus' },
  { label: INSTANCE_INFO_LABELS.DESCRIPTION, key: 'description' },
  { label: INSTANCE_INFO_LABELS.MESSAGE, key: 'message' },
];