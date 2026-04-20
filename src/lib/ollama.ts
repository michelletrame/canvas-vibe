const OLLAMA_BASE = process.env.NEXT_PUBLIC_OLLAMA_BASE ?? "http://localhost:11434"
export const OLLAMA_MODEL = "glm-4.7-flash:latest"


export type OllamaMessage = { role: "user" | "assistant" | "system"; content: string }

export async function streamOllamaChat(
  messages: OllamaMessage[],
  callbacks: {
    onChunk: (chunk: string) => void
    onDone:  (fullContent: string) => void
    onError: (message: string) => void
  },
  signal?: AbortSignal,
  options?: { forceJson?: boolean },
): Promise<void> {
  try {
    const body: Record<string, unknown> = {
      model: OLLAMA_MODEL,
      messages,
      stream: false,
      think: false,
      options: { temperature: options?.forceJson ? 0 : 0.7 },
    }
    if (options?.forceJson) body.format = "json"

    const res = await fetch(`${OLLAMA_BASE}/api/chat`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
      signal,
    })

    if (!res.ok) {
      callbacks.onError(`HTTP ${res.status}: ${res.statusText}`)
      return
    }

    const data    = await res.json()
    const content = data.message?.content ?? ""
    callbacks.onDone(content)
  } catch (err) {
    if ((err as Error).name !== "AbortError")
      callbacks.onError(err instanceof Error ? err.message : "Network error")
  }
}
