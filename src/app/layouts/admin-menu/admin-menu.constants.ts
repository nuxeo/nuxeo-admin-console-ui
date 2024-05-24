export interface AdminMenu {
    id: number;
    name: string;
    path: string | null;
    isSelected: boolean;
}

export const ADMIN_MENU: AdminMenu[] = [
    { id: 0, name: 'Home', path: "admin-home", isSelected: true },
    { id: 1, name: 'System Information', path: "system-information", isSelected: false },
    { id: 2, name: 'Bulk Action Monitoring', path: "admin-bulk-action-monitoring", isSelected: false },
    { id: 3, name: 'Elasticsearch Reindex', path: "admin-elasticsearch-reindex", isSelected: false },
    { id: 4, name: 'Fulltext Reindex', path: "admin-fulltext-reindex", isSelected: false },
    { id: 5, name: 'Thumbnails Generation', path: "admin-thumbnails-generation", isSelected: false },
    { id: 6, name: 'Picture Renditions Generation', path: "admin-picture-renditions-generation", isSelected: false },
    { id: 7, name: 'Video Renditions Generation', path: "admin-video-renditions-generation", isSelected: false }
];