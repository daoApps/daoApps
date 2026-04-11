import { ref, computed, onUnmounted } from 'vue';
import type {
  MCPAgentInfo,
  MCPCollaborationCreateRequest,
  MCPCollaborationStatusResponse,
  MCPProgressEvent,
  MCPSendMessageRequest,
  CollaborationStatus,
} from '../services/mcp/types';
import { MCPClient } from '../services/mcp/client';

interface UseMultiAgentCollaborationOptions {
  baseURL: string;
  apiKey?: string;
}

export function useMultiAgentCollaboration(options: UseMultiAgentCollaborationOptions) {
  const client = new MCPClient({
    baseURL: options.baseURL,
    apiKey: options.apiKey,
  });

  const agents = ref<MCPAgentInfo[]>([]);
  const currentSessionId = ref<string | null>(null);
  const sessionStatus = ref<CollaborationStatus | null>(null);
  const progress = ref(0);
  const tasks = ref<MCPCollaborationStatusResponse['tasks']>([]);
  const messages = ref<MCPCollaborationStatusResponse['messages']>([]);
  const result = ref<MCPCollaborationStatusResponse['result']>(null);
  const error = ref<string | null>(null);
  const isLoading = ref(false);
  const isConnected = ref(false);

  let unsubscribe: (() => void) | null = null;

  const hasActiveSession = computed(() => {
    return currentSessionId.value !== null &&
      sessionStatus.value !== 'completed' &&
      sessionStatus.value !== 'failed' &&
      sessionStatus.value !== 'cancelled';
  });

  const canCancel = computed(() => {
    return hasActiveSession.value &&
      sessionStatus.value !== 'completed' &&
      sessionStatus.value !== 'failed';
  });

  async function loadAgents(): Promise<MCPAgentInfo[]> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await client.listAgents();
      agents.value = response.agents;
      isConnected.value = true;
      return response.agents;
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
      isConnected.value = false;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function createCollaboration(
    request: MCPCollaborationCreateRequest
  ): Promise<string> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await client.createCollaboration(request);
      currentSessionId.value = response.session_id;
      sessionStatus.value = response.status as CollaborationStatus;
      progress.value = 0;
      messages.value = [];
      tasks.value = [];
      result.value = null;

      startStreaming();
      isLoading.value = false;
      return response.session_id;
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
      isLoading.value = false;
      throw err;
    }
  }

  function startStreaming() {
    if (!currentSessionId.value) {
      return;
    }

    unsubscribe = client.streamProgress(
      currentSessionId.value,
      handleProgress,
      handleComplete,
      handleError
    );
  }

  function handleProgress(event: MCPProgressEvent) {
    if (event.status) {
      sessionStatus.value = event.status;
    }
    progress.value = event.progress;

    if (event.task_update) {
      const index = tasks.value.findIndex(t => t.id === event.task_update!.id);
      if (index >= 0) {
        tasks.value[index] = { ...tasks.value[index], ...event.task_update };
      }
    }

    if (event.new_message) {
      messages.value.push(event.new_message);
    }
  }

  function handleComplete(status: MCPCollaborationStatusResponse) {
    sessionStatus.value = status.status;
    progress.value = 1.0;
    tasks.value = status.tasks;
    messages.value = status.messages;
    result.value = status.result;
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  }

  function handleError(err: Error) {
    error.value = err.message;
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  }

  async function refreshStatus(): Promise<MCPCollaborationStatusResponse> {
    if (!currentSessionId.value) {
      throw new Error('No active session');
    }

    try {
      const status = await client.getCollaborationStatus(currentSessionId.value);
      sessionStatus.value = status.status;
      progress.value = status.progress;
      tasks.value = status.tasks;
      messages.value = status.messages;
      result.value = status.result;
      error.value = status.error;
      return status;
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
      throw err;
    }
  }

  async function sendMessage(request: Omit<MCPSendMessageRequest, 'session_id'>): Promise<void> {
    if (!currentSessionId.value) {
      throw new Error('No active session');
    }

    try {
      await client.sendMessage(currentSessionId.value, request);
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
      throw err;
    }
  }

  async function cancel(): Promise<void> {
    if (!currentSessionId.value) {
      return;
    }

    try {
      await client.cancelCollaboration(currentSessionId.value);
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
      sessionStatus.value = 'cancelled';
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
      throw err;
    }
  }

  function reset(): void {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
    client.close();
    currentSessionId.value = null;
    sessionStatus.value = null;
    progress.value = 0;
    tasks.value = [];
    messages.value = [];
    result.value = null;
    error.value = null;
    isLoading.value = false;
  }

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
    }
    client.close();
  });

  return {
    agents,
    currentSessionId,
    sessionStatus,
    progress,
    tasks,
    messages,
    result,
    error,
    isLoading,
    isConnected,
    hasActiveSession,
    canCancel,
    loadAgents,
    createCollaboration,
    refreshStatus,
    sendMessage,
    cancel,
    reset,
  };
}
