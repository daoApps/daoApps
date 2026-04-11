// MCP (Multi-Agent Collaboration Platform) Types

export enum CollaborationStatus {
  PENDING = "pending",
  RUNNING = "running",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
  PAUSED = "paused",
}

export enum MessageType {
  REQUEST = "request",
  RESPONSE = "response",
  NOTIFICATION = "notification",
  WARNING = "warning",
  CONFLICT = "conflict",
  SYSTEM = "system",
}

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  PAUSED = "paused",
  CANCELLED = "cancelled",
  ERROR = "error",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export enum CollaborationMode {
  SERIAL = "serial",
  PARALLEL = "parallel",
  ROUND_ROBIN = "round_robin",
}

export enum AgentCollaborationMode {
  LEADER = "leader",
  COLLABORATOR = "collaborator",
  REVIEWER = "reviewer",
}

export interface MCPAgentInfo {
  id: string;
  name: string;
  avatar: string;
  role: string;
  specialty: string[];
  description: string;
  skills: string[];
  level: number;
  collaboration_mode: AgentCollaborationMode;
  enabled: boolean;
}

export interface MCPListAgentsResponse {
  agents: MCPAgentInfo[];
  total: number;
}

export interface MCPCollaborationCreateRequest {
  title: string;
  agent_ids: string[];
  tasks?: Array<Record<string, unknown>>;
  mode?: CollaborationMode;
  description?: string;
}

export interface MCPCollaborationCreateResponse {
  session_id: string;
  status: string;
  message: string;
}

export interface MCPTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  progress: number;
  assigned_agent_id?: string;
  estimated_time?: number;
  result?: string;
  quality_score?: number;
}

export interface MCPMessage {
  id: string;
  from_agent_id: string;
  from_agent_name: string;
  to_agent_id?: string;
  to_agent_name?: string;
  type: MessageType;
  content: string;
  timestamp: string;
}

export interface MCPAgentResult {
  agent_id: string;
  agent_name: string;
  output: string;
  score: number;
  feedback?: string;
  timestamp: string;
}

export interface MCPCollaborationResult {
  id: string;
  session_id: string;
  summary: string;
  agent_results: MCPAgentResult[];
  overall_score: number;
  export_formats: string[];
}

export interface MCPCollaborationStatusResponse {
  session_id: string;
  title: string;
  status: CollaborationStatus;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  progress: number;
  agent_ids: string[];
  tasks: MCPTask[];
  messages: MCPMessage[];
  result: MCPCollaborationResult | null;
  error: string | null;
}

export interface MCPProgressEvent {
  session_id: string;
  status: CollaborationStatus | null;
  progress: number;
  current_step?: string;
  message?: string;
  timestamp: string;
  new_message?: MCPMessage;
  task_update?: MCPTask;
}

export interface MCPSendMessageRequest {
  from_agent_id: string;
  from_agent_name: string;
  to_agent_id?: string;
  to_agent_name?: string;
  content: string;
  message_type?: MessageType;
}

export interface MCPSendMessageResponse {
  message_id: string;
  status: string;
}

export type MCPCallback<T> = (data: T) => void;

export interface MCPProgressCallback extends MCPCallback<MCPProgressEvent> {}
export interface MCPCompleteCallback extends MCPCallback<MCPCollaborationStatusResponse> {}
export interface MCPErrorCallback extends MCPCallback<Error> {}

export interface MCPClientConfig {
  baseURL: string;
  apiKey?: string;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
}
