export interface CapabilitiesResponse {
  server: {
    distributionVersion: string | null;
  };
  cluster: {
    enabled: boolean | null;
  };
}
