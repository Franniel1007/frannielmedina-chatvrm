import React, { useEffect, useState, useRef } from "react";
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
import { buildUrl } from "@/utils/buildUrl"; // Importamos buildUrl para la imagen de GitHub

// ... (El resto de tus props)

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
  onChatMessage: (message: ChatMessage) => void;
  customErrorMessage: string;
  onChangeCustomErrorMessage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  characterName: string;
  onChangeCharacterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedModel: string;
  onChangeSelectedModel: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onClickResetAllSettings: () => void;
  onClickResetVrm: () => void;
};

// ... (Tu componente Settings con todas las destructuraciones)

export const Settings = (
  // ... (Tus props)
) => {
  // ... (El resto de tus estados y funciones)

  const renderContent = () => {
    switch (activeTab) {
      // ... (Resto de casos como "general", "api", etc.)
      case "about":
        return (
          <div className="my-40">
            <div className="my-16 typography-20 font-bold">Acerca de</div>
            <div className="my-8">
              <p>ChatVRM de FrannielMedina</p>
              <p>v1.0.0</p>
            </div>
            <div className="my-8">
              <p>Versión mejorada basada en <a href="https://github.com/zoan37/ChatVRM" target="_blank" rel="noopener noreferrer">ChatVRM original y de Pixiv</a></p>
            </div>

            {/* AÑADIR EL BOTÓN DE GITHUB AQUÍ */}
            <div className="my-24">
              <a
                draggable={false}
                href="https://github.com/frannielmedina/frannielmedina-chatvrm/" // Enlace actualizado
                rel="noopener noreferrer"
                target="_blank"
              >
                <div className="p-8 rounded-16 bg-[#1F2328] hover:bg-[#33383E] active:bg-[565A60] flex items-center w-fit">
                  <img
                    alt="GitHub Repository"
                    height={24}
                    width={24}
                    src={buildUrl("/github-mark-white.svg")}
                  ></img>
                  <div className="mx-4 text-white font-bold">Ver en GitHub</div>
                </div>
              </a>
            </div>
            {/* FIN DEL BOTÓN DE GITHUB */}

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

  // ... (El resto del componente Settings)
};
