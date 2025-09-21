import { Message } from "../messages/messages";
import { getWindowAI } from 'window.ai';

export async function getChatResponse(messages: Message[], apiKey: string) {
  throw new Error("Not implemented");
}

export async function getChatResponseStream(
  messages: Message[],
  openRouterKey: string,
  customErrorMessage: string,
  selectedModel: string // --- AÑADIR: El modelo seleccionado ---
) {
  console.log('getChatResponseStream');
  console.log('messages');
  console.log(messages);

  // --- Manejo de la clave de API en blanco ---
  if (!openRouterKey || openRouterKey.trim() === "") {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue("Necesitas la API de OpenRouter ve a la Configuración > APIs");
        controller.close();
      },
    });
    return stream;
  }

  const stream = new ReadableStream({
    async start(controller: ReadableStreamDefaultController) {
      try {
        const OPENROUTER_API_KEY = openRouterKey;
        const YOUR_SITE_URL = 'https://chat-vrm-window.vercel.app/';
        const YOUR_SITE_NAME = 'ChatVRM';

        const generation = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": `${YOUR_SITE_URL}`,
            "X-Title": `${YOUR_SITE_NAME}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            // --- USAR: El modelo seleccionado ---
            "model": selectedModel, 
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 200,
            "stream": true,
          })
        });

        // --- Manejo de la API incorrecta o caída ---
        if (!generation.ok) {
          const errorText = await generation.text();
          console.error("Error from OpenRouter API:", generation.status, errorText);

          if (generation.status === 401 || generation.status === 403) {
            controller.enqueue("La API de OpenRouter no funciona o es incorrecta.");
          } else {
            // Usa el mensaje personalizado para otros errores del servidor
            controller.enqueue(customErrorMessage);
          }
          controller.close();
          return;
        }

        if (generation.body) {
          const reader = generation.body.getReader();
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              let chunk = new TextDecoder().decode(value);
              let lines = chunk.split('\n');
              lines = lines.filter((line) => !line.trim().startsWith(": OPENROUTER PROCESSING"));
              lines = lines.filter((line) => !line.trim().endsWith("data: [DONE]"));

              const dataLines = lines.filter(line => line.startsWith("data:"));

              const messages = dataLines.map(line => {
                const jsonStr = line.substring(5);
                return JSON.parse(jsonStr);
              });

              try {
                messages.forEach((message) => {
                  const content = message.choices[0].delta.content;
                  controller.enqueue(content);
                });
              } catch (error) {
                console.error('error processing messages:', messages, error);
                throw error;
              }
            }
          } catch (error) {
            console.error('Error reading the stream', error);
          } finally {
            reader.releaseLock();
          }
        }
      } catch (error) {
        console.error('Error in getChatResponseStream:', error);
        // Usa el mensaje personalizado para errores de red o del navegador
        controller.enqueue(customErrorMessage);
        controller.close();
      } finally {
        controller.close();
      }
    },
  });

  return stream;
}
