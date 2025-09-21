import { Message } from "@/features/messages/messages";
import { useMemo } from "react";
import ReactMarkdown from "react-markdown";

export const ChatLog = (props: { messages: Message[] }) => {
  const { messages } = props;

  const getChatRole = (role: string, content: string) => {
    if (role === 'user') {
      const match = content.match(/^\[(.*?)\]/);
      return match ? match[1] : 'Tú';
    }
    return 'Personaje';
  };

  const getChatContent = (role: string, content: string) => {
    if (role === 'user') {
      const match = content.match(/^\[.*?\]\s*(.*)/);
      return match ? match[1].trim() : content;
    }
    return content;
  };

  const logList = useMemo(() => {
    return messages.map((msg, i) => {
      const chatRole = getChatRole(msg.role, msg.content);
      const chatContent = getChatContent(msg.role, msg.content);
      return (
        <div
          key={i}
          className={`my-8 rounded-8 py-8 px-16 max-w-[800px] text-white ${
            msg.role === "assistant"
              ? "bg-secondary ml-auto"
              : "bg-surface1 mr-auto"
          }`}
        >
          <div className="text-sm font-bold">
            {chatRole}
          </div>
          <ReactMarkdown
            components={{
              p: (props) => <p className="text-wrap break-all">{props.children}</p>,
            }}
          >
            {chatContent}
          </ReactMarkdown>
        </div>
      );
    });
  }, [messages]);

  return (
    <div className="absolute top-0 left-0 w-full h-full p-24 pointer-events-none z-10 overflow-hidden">
      <div className="flex flex-col-reverse h-full">
        <div className="w-full h-full overflow-y-auto overflow-x-hidden">
          {logList}
        </div>
      </div>
    </div>
  );
};
