import { useEffect, useRef, useMemo } from "react";
import ReactMarkdown from "react-markdown";
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

  const getChatRoleAndAvatar = (role: string, content: string) => {
    if (role === "user") {
      const matchName = content.match(/^\[(.*?)\]/);
      const matchAvatar = content.match(/<image>(.*?)<\/image>/);
      const displayName = matchName ? matchName[1] : "YOU";
      const avatarUrl = matchAvatar ? matchAvatar[1] : null;
      return { displayName, avatarUrl };
    }
    return { displayName: "CHARACTER", avatarUrl: null };
  };

  const getChatContent = (role: string, content: string) => {
    if (role === "user") {
      const cleanedContent = content
        .replace(/^\[.*?\]/, "")
        .replace(/<image>.*?<\/image>/, "")
        .trim();
      return cleanedContent;
    }
    return content;
  };

  const logList = useMemo(() => {
    return messages.map((msg, i) => {
      const { displayName, avatarUrl } = getChatRoleAndAvatar(
        msg.role,
        msg.content
      );
      const chatContent = getChatContent(msg.role, msg.content);

      return (
        <div key={i} ref={messages.length - 1 === i ? chatScrollRef : null}>
          <Chat
            role={msg.role}
            message={chatContent}
            displayName={displayName}
            avatarUrl={avatarUrl}
          />
        </div>
      );
    });
  }, [messages]);

  return (
    <div className="absolute w-col-span-6 max-w-full h-[100svh] pb-64">
      <div className="max-h-full px-16 pt-104 pb-64 overflow-y-auto scroll-hidden">
        {logList}
      </div>
    </div>
  );
};

const Chat = ({
  role,
  message,
  displayName,
  avatarUrl,
}: {
  role: string;
  message: string;
  displayName: string;
  avatarUrl: string | null;
}) => {
  const roleColor =
    role === "assistant" ? "bg-secondary text-white " : "bg-base text-primary";
  const roleText = role === "assistant" ? "text-secondary" : "text-primary";
  const offsetX = role === "user" ? "pl-40" : "pr-40";
  const textColor = role === "assistant" ? "text-secondary" : "text-primary";

  return (
    <div className={`mx-auto max-w-sm my-16 ${offsetX}`}>
      <div
        className={`px-24 py-8 rounded-t-8 font-Montserrat font-bold tracking-wider flex items-center gap-2 ${roleColor}`}
      >
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={`${displayName}'s profile`}
            className="w-6 h-6 rounded-full"
          />
        )}
        {displayName.toUpperCase()}
      </div>
      <div className="px-24 py-16 bg-white rounded-b-8">
        <div className={`typography-16 font-M_PLUS_2 font-bold ${textColor}`}>
          <ReactMarkdown
            components={{
              p: (props) => <p className="text-wrap break-all">{props.children}</p>,
            }}
          >
            {message}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

