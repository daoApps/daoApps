import { ref, onUnmounted } from 'vue'

export type SSEConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error'

export interface SSEMessage {
  data: string
  id?: string
  event?: string
}

export function useSSE() {
  const connectionState = ref<SSEConnectionState>('disconnected')
  const messages = ref<SSEMessage[]>([])
  const error = ref<string | null>(null)
  let eventSource: EventSource | null = null
  let mockInterval: ReturnType<typeof setInterval> | null = null

  const connect = (_url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        connectionState.value = 'connecting'
        error.value = null

        // 在实际应用中，这里会使用真正的 EventSource
        // eventSource = new EventSource(url)

        // 模拟连接成功
        setTimeout(() => {
          connectionState.value = 'connected'
          resolve()
          startMockStream()
        }, 500)
      } catch (e) {
        connectionState.value = 'error'
        error.value = e instanceof Error ? e.message : '连接失败'
        reject(e)
      }
    })
  }

  const startMockStream = () => {
    // 模拟 SSE 数据流
    const mockData = [
      '这是',
      '一个',
      '模拟',
      '的',
      'SSE',
      '流式',
      '输出',
      '示例',
      '。'
    ]

    let index = 0
    mockInterval = setInterval(() => {
      if (index < mockData.length) {
        const data = mockData[index]
        if (data !== undefined) {
          const newMessage: SSEMessage = {
            data: data,
            id: `msg-${Date.now()}`
          }
          messages.value.push(newMessage)
        }
        index++
      } else {
        disconnect()
      }
    }, 200)
  }

  const sendMockContent = (content: string, onChunk: (chunk: string) => void): Promise<void> => {
    return new Promise((resolve) => {
      connectionState.value = 'connecting'

      setTimeout(() => {
        connectionState.value = 'connected'
        let currentIndex = 0

        const interval = setInterval(() => {
          if (currentIndex < content.length) {
            const charsToAdd = Math.min(
              Math.floor(Math.random() * 3) + 1,
              content.length - currentIndex
            )
            const chunk = content.slice(currentIndex, currentIndex + charsToAdd)
            onChunk(chunk)

            const chunkMessage: SSEMessage = {
              data: chunk,
              id: `chunk-${Date.now()}`
            }
            messages.value.push(chunkMessage)

            currentIndex += charsToAdd
          } else {
            clearInterval(interval)
            connectionState.value = 'connected'
            resolve()
          }
        }, 30)
      }, 100)
    })
  }

  const disconnect = () => {
    if (eventSource) {
      eventSource.close()
      eventSource = null
    }

    if (mockInterval) {
      clearInterval(mockInterval)
      mockInterval = null
    }

    connectionState.value = 'disconnected'
  }

  const clearMessages = () => {
    messages.value = []
  }

  onUnmounted(() => {
    disconnect()
  })

  return {
    connectionState,
    messages,
    error,
    connect,
    disconnect,
    sendMockContent,
    clearMessages
  }
}
