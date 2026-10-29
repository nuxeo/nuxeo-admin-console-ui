export interface BundleInfo {
  name: string;
  version?: string;
  /** Only exposed by the server for bundles built from a source revision. */
  revision?: string;
}

export interface DistributionMessage {
  message: string;
}

/* Every field the UI reads defensively (optional-chaining with a fallback) is
declared optional so the compiler verifies those fallbacks and a partial server
response can be modelled without casts. */
export interface DistributionResponse {
  "entity-type"?: string;
  applicationName?: string;
  applicationVersion?: string;
  distributionName?: string;
  distributionVersion?: string;
  bundles?: BundleInfo[];
  warnings?: DistributionMessage[];
  errors?: DistributionMessage[];
}
