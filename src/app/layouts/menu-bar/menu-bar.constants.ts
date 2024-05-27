export interface MenuBar {
    id: number;
    name: string;
    path: string | null;
    isSelected: boolean;
}

export const ADMIN_MENU: MenuBar[] = [
    { id: 0, name: 'Home', path: "home", isSelected: true },
    { id: 1, name: 'System Information', path: "system-information", isSelected: false },
    { id: 2, name: 'Bulk Action Monitoring', path: "bulk-action-monitoring", isSelected: false },
    { id: 3, name: 'Elasticsearch Reindex', path: "elasticsearch-reindex", isSelected: false },
    { id: 4, name: 'Fulltext Reindex', path: "fulltext-reindex", isSelected: false },
    { id: 5, name: 'Thumbnails Generation', path: "thumbnails-generation", isSelected: false },
    { id: 6, name: 'Picture Renditions Generation', path: "picture-renditions-generation", isSelected: false },
    { id: 7, name: 'Video Renditions Generation', path: "video-renditions-generation", isSelected: false }
];