export interface NavItem {
    id: number;
    name: string;
    component: string | null; 
    isSelected: boolean;
  }
  
  export const NAV_ITEMS: NavItem[] = [
    { id: 0, name: 'Home', component: "<admin-home></admin-home>", isSelected: true },
    { id: 1, name: 'System information', component: "<admin-header></admin-header>", isSelected: false },
    { id: 2, name: 'Bulk action monitoring', component: null, isSelected: false },
    { id: 3, name: 'Elasticsearch reindex', component: null, isSelected: false },
    { id: 4, name: 'Fulltext reindex', component: null, isSelected: false },
    { id: 5, name: 'Thumbnails generation', component: null, isSelected: false },
    { id: 6, name: 'Picture renditions generation', component: null, isSelected: false },
    { id: 7, name: 'Video renditions generation', component: null, isSelected: false }
  ];