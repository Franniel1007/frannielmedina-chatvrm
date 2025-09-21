// src/pages/index.tsx
import { useCallback, useContext, useEffect, useState } from "react";
import VrmViewer from "@/components/vrmViewer";
import { ViewerContext } from "@/features/vrmViewer/viewerContext";
import { Message, textsToScreenplay, Screenplay } from "@/features/messages/messages";
import { speakCharacter } from "@/features/messages/speakCharacter";
import { MessageInputContainer } from "@/components/messageInputContainer";
import { SYSTEM_PROMPT } from "@/features/constants/systemPromptConstants";
import { KoeiroParam, DEFAULT_KOEIRO_PARAM } from "@/features/constants/koeiroParam";
import { getChatResponseStream } from "@/features/chat/openAiChat";
import { M_PLUS_2, Montserrat } from "next/font/google";
import { Introduction } from "@/components/introduction";
import { Menu } from "@/components/menu";
import { GitHubLink } from "@/components/githubLink";
import { Meta } from "@/components/meta";
import { ElevenLabsParam, DEFAULT_ELEVEN_LABS_PARAM } from "@/features/constants/elevenLabsParam";
import { buildUrl } from "@/utils/buildUrl";
import { websocketService } from "@/services/websocketService";
import { MessageMiddleOut } from "@/features/messages/messageMiddleOut";
import { ChatMessage } from "@/components/restreamTokens";

const m_plus_2 = M_PLUS_2({ variable: "--font-m-plus-2", display: "swap", preload: false });
const montserrat = Montserrat({ variable: "--font-montserrat", display: "swap", subsets: ["latin"] });

type LLMCallbackResult = {
  processed: boolean;
  error?: string;
};

// ✅ Función para generar hash MD5 en el navegador
async function md5Browser(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest("MD5", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

const generateAvatarUrl = async (username: string) => {
  const hash = await md5Browser(username);
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=40`;
};

export default function Home() {
  const { viewer } = useContext(ViewerContext);

  const [systemPrompt, setSystemPrompt] = useState(SYSTEM_PROMPT);
  const [openAiKey, setOpenAiKey] = useState("");
  const [elevenLabsKey, setElevenLabsKey] = useState("");
  const [elevenLabsParam, setElevenLabsParam] = useState<ElevenLabsParam>(DEFAULT_ELEVEN_LABS_PARAM);
  const [koeiroParam, setKoeiroParam] = useState<KoeiroParam>(DEFAULT_KOEIRO_PARAM);
  const [chatProcessing, setChatProcessing] = useState(false);
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [assistantMessage, setAssistantMessage] = useState("");
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [restreamTokens, setRestreamTokens] = useState<any>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [openRouterKey, setOpenRouterKey] = useState<string>(() =>
    typeof window !== "undefined" ? localStorage.getItem("openRouterKey") || "" : ""
  );
  const [customErrorMessage, setCustomErrorMessage] = useState<string>(
    "La API de OpenRouter está temporalmente caída. Inténtalo de nuevo más tarde."
  );
  const [hasCustomError, setHasCustomError] = useState(false);
  const [characterName, setCharacterName] = useState<string>(
    typeof window !== "undefined" ? localStorage.getItem("characterName") || "CHARACTER" : "CHARACTER"
  );
  const [selectedModel, setSelectedModel] = useState<string>(
    typeof window !== "undefined" ? localStorage.getItem("selectedModel") || "google/gemini-2.0-flash-exp:free" : "google/gemini-2.0-flash-exp:free"
  );

  // --- Load saved parameters
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = window.localStorage.getItem("chatVRMParams");
    if (params) {
      const parsed = JSON.parse(params);
      setSystemPrompt(parsed.systemPrompt);
      setElevenLabsParam(parsed.elevenLabsParam);
      setChatLog(parsed.chatLog);
    }

    const savedKeys = ["elevenLabsKey", "openRouterKey", "backgroundImage", "customErrorMessage", "characterName", "selectedModel"];
    savedKeys.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value) {
        switch (key) {
          case "elevenLabsKey": setElevenLabsKey(value); break;
          case "openRouterKey": setOpenRouterKey(value); break;
          case "backgroundImage": setBackgroundImage(value); break;
          case "customErrorMessage": setCustomErrorMessage(value); break;
          case "characterName": setCharacterName(value); break;
          case "selectedModel": setSelectedModel(value); break;
        }
      }
    });
  }, []);

  // --- Save parameters
  useEffect(() => {
    window.localStorage.setItem("chatVRMParams", JSON.stringify({ systemPrompt, elevenLabsParam, chatLog }));
    window.localStorage.setItem("elevenLabsKey", elevenLabsKey);
  }, [systemPrompt, elevenLabsParam, chatLog, elevenLabsKey]);

  // --- Background image
  useEffect(() => {
    document.body.style.backgroundImage = backgroundImage ? `url(${backgroundImage})` : `url(${buildUrl("/bg-c.png")})`;
  }, [backgroundImage]);

  // --- Custom error message save
  useEffect(() => {
    if (hasCustomError) {
      window.localStorage.setItem("customErrorMessage", customErrorMessage);
      setHasCustomError(false);
    }
  }, [customErrorMessage, hasCustomError]);

  // --- Chat log update
  const handleChangeChatLog = useCallback(
    (targetIndex: number, text: string) => {
      setChatLog((prev) =>
        prev.map((msg, i) => (i === targetIndex ? { ...msg, content: text } : msg))
      );
    },
    []
  );

  // --- AI speech
  const handleSpeakAi = useCallback(
    async (screenplay: Screenplay, elevenLabsKey: string, elevenLabsParam: ElevenLabsParam, onStart?: () => void, onEnd?: () => void) => {
      setIsAISpeaking(true);
      try {
        await speakCharacter(screenplay, elevenLabsKey, elevenLabsParam, viewer, () => {
          setIsPlayingAudio(true);
          onStart?.();
        }, () => {
          setIsPlayingAudio(false);
          onEnd?.();
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsAISpeaking(false);
      }
    },
    [viewer]
  );

  // --- Send chat
  const handleSendChat = useCallback(
    async (text: string, displayMessage?: string) => {
      if (!text) return;

      setChatProcessing(true);
      const messageLog: Message[] = [...chatLog, { role: "user", content: displayMessage || text }];
      setChatLog(messageLog);

      const processedMessages = new MessageMiddleOut().process([{ role: "system", content: systemPrompt }, ...messageLog]);

      const key = openRouterKey || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY!;
      const stream = await getChatResponseStream(processedMessages, key, customErrorMessage, selectedModel).catch((e) => {
        console.error(e);
        return null;
      });

      if (!stream) {
        setChatProcessing(false);
        return;
      }

      const reader = stream.getReader();
      let receivedMessage = "";
      let aiTextLog = "";
      const sentences: string[] = [];

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          receivedMessage += value;
          const sentenceMatch = receivedMessage.match(/^(.+[。．！？\n.!?]|.{10,}[、,])/);
          if (sentenceMatch?.[0]) {
            const sentence = sentenceMatch[0];
            sentences.push(sentence);
            receivedMessage = receivedMessage.slice(sentence.length).trimStart();
            const aiText = sentence;
            const aiTalks = textsToScreenplay([aiText], koeiroParam);
            aiTextLog += aiText;
            handleSpeakAi(aiTalks[0], elevenLabsKey, elevenLabsParam, () => {
              setAssistantMessage(sentences.join(" "));
            });
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        reader.releaseLock();
      }

      setChatLog([...messageLog, { role: "assistant", content: aiTextLog }]);
      setChatProcessing(false);
    },
    [chatLog, systemPrompt, koeiroParam, elevenLabsKey, elevenLabsParam, openRouterKey, selectedModel, customErrorMessage, handleSpeakAi]
  );

  const handleTokensUpdate = useCallback((tokens: any) => setRestreamTokens(tokens), []);
  const handleChatMessage = useCallback((message: ChatMessage) => {
    const textToAI = `[${message.displayName}] ${message.text}`;
    handleSendChat(textToAI);
  }, [handleSendChat]);

  // --- Websocket callback
  useEffect(() => {
    websocketService.setLLMCallback(async (message: string): Promise<LLMCallbackResult> => {
      if (isAISpeaking || isPlayingAudio || chatProcessing) return { processed: false, error: "System busy" };
      try {
        await handleSendChat(message);
        return { processed: true };
      } catch (error) {
        return { processed: false, error: error instanceof Error ? error.message : "Unknown error" };
      }
    });
  }, [handleSendChat, chatProcessing, isAISpeaking, isPlayingAudio]);

  return (
    <div className={`${m_plus_2.variable} ${montserrat.variable}`}>
      <Meta />
      <Introduction openAiKey={openAiKey} onChangeAiKey={setOpenAiKey} elevenLabsKey={elevenLabsKey} onChangeElevenLabsKey={setElevenLabsKey} />
      <VrmViewer />
      <MessageInputContainer isChatProcessing={chatProcessing} onChatProcessStart={handleSendChat} />
      <Menu
        openAiKey={openAiKey}
        elevenLabsKey={elevenLabsKey}
        openRouterKey={openRouterKey}
        systemPrompt={systemPrompt}
        chatLog={chatLog}
        elevenLabsParam={elevenLabsParam}
        koeiroParam={koeiroParam}
        assistantMessage={assistantMessage}
        onChangeAiKey={setOpenAiKey}
        onChangeElevenLabsKey={setElevenLabsKey}
        onChangeSystemPrompt={setSystemPrompt}
        onChangeChatLog={handleChangeChatLog}
        onChangeElevenLabsParam={setElevenLabsParam}
        onChangeKoeiromapParam={setKoeiroParam}
        handleClickResetChatLog={() => setChatLog([])}
        handleClickResetSystemPrompt={() => setSystemPrompt(SYSTEM_PROMPT)}
        backgroundImage={backgroundImage}
        onChangeBackgroundImage={setBackgroundImage}
        onTokensUpdate={handleTokensUpdate}
        onChatMessage={handleChatMessage}
        customErrorMessage={customErrorMessage}
        onChangeCustomErrorMessage={setCustomErrorMessage}
        characterName={characterName}
        onChangeCharacterName={(e) => { setCharacterName(e.target.value); localStorage.setItem('characterName', e.target.value); }}
        selectedModel={selectedModel}
        onChangeSelectedModel={(e) => { setSelectedModel(e.target.value); localStorage.setItem('selectedModel', e.target.value); }}
      />
      <GitHubLink />
    </div>
  );
}
