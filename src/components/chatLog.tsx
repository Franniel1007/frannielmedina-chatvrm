import { useEffect, useRef } from "react";
import { Message } from "@/features/messages/messages";
type Props = {
  messages: Message[];
};
export const ChatLog = ({ messages }: Props) => {
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({
      behavior: "auto",
      block: "center",
    });
  }, []);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [messages]);
  return (
    <div className="absolute w-col-span-6 max-w-full h-[100svh] pb-64">
      <div className="max-h-full px-16 pt-104 pb-64 overflow-y-auto scroll-hidden">
        {messages.map((msg, i) => {
          return (
            <div key={i} ref={messages.length - 1 === i ? chatScrollRef : null}>
              <Chat role={msg.role} message={msg.content} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Chat = ({ role, message }: { role: string; message: string }) => {
  // Ajuste: Todos los mensajes de usuario (user o Restream user) tienen el mismo estilo de color
  const roleColor =
    role === "assistant" ? "bg-secondary text-white " : "bg-base text-primary"; 
  const roleText = role === "assistant" ? "text-secondary" : "text-primary";
  // Los mensajes de usuario van a la derecha, los del asistente a la izquierda
  const offsetX = role === "assistant" ? "pr-40" : "pl-40"; 

  // Determinar el texto a mostrar en el encabezado
  let headerText = "";
  if (role === "assistant") {
    headerText = "CHARACTER";
  } else if (role === "user") {
    headerText = "YOU";
  } else {
    // Si el rol no es 'assistant' ni 'user', es el displayName de Restream
    headerText = role; 
  }

  return (
    <div className={`mx-auto max-w-sm my-16 ${offsetX}`}>
      <div
        className={`px-24 py-8 rounded-t-8 font-Montserrat font-bold tracking-wider ${roleColor}`}
      >
        {/* Usar la variable headerText (el nombre del usuario de Restream si aplica) */}
        {headerText.toUpperCase()}
      </div>
      <div className="px-24 py-16 bg-white rounded-b-8">
        <div className={`typography-16 font-M_PLUS_2 font-bold ${roleText}`}>
          {message}
        </div>
      </div>
    </div>
  );
};
