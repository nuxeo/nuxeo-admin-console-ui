export interface LocalPackage {
  "entity-type"?: string;
  id: string;
  name: string;
  title: string;
  description?: string;
  version: string;
  type: string;
  state: string;
  targetPlatforms?: string[];
  vendor?: string;
  supportsHotReload?: boolean;
  provides?: string[];
  dependencies?: string[];
  conflicts?: string[];
  licenseType?: string;
  licenseUrl?: string;
}

export interface LocalPackagesResponse {
  "entity-type"?: string;
  entries: LocalPackage[];
}
