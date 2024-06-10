export interface ESType {
  label: string;
  path: string;
  isSelected: boolean;
}

export const ELASTIC_SEARCH_REINDEX_TYPES: ESType[] = [
  { label: "Single Document", path: "single-document", isSelected: true },
  { label: "Folder", path: "folder", isSelected: false },
  { label: "NXQL", path: "nxql", isSelected: false },
];
