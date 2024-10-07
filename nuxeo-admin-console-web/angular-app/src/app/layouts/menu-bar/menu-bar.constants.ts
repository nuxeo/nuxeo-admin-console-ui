export interface Menu {
  id: number;
  name: string;
  path: string | null;
  isSelected: boolean;
}

export const ADMIN_MENU: Menu[] = [
  { id: 0, name: "Home", path: "", isSelected: false },
  {
    id: 1,
    name: "Elasticsearch Reindex",
    path: "elasticsearch-reindex",
    isSelected: false,
  },
  {
    id: 2,
    name: "Bulk Action Monitoring",
    path: "bulk-action-monitoring",
    isSelected: false,
  },
  {
    id: 3,
    name: "Probes",
    path: "probes",
    isSelected: false,
  },
  {
    id: 4,
    name: "Video Renditions Generation",
    path: "video-renditions-generation",
    isSelected: false,
  },
];

export const ROUTES_TITLE = {
  HOME: "Home",
  ELASTICSEARCH_REINDEX: "ElasticSearch Reindex",
  BULKACTIONMONITORING: "Bulk Action Monitoring",
  PROBES: "Probes",
};