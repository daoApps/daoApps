export enum TaskStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface CreateResearchRequest {
  query: string;
  depth?: number;
  max_sources?: number;
  enable_breadth_first?: boolean;
}

export interface CreateResearchResponse {
  task_id: string;
  status: TaskStatus;
  message: string;
}

export interface ResearchStatusResponse {
  task_id: string;
  status: TaskStatus;
  progress: number;
  current_step: string;
  result?: string;
  error?: string;
  created_at: string;
  updated_at: string;
}

export interface ProgressEvent {
  task_id: string;
  status: TaskStatus;
  progress: number;
  current_step: string;
  result?: string;
  error?: string;
  timestamp: number;
}

export interface VersionInfo {
  version: string;
  name: string;
}

export interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
  version: VersionInfo;
}

export interface ErrorResponse {
  detail: string;
  error_code?: string;
}

export type ProgressCallback = (event: ProgressEvent) => void;
export type CompleteCallback = (result: ResearchStatusResponse) => void;
export type ErrorCallback = (error: Error) => void;
