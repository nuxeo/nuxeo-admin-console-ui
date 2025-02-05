export interface Stream {
  name: string | null;
  partitions?: number | null;
  codec?: string | null;
}

export interface Consumer {
  stream: string;
  consumer: string;
}
