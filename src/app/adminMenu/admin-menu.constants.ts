export interface NavItem {
  id: number;
  name: string;
  component: string | null; 
  isSelected: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 0, name: 'Home', component: "admin-home", isSelected: true },
  { id: 1, name: 'System information', component: "admin-header", isSelected: false },
  { id: 2, name: 'Bulk action monitoring', component: "admin-bulk-action-monitoring", isSelected: false },
  { id: 3, name: 'Elasticsearch reindex', component: "admin-elasticsearch-reindex", isSelected: false },
  { id: 4, name: 'Fulltext reindex', component: "admin-fulltext-reindex", isSelected: false },
  { id: 5, name: 'Thumbnails generation', component: "admin-thumbnails-generation", isSelected: false },
  { id: 6, name: 'Picture renditions generation', component: "admin-picture-renditions-generation", isSelected: false },
  { id: 7, name: 'Video renditions generation', component: "admin-video-renditions-generation", isSelected: false }
];