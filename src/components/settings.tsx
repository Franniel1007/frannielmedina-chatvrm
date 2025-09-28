import React, { useCallback, useContext, useState, useRef, ChangeEvent, useMemo } from "react";
import { Message } from "@/features/messages/messages";
import { ElevenLabsParam } from "@/features/constants/elevenLabsParam";
import { KoeiroParam } from "@/features/constants/koeiroParam";
import { IconButton } from "./iconButton";
import { TextButton } from "./textButton";
import { SettingsModel } from "./settingsModel";
import { SettingsVoice } from "./settingsVoice";
import { SettingsCharacter } from "./settingsCharacter";
import { SettingsChatLog } from "./settingsChatLog";
import { SettingsGeneral } from "./settingsGeneral";
import { SettingsDangerZone } from "./settingsDangerZone";
import { SettingsPersonalization } from "./settingsPersonalization";
import { SettingsStreaming } from "./settingsStreaming";
import { SettingsAbout } from "./settingsAbout";
import { KoeiroMap } from "./koeiromap";
import { ViewerContext } from "@/features/vrmViewer/viewerContext";
import { ChatMessage } from "./restreamTokens";
import { CharacterNameInput } from "./characterNameInput";

// (Eliminar import LanguageCode)

type Tab =
  | "general"
  | "model"
  | "chatSettings"
  | "voice"
  | "personalization"
  | "streaming"
  | "about";

type Props = {
  openAiKey: string;
  elevenLabsKey: string;
  openRouterKey: string;
  systemPrompt: string;
  chatLog: Message[];
  elevenLabsParam: ElevenLabsParam;
  koeiroParam: KoeiroParam;
  onClickClose: () => void;
  // <Settings /> espera el evento completo, que le llega de Menu.tsx
  onChangeAiKey: (event: React.ChangeEvent<HTMLInputElement>) => void; 
  onChangeElevenLabsKey: (key: string) => void;
  onChangeElevenLabsVoice: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onChangeSystemPrompt: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChangeChatLog: (index: number, text: string) => void;
  onChangeKoeiroParam: (x: number, y: number) => void;
  onClickOpenVrmFile: () => void;
  onClickResetChatLog: () => void;
  onClickResetSystemPrompt: () => void;
  backgroundImage: string;
  onChangeBackgroundImage: (image: string) => void;
  onTokensUpdate: (tokens: any) => void;
  onChatMessage: (message: ChatMessage) => void;
  onChangeOpenRouterKey: (event: React.ChangeEvent<HTMLInputElement>) => void;
  customErrorMessage: string;
  onChangeCustomErrorMessage: (message: string) => void;
  characterName: string;
  onChangeCharacterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedModel: string;
  onChangeSelectedModel: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onClickResetAllSettings: () => void;
  onClickResetVrm: () => void;

  // (Eliminar props de idioma)
  // language: LanguageCode;
  // setAppLanguage: (lang: LanguageCode) => void;
};

export const Settings = ({
  openAiKey,
  elevenLabsKey,
  openRouterKey,
  systemPrompt,
  chatLog,
  elevenLabsParam,
  koeiroParam,
  onClickClose,
  onChangeAiKey,
  onChangeElevenLabsKey,
  onChangeElevenLabsVoice,
  onChangeSystemPrompt,
  onChangeChatLog,
  onChangeKoeiroParam,
  onClickOpenVrmFile,
  onClickResetChatLog,
  onClickResetSystemPrompt,
  backgroundImage,
  onChangeBackgroundImage,
  onTokensUpdate,
  onChatMessage,
  onChangeOpenRouterKey,
  customErrorMessage,
  onChangeCustomErrorMessage,
  characterName,
  onChangeCharacterName,
  selectedModel,
  onChangeSelectedModel,
  onClickResetAllSettings,
  onClickResetVrm,
  // (Eliminar desestructuración de idioma)
  // language, 
  // setAppLanguage, 
}: Props) => {
  const [currentTab, setCurrentTab] = useState<Tab>("general");
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"error" | "success" | "confirmation">("confirmation");
  const [onConfirmAction, setOnConfirmAction] = useState<(() => void) | null>(null);

  const { viewer } = useContext(ViewerContext);
  const optionsFileRef = useRef<HTMLInputElement>(null);

  // --- TEXTOS LOCALIZADOS (Usaremos un placeholder simple) ---
  const t = {
    title: "Settings",
    general: "General",
    model: "Model",
    chatSettings: "Chat Settings",
    voiceSelection: "Voice",
    personalization: "Personalization",
    streaming: "Streaming",
    about: "About",
    confirmations: {
        resetVrm: "Are you sure you want to reset the VRM?",
        resetAll: "Are you sure you want to reset all settings?",
        areYouSure: "Are you sure?",
    },
    noCancel: "No, Cancel",
    yesReset: "Yes, Reset",
    alerts: {
      loadSuccess: "Configuration loaded successfully!",
      loadError: "Error loading configuration. Check the file format.",
    },
  };
  // -----------------------------------------------------------

  const tabItems = useMemo(() => [
    { id: "general" as Tab, label: t.general, icon: "24/General" },
    { id: "model" as Tab, label: t.model, icon: "24/Model" },
    { id: "chatSettings" as Tab, label: t.chatSettings, icon: "24/Chat" },
    { id: "voice" as Tab, label: t.voiceSelection, icon: "24/Voice" },
    { id: "personalization" as Tab, label: t.personalization, icon: "24/Personalization" },
    { id: "streaming" as Tab, label: t.streaming, icon: "24/Streaming" },
    { id: "about" as Tab, label: t.about, icon: "24/About" },
  ], [t]);


  // =================================================================
  // LÓGICA DE ALERTA/CONFIRMACIÓN
  // =================================================================

  const showAlert = useCallback((message: string, type: "error" | "success" = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setIsAlertVisible(true);
    setOnConfirmAction(null);
  }, []);

  const showConfirmation = useCallback((message: string, action: () => void) => {
    setAlertMessage(message);
    setAlertType("confirmation");
    setIsAlertVisible(true);
    setOnConfirmAction(() => action);
  }, []);

  const handleAlertClose = useCallback(() => {
    setIsAlertVisible(false);
    setAlertMessage("");
    setOnConfirmAction(null);
  }, []);

  const handleAlertConfirm = useCallback(() => {
    if (onConfirmAction) {
      onConfirmAction();
    }
    handleAlertClose();
  }, [onConfirmAction, handleAlertClose]);

  // =================================================================
  // LÓGICA DE GUARDAR/CARGAR CONFIGURACIÓN
  // =================================================================

  const handleSaveOptions = useCallback(() => {
    const config = {
      openAiKey,
      elevenLabsKey,
      openRouterKey,
      systemPrompt,
      elevenLabsParam,
      koeiroParam,
      backgroundImage,
      customErrorMessage,
      characterName,
      selectedModel,
      // language, // Eliminado
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chatvrm_options.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [
    openAiKey,
    elevenLabsKey,
    openRouterKey,
    systemPrompt,
    elevenLabsParam,
    koeiroParam,
    backgroundImage,
    customErrorMessage,
    characterName,
    selectedModel,
    // language, // Eliminado
  ]);

  const handleLoadOptions = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const config = JSON.parse(text);

      // Aplicar la configuración
      if (config.openAiKey) onChangeAiKey({ target: { value: config.openAiKey } } as ChangeEvent<HTMLInputElement>); // Convertir a evento
      if (config.elevenLabsKey) onChangeElevenLabsKey(config.elevenLabsKey);
      if (config.openRouterKey) onChangeOpenRouterKey({ target: { value: config.openRouterKey } } as ChangeEvent<HTMLInputElement>);
      if (config.systemPrompt) onChangeSystemPrompt({ target: { value: config.systemPrompt } } as ChangeEvent<HTMLTextAreaElement>);
      // if (config.elevenLabsParam) { /* Lógica de ElevenLabsParam */ }
      if (config.koeiroParam) onChangeKoeiroParam(config.koeiroParam.speakerX, config.koeiroParam.speakerY);
      if (config.backgroundImage) onChangeBackgroundImage(config.backgroundImage);
      if (config.customErrorMessage) onChangeCustomErrorMessage(config.customErrorMessage);
      if (config.characterName) onChangeCharacterName({ target: { value: config.characterName } } as ChangeEvent<HTMLInputElement>);
      if (config.selectedModel) onChangeSelectedModel({ target: { value: config.selectedModel } } as ChangeEvent<HTMLSelectElement>);
      // if (config.language) setAppLanguage(config.language); // Eliminado
      
      showAlert(t.alerts.loadSuccess, "success");

    } catch (e) {
      console.error(e);
      showAlert(t.alerts.loadError, "error");
    } finally {
      event.target.value = ""; 
    }
  }, [
    t,
    showAlert,
    onChangeAiKey,
    onChangeElevenLabsKey,
    onChangeOpenRouterKey,
    onChangeSystemPrompt,
    onChangeKoeiroParam,
    onChangeBackgroundImage,
    onChangeCustomErrorMessage,
    onChangeCharacterName,
    onChangeSelectedModel,
    // setAppLanguage // Eliminado
  ]);


  // =================================================================
  // LÓGICA DE CONFIRMACIONES DE ZONA DE PELIGRO
  // =================================================================

  const handleResetVrm = useCallback(() => {
    showConfirmation(t.confirmations.resetVrm, onClickResetVrm);
  }, [t, onClickResetVrm, showConfirmation]);

  const handleResetAllSettings = useCallback(() => {
    showConfirmation(t.confirmations.resetAll, onClickResetAllSettings);
  }, [t, onClickResetAllSettings, showConfirmation]);


  // =================================================================
  // RENDERIZADO DEL CONTENIDO DE LA PESTAÑA
  // =================================================================

  const renderContent = () => {
    switch (currentTab) {
      case "general":
        return (
          <SettingsGeneral
            openAiKey={openAiKey}
            elevenLabsKey={elevenLabsKey}
            openRouterKey={openRouterKey}
            onChangeAiKey={onChangeAiKey}
            onChangeElevenLabsKey={onChangeElevenLabsKey}
            onChangeOpenRouterKey={onChangeOpenRouterKey}
            customErrorMessage={customErrorMessage}
            onChangeCustomErrorMessage={onChangeCustomErrorMessage}
            handleSaveOptions={handleSaveOptions}
            handleLoadOptions={() => optionsFileRef.current?.click()}
            t={t} 
            // language={language} // Eliminado
            // setAppLanguage={setAppLanguage} // Eliminado
          />
        );
      case "model":
        return (
          <SettingsModel
            openRouterKey={openRouterKey}
            onChangeOpenRouterKey={onChangeOpenRouterKey}
            onChangeSelectedModel={onChangeSelectedModel}
            selectedModel={selectedModel}
            openAiKey={openAiKey}
            onChangeAiKey={onChangeAiKey}
            t={t}
          />
        );
      case "chatSettings":
        return (
          <div className="flex flex-col gap-12">
            <SettingsCharacter
              systemPrompt={systemPrompt}
              onChangeSystemPrompt={onChangeSystemPrompt}
              onClickResetSystemPrompt={onClickResetSystemPrompt}
              t={t}
            />
            <SettingsChatLog
              chatLog={chatLog}
              onChangeChatLog={onChangeChatLog}
              onClickResetChatLog={onClickResetChatLog}
              t={t}
            />
          </div>
        );
      case "voice":
        return (
          <div className="flex flex-col gap-12">
            <SettingsVoice
              elevenLabsKey={elevenLabsKey}
              elevenLabsParam={elevenLabsParam}
              onChangeElevenLabsVoice={onChangeElevenLabsVoice}
              t={t}
            />
            <KoeiroMap
              koeiroParam={koeiroParam}
              onChangeKoeiroParam={onChangeKoeiroParam}
            />
          </div>
        );
      case "personalization":
        return (
          <SettingsPersonalization
            backgroundImage={backgroundImage}
            onChangeBackgroundImage={onChangeBackgroundImage}
            onClickOpenVrmFile={onClickOpenVrmFile}
            onClickResetVrm={handleResetVrm} 
            viewer={viewer}
            t={t}
          />
        );
      case "streaming":
        return (
          <SettingsStreaming
            onTokensUpdate={onTokensUpdate}
            onChatMessage={onChatMessage}
            t={t}
          />
        );
      case "about":
        return <SettingsAbout t={t} />;
      default:
        return <SettingsGeneral
          openAiKey={openAiKey}
          elevenLabsKey={elevenLabsKey}
          openRouterKey={openRouterKey}
          onChangeAiKey={onChangeAiKey}
          onChangeElevenLabsKey={onChangeElevenLabsKey}
          onChangeOpenRouterKey={onChangeOpenRouterKey}
          customErrorMessage={customErrorMessage}
          onChangeCustomErrorMessage={onChangeCustomErrorMessage}
          handleSaveOptions={handleSaveOptions}
          handleLoadOptions={() => optionsFileRef.current?.click()}
          t={t}
        />;
    }
  };

  return (
    <>
      <div className="absolute z-40 inset-0 bg-black/50 backdrop-blur-sm" onClick={onClickClose}></div>
      <div className="absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-xl shadow-2xl p-6 flex flex-col h-[90vh] max-h-[800px] gap-6">
        
        {/* Encabezado y Botón de Cierre */}
        <div className="flex justify-between items-center pb-2 border-b">
          <h2 className="typography-20 font-bold">{t.title}</h2>
          <IconButton iconName="24/Close" isProcessing={false} onClick={onClickClose} />
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Barra de Navegación (Tabs) */}
          <nav className="flex flex-col gap-2 w-56 pr-4 border-r overflow-y-auto">
            <CharacterNameInput
              characterName={characterName}
              onChangeCharacterName={onChangeCharacterName}
              t={t}
            />
            {tabItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  currentTab === item.id
                    ? "bg-secondary text-white font-semibold"
                    : "text-text-primary hover:bg-surface3"
                }`}
              >
                <div className={`w-5 h-5 ${currentTab === item.id ? "text-white" : "text-gray-600"}`} />
                {item.label}
              </button>
            ))}
            <div className="mt-auto pt-4 border-t">
              <SettingsDangerZone 
                onClickResetAllSettings={handleResetAllSettings} 
                t={t}
              />
            </div>
          </nav>

          {/* Contenido de la Pestaña */}
          <main className="flex-1 pl-6 overflow-y-auto">
            {renderContent()}
          </main>
        </div>
      </div>
      
      {/* Input File Oculto para Cargar Opciones */}
      <input
        type="file"
        ref={optionsFileRef}
        className="hidden"
        accept=".json"
        onChange={handleLoadOptions}
      />

      {/* MODAL DE ALERTA / CONFIRMACIÓN */}
      {isAlertVisible && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full text-center ${alertType === 'error' ? 'border-l-4 border-red-500' : alertType === 'success' ? 'border-l-4 border-green-500' : 'border-l-4 border-yellow-500'}`}>
            <h3 className="typography-18 font-bold mb-4">{alertType === 'confirmation' ? t.confirmations.areYouSure : (alertType === 'error' ? 'Error' : 'Success')}</h3>
            <p className="mb-6" dangerouslySetInnerHTML={{ __html: alertMessage }}></p>
            
            {alertType === "confirmation" ? (
              <div className="flex justify-around">
                <TextButton onClick={handleAlertClose} color="gray">
                  {t.noCancel}
                </TextButton>
                <TextButton onClick={handleAlertConfirm} color="red">
                  {t.yesReset}
                </TextButton>
              </div>
            ) : (
              <TextButton onClick={handleAlertClose}>
                OK
              </TextButton>
            )}
          </div>
        </div>
      )}
    </>
  );
};
