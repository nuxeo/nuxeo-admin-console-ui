export interface BundleInfo {
  name: string;
  version: string;
  /** Only exposed by the server for bundles built from a source revision. */
  revision?: string;
}

export interface DistributionMessage {
  message: string;
}

export interface DistributionResponse {
  "entity-type"?: string;
  applicationName: string;
  applicationVersion: string;
  distributionName: string;
  distributionVersion: string;
  distributionDate: string;
  bundles: BundleInfo[];
  warnings: DistributionMessage[];
  errors: DistributionMessage[];
}
