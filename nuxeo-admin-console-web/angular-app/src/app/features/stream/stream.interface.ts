export interface Stream {
  name: string | null;
  partitions?: number | null;
  codec?: string | null;
}

export interface Consumer {
  stream: string;
  consumer: string;
}

export interface RecordsPayload {
  stream: string;
  rewind: string;
  limit: string;
  timeout: string;
  fromGroup?: string;
  fromTail?: boolean;
  fromOffset?: string;
  partition?: string;
}
