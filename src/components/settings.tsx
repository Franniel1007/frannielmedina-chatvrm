import React, { useEffect, useState } from "react";
import { IconButton } from "./iconButton";
import { TextButton } from "./textButton";
import { Message } from "@/features/messages/messages";
import {
  KoeiroParam,
  PRESET_A,
  PRESET_B,
  PRESET_C,
  PRESET_D,
} from "@/features/constants/koeiroParam";
import { Link } from "./link";
import { getVoices } from "@/features/elevenlabs/elevenlabs";
import { ElevenLabsParam } from "@/features/constants/elevenLabsParam";
import { RestreamTokens, ChatMessage } from "./restreamTokens";

type Props = {
  openAiKey: string;
  elevenLabsKey: string;
  openRouterKey: string;
  systemPrompt: string;
  chatLog: Message[];
  elevenLabsParam: ElevenLabsParam;
  koeiroParam: KoeiroParam;
  onClickClose: () => void;
  onChangeAiKey: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeOpenRouterKey: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeElevenLabsKey: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeElevenLabsVoice: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onChangeSystemPrompt: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChangeChatLog: (index: number, text: string) => void;
  onChangeKoeiroParam: (x: number, y: number) => void;
  onClickOpenVrmFile: () => void;
  onClickResetChatLog: () => void;
  onClickResetSystemPrompt: () => void;
  backgroundImage: string;
  onChangeBackgroundImage: (image: string) => void;
  onRestreamTokensUpdate?: (tokens: { access_token: string; refresh_token: string } | null) => void;
  onTokensUpdate: (tokens: any) => void;
  onChatMessage: (message: ChatMessage) => void; // <-- tipo corregido
  customErrorMessage: string;
  onChangeCustomErrorMessage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  characterName: string;
  onChangeCharacterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedModel: string;
  onChangeSelectedModel: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const Settings = ({
  openAiKey,
  elevenLabsKey,
  openRouterKey,
  chatLog,
  systemPrompt,
  elevenLabsParam,
  koeiroParam,
  onClickClose,
  onChangeSystemPrompt,
  onChangeAiKey,
  onChangeOpenRouterKey,
  onChangeElevenLabsKey,
  onChangeElevenLabsVoice,
  onChangeChatLog,
  onChangeKoeiroParam,
  onClickOpenVrmFile,
  onClickResetChatLog,
  onClickResetSystemPrompt,
  backgroundImage,
  onChangeBackgroundImage,
  onRestreamTokensUpdate = () => {},
  onTokensUpdate,
  onChatMessage,
  customErrorMessage,
  onChangeCustomErrorMessage,
  characterName,
  onChangeCharacterName,
  selectedModel,
  onChangeSelectedModel,
}: Props) => {
  const [elevenLabsVoices, setElevenLabsVoices] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("general");

  const FREE_MODELS = [
    { value: "google/gemini-2.0-flash-exp:free", label: "Google Gemini 2.0 Flash (Gratis)" },
    { value: "tngtech/deepseek-r1t-chimera:free", label: "DeepSeek Chimera (Gratis)" },
    { value: "x-ai/grok-4-fast:free", label: "Grok 4 Fast (Gratis)" },
  ];

  useEffect(() => {
    if (elevenLabsKey) {
      getVoices(elevenLabsKey).then((data) => {
        setElevenLabsVoices(data.voices);
      });
    }
  }, [elevenLabsKey]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onChangeBackgroundImage(base64String);
        localStorage.setItem('backgroundImage', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = () => {
    onChangeBackgroundImage('');
    localStorage.removeItem('backgroundImage');
  };

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <>
            <div className="my-24">
              <div className="my-16 typography-20 font-bold">Nombre del personaje</div>
              <input
                type="text"
                placeholder="CHARACTER"
                value={characterName}
                onChange={onChangeCharacterName}
                className="my-4 px-16 py-8 w-full h-40 bg-surface3 hover:bg-surface3-hover rounded-4 text-ellipsis"
              />
              <div className="text-sm text-gray-600">
                Cambia el nombre que aparece en el cuadro de diálogo del personaje.
              </div>
            </div>
            <div className="my-24">
              <div className="my-16 typography-20 font-bold">Mensaje de error personalizado</div>
              <input
                type="text"
                placeholder="La API de OpenRouter está caída. Inténtalo de nuevo más tarde."
                value={customErrorMessage}
                onChange={onChangeCustomErrorMessage}
                className="my-4 px-16 py-8 w-full h-40 bg-surface3 hover:bg-surface3-hover rounded-4 text-ellipsis"
              />
              <div className="text-sm text-gray-600">
                Este mensaje se mostrará si la API de OpenRouter no está disponible.
              </div>
            </div>
          </>
        );
      case "api":
        return (
          <>
            <div className="my-24">
              <div className="my-16 typography-20 font-bold">API de OpenRouter</div>
              <input
                type="text"
                placeholder="Clave de API de OpenRouter"
                value={openRouterKey}
                onChange={onChangeOpenRouterKey}
                className="my-4 px-16 py-8 w-full h-40 bg-surface3 hover:bg-surface3-hover rounded-4 text-ellipsis"
              />
              <div>
                Introduce tu clave de API de OpenRouter para un acceso personalizado. Puedes obtener una clave de API en el&nbsp;
                <Link url="https://openrouter.ai/" label="sitio web de OpenRouter" />.
              </div>
            </div>
            <div className="my-24">
              <div className="my-16 typography-20 font-bold">API de ElevenLabs</div>
              <input
                type="text"
                placeholder="Clave de API de ElevenLabs"
                value={elevenLabsKey}
                onChange={onChangeElevenLabsKey}
                className="my-4 px-16 py-8 w-full h-40 bg-surface3 hover:bg-surface3-hover rounded-4 text-ellipsis"
              />
              {/* Aquí está el mensaje de error para ElevenLabs */}
              {elevenLabsKey === '' && (
                <p className="text-red-500 mt-2">
                  ¡No has introducido la API de ElevenLabs, el personaje quedará en silencio! Por favor, obtenga la API, copia y pega desde la pestaña "APIs"
                </p>
              )}
              <div>
                Introduce tu clave de API de ElevenLabs para habilitar la conversión de texto a voz. Puedes obtener una clave de API en el&nbsp;
                <Link url="https://beta.elevenlabs.io/" label="sitio web de ElevenLabs" />.
              </div>
            </div>
          </>
        );
      case "characterSettings":
        return (
          <>
            <div className="my-24">
              <div className="my-16 typography-20 font-bold">Modelo de Lenguaje</div>
              <select
                value={selectedModel}
                onChange={onChangeSelectedModel}
                className="my-4 px-16 py-8 w-full h-40 bg-surface3 hover:bg-surface3-hover rounded-4 text-ellipsis"
              >
                {FREE_MODELS.map((model) => (
                  <option key={model.value} value={model.value}>{model.label}</option>
                ))}
              </select>
            </div>
            <div className="my-40">
              <div className="my-8">
                <div className="my-16 typography-20 font-bold">Configuración del personaje</div>
                <TextButton onClick={onClickResetSystemPrompt}>Restablecer configuración del personaje</TextButton>
              </div>
              <textarea
                value={systemPrompt}
                onChange={onChangeSystemPrompt}
                className="px-16 py-8 bg-surface1 hover:bg-surface1-hover h-168 rounded-8 w-full"
              />
            </div>
            {chatLog.length > 0 && (
              <div className="my-40">
                <div className="my-8 grid-cols-2">
                  <div className="my-16 typography-20 font-bold">Historial de conversaciones</div>
                  <TextButton onClick={onClickResetChatLog}>Restablecer historial de conversaciones</TextButton>
                </div>
                <div className="my-8">
                  {chatLog.map((value, index) => (
                    <div key={index} className="my-8 grid grid-flow-col grid-cols-[min-content_1fr] gap-x-fixed">
                      <div className="w-[64px] py-8">{value.role === "assistant" ? "Personaje" : "Tú"}</div>
                      <input
                        className="bg-surface1 hover:bg-surface1-hover rounded-8 w-full px-16 py-8"
                        type="text"
                        value={value.content}
                        onChange={(event) => onChangeChatLog(index, event.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        );
      case "voice":
        return (
          <>
            <div className="my-40">
              <div className="my-16 typography-20 font-bold">Selección de voz</div>
              <div className="my-16">Selecciona entre las voces de ElevenLabs:</div>
              <div className="my-8">
                <select className="h-40 px-8" id="select-dropdown" onChange={onChangeElevenLabsVoice} value={elevenLabsParam.voiceId}>
                  {elevenLabsVoices.map((voice, index) => (
                    <option key={index} value={voice.voice_id}>{voice.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        );
      case "personalization":
        return (
          <>
            <div className="my-40">
              <div className="my-16 typography-20 font-bold">Modelo del personaje</div>
              <div className="my-8"><TextButton onClick={onClickOpenVrmFile}>Abrir VRM</TextButton></div>
            </div>
            <div className="my-40">
              <div className="my-16 typography-20 font-bold">Imagen de fondo</div>
              <div className="my-16">Elige una imagen de fondo personalizada:</div>
              <div className="my-8 flex flex-col gap-4">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="my-4" />
                {backgroundImage && (
                  <div className="flex flex-col gap-4">
                    <div className="my-8">
                      <img src={backgroundImage} alt="Vista previa del fondo" className="max-w-[200px] rounded-4" />
                    </div>
                    <div className="my-8">
                      <TextButton onClick={handleRemoveBackground}>Eliminar fondo</TextButton>
                    </div>
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  La imagen de fondo se guardará en tu navegador y se restaurará cuando regreses.
                </div>
              </div>
            </div>
          </>
        );
      case "streaming":
        return (
          <div className="my-40">
            <div className="my-16 typography-20 font-bold">Transmisión</div>
            <p>Esta sección lee automáticamente los tokens de Restream desde `restreamTokens.tsx`. No se requiere implementación directa aquí.</p>
            <RestreamTokens onTokensUpdate={onTokensUpdate} onChatMessage={onChatMessage} />
          </div>
        );
      case "about":
        return (
          <div className="my-40">
            <div className="my-16 typography-20 font-bold">Acerca de</div>
            <div className="my-8">
              <p>ChatVRM de FrannielMedina</p>
              <p>v1.0.0</p>
            </div>
            <div className="my-8">
              <p>Versión mejorada basada en <a href="https://github.com/zoan37/ChatVRM" target="_blank" rel="noopener noreferrer">ChatVRM original</a></p>
            </div>
            <div className="my-8">
              <p>©2025 Franniel Medina</p>
              <p><a href="https://beacons.ai/frannielmedinatv" target="_blank" rel="noopener noreferrer">beacons.ai/frannielmedinatv</a></p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="absolute z-40 w-full h-full bg-white/80 backdrop-blur ">
      <div className="absolute m-24">
        <IconButton iconName="24/Close" isProcessing={false} onClick={onClickClose} />
      </div>
      <div className="max-h-full overflow-auto">
        <div className="text-text1 max-w-3xl mx-auto px-24 py-64 ">
          <div className="my-24 typography-32 font-bold">Configuración</div>

          <div className="flex flex-wrap border-b border-gray-300">
            {["general","api","characterSettings","voice","personalization","streaming","about"].map(tab => (
              <button
                key={tab}
                className={`flex items-center gap-2 py-2 px-4 ${activeTab === tab ? "border-b-2 border-blue-500 font-bold" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                <span role="img" aria-label={tab}>{tab === "general" ? "⚙️" : tab === "api" ? "🔧" : tab === "characterSettings" ? "👤" : tab === "voice" ? "🎤" : tab === "personalization" ? "🎨" : tab === "streaming" ? "📡" : "ℹ️"}</span> {tab === "characterSettings" ? "Configuración del personaje" : tab === "personalization" ? "Personaje y personalización" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="mt-8">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};
