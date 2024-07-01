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
];

export const ROUTES_TITLE = {
  HOME: "Home",
  ELASTICSEARCH_REINDEX: "ElasticSearch Reindex"
}
