// src/components/introduction.tsx

import { useState, useCallback, useEffect, ChangeEvent } from "react";
import { Link } from "./link";

type Props = {
  openAiKey: string;
  elevenLabsKey: string;
  onChangeAiKey: (openAiKey: string) => void;
  onChangeElevenLabsKey: (elevenLabsKey: string) => void;
};

// --- Definición de textos para multi-idioma ---
const TUTORIAL_TEXTS = {
  es: {
    // Page 1
    title1: "¡Bienvenido/a! 👋",
    caption1:
      "Puedes disfrutar de conversaciones con personajes 3D usando solo un navegador web con micrófono, entrada de texto y síntesis de voz. También puedes cambiar el personaje (VRM), configurar su personalidad y ajustar la voz.",
    next: "Siguiente",
    // Page 2
    title2: "API de ElevenLabs 🎤",
    caption2:
      "Para obtener tu clave de ElevenLabs, ve a la página de desarrolladores, inicia sesión, haz clic en 'Create key' y **desmarca 'Restrict key'** o concede todos los permisos. Copia la clave y pégala aquí. (También puedes pegarla en el menú de opciones 🔧. Quedará guardada en tu navegador). Recuerda que el uso de la API consume tus créditos; el personaje dejará de hablar si llegan a cero.",
    apiPlaceholder: "Clave de API de ElevenLabs",
    prev: "Anterior",
    // Page 3
    title3: "Precauciones de uso 🛡️",
    caption3:
      "No induzcas intencionalmente comentarios discriminatorios o violentos, ni comentarios que degraden a una persona específica. Además, al reemplazar personajes con un modelo VRM, sigue las condiciones de uso del modelo.",
    // Page 4
    title4: "Configuración completada 🎉",
    caption4:
      "¡Todo listo! Antes de comenzar a utilizar, configura la API de OpenRouter en el menú de opciones (🔧).",
    finish: "Finalizar",
    doNotShow: "No mostrar este diálogo al inicio",
    language: "Idioma:",
  },
  en: {
    // Page 1
    title1: "Welcome! 👋",
    caption1:
      "You can enjoy conversations with 3D characters using only a web browser with a microphone, text input, and speech synthesis. You can also change the character (VRM), set the personality, and adjust the voice.",
    next: "Next",
    // Page 2
    title2: "ElevenLabs API 🎤",
    caption2:
      "To get your ElevenLabs API key, go to the developers page, sign in, click 'Create key,' and **uncheck 'Restrict key'** or grant all permissions. Copy the key and paste it here. (You can also paste it in the options menu 🔧. It will be saved in your browser). Remember that API usage consumes your credits; the character will stop speaking if credits reach zero.",
    apiPlaceholder: "ElevenLabs API key",
    prev: "Previous",
    // Page 3
    title3: "Usage Precautions 🛡️",
    caption3:
      "Do not intentionally induce discriminatory or violent remarks, or remarks that demean a specific person. Also, when replacing characters using a VRM model, please follow the model's terms of use.",
    // Page 4
    title4: "Setup Complete 🎉",
    caption4:
      "All set! Before starting, configure the OpenRouter API in the options menu (🔧).",
    finish: "Finish",
    doNotShow: "Do not show this dialog on startup",
    language: "Language:",
  },
  ja: {
    // Page 1
    title1: "ようこそ! 👋",
    caption1:
      "マイク、テキスト入力、音声合成を使用して、ウェブブラウザだけで3Dキャラクターとの会話を楽しめます。キャラクター（VRM）の変更、性格設定、音声調整も可能です。",
    next: "次へ",
    // Page 2
    title2: "ElevenLabs API 🎤",
    caption2:
      "ElevenLabsのAPIキーを取得するには、開発者ページにアクセスし、サインイン後、「Create key」をクリックし、「Restrict key」のチェックを外すか、すべての権限を与えてください。キーをコピーしてここに貼り付けます。（オプションメニューからも貼り付け可能です 🔧。ブラウザに保存されます）。APIの使用はクレジットを消費します。クレジットがゼロになるとキャラクターは話さなくなるので注意してください。",
    apiPlaceholder: "ElevenLabs APIキー",
    prev: "戻る",
    // Page 3
    title3: "利用上の注意 🛡️",
    caption3:
      "差別的または暴力的な発言、特定の人物を中傷する発言を意図的に誘発しないでください。また、VRMモデルを使用してキャラクターを置き換える際は、モデルの利用規約に従ってください。",
    // Page 4
    title4: "設定完了 🎉",
    caption4:
      "準備完了です！開始する前に、オプションメニュー（🔧）でOpenRouter APIを設定してください。",
    finish: "開始",
    doNotShow: "次回起動時にこのダイアログを表示しない",
    language: "言語:",
  },
};

// --- Componente de Introducción ---
export const Introduction = ({ openAiKey, elevenLabsKey, onChangeAiKey, onChangeElevenLabsKey }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showDialog, setShowDialog] = useState(false);
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);
  const [language, setLanguage] = useState("es"); // Default to Spanish

  // 1. Cargar estado y lenguaje al iniciar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLang = localStorage.getItem("chatvrm_lang") || "es";
      setLanguage(storedLang);

      const skipIntro = localStorage.getItem("chatvrm_skip_intro") === "true";
      if (!skipIntro) {
        setShowDialog(true);
      }
      setDoNotShowAgain(skipIntro);
    }
  }, []);

  // 2. Manejadores de API Key (Reutilizados del original)
  const handleElevenLabsKeyChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChangeElevenLabsKey(event.target.value);
    },
    [onChangeElevenLabsKey]
  );
  
  // 3. Manejadores del flujo de navegación
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, 4));
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  
  const handleFinish = () => {
    if (doNotShowAgain) {
      localStorage.setItem("chatvrm_skip_intro", "true");
    }
    setShowDialog(false);
  };
  
  const handleToggleDoNotShow = (event: ChangeEvent<HTMLInputElement>) => {
    setDoNotShowAgain(event.target.checked);
  };
  
  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newLang = event.target.value as keyof typeof TUTORIAL_TEXTS;
    if (TUTORIAL_TEXTS[newLang]) {
      setLanguage(newLang);
      localStorage.setItem("chatvrm_lang", newLang);
    }
  };
  
  // Obtener textos basados en el idioma actual
  const texts = TUTORIAL_TEXTS[language as keyof typeof TUTORIAL_TEXTS];
  
  // --- Renderizado de Páginas ---
  const renderPage = (page: number) => {
    switch (page) {
      case 1:
        return (
          <>
            <div className="flex justify-center my-16">
              <img src="/logo.png" alt="ChatVRM Logo" className="w-32 h-32" /> 
            </div>
            <div className="my-16 font-bold typography-24 text-center text-secondary">{texts.title1}</div>
            <div className="text-center">{texts.caption1}</div>
            
            <div className="my-24 flex items-center justify-center gap-4">
              <label htmlFor="language-select" className="font-bold">{texts.language}</label>
              <select 
                id="language-select"
                value={language}
                onChange={handleLanguageChange}
                className="px-8 py-4 bg-surface3 rounded-4"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
              </select>
            </div>

            <div className="flex justify-end mt-40">
              <button
                onClick={handleNext}
                className="font-bold bg-secondary hover:bg-secondary-hover active:bg-secondary-press text-white px-24 py-8 rounded-oval"
              >
                {texts.next}
              </button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="my-16 font-bold typography-24 text-secondary">{texts.title2}</div>
            <input
              type="text"
              placeholder={texts.apiPlaceholder}
              value={elevenLabsKey}
              onChange={handleElevenLabsKeyChange}
              className="my-4 px-16 py-8 w-full h-40 bg-surface3 hover:bg-surface3-hover rounded-4 text-ellipsis"
            />
            <div className="mt-8">{texts.caption2}</div>
            <Link url={"https://elevenlabs.io/app/developers/api-keys"} label={"ElevenLabs Developers Page"} />
            
            <div className="flex justify-between mt-40">
              <button
                onClick={handlePrev}
                className="font-bold bg-gray-300 hover:bg-gray-400 text-gray-800 px-24 py-8 rounded-oval"
              >
                {texts.prev}
              </button>
              <button
                onClick={handleNext}
                className="font-bold bg-secondary hover:bg-secondary-hover active:bg-secondary-press text-white px-24 py-8 rounded-oval"
              >
                {texts.next}
              </button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="my-16 font-bold typography-24 text-secondary">{texts.title3}</div>
            <div>{texts.caption3}</div>
            
            <div className="flex justify-between mt-40">
              <button
                onClick={handlePrev}
                className="font-bold bg-gray-300 hover:bg-gray-400 text-gray-800 px-24 py-8 rounded-oval"
              >
                {texts.prev}
              </button>
              <button
                onClick={handleNext}
                className="font-bold bg-secondary hover:bg-secondary-hover active:bg-secondary-press text-white px-24 py-8 rounded-oval"
              >
                {texts.next}
              </button>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <div className="flex justify-center my-16">
              <img src="/logo.png" alt="ChatVRM Logo" className="w-32 h-32" /> 
            </div>
            <div className="my-16 font-bold typography-24 text-center text-secondary">{texts.title4}</div>
            <div className="text-center">{texts.caption4}</div>
            
            <div className="flex items-center justify-center my-24">
              <input
                type="checkbox"
                id="doNotShowAgain"
                checked={doNotShowAgain}
                onChange={handleToggleDoNotShow}
                className="mr-2"
              />
              <label htmlFor="doNotShowAgain">{texts.doNotShow}</label>
            </div>

            <div className="flex justify-end mt-40">
              <button
                onClick={handleFinish}
                className="font-bold bg-secondary hover:bg-secondary-hover active:bg-secondary-press text-white px-24 py-8 rounded-oval"
              >
                {texts.finish}
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (!showDialog) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-40 w-full h-full px-24 py-40 bg-black/30 font-M_PLUS_2 flex justify-center items-center">
      <div 
        key={currentPage} // <-- Clave para forzar la transición en cada cambio de página
        className="max-w-3xl max-h-full p-24 overflow-auto bg-white rounded-16 
                   transition-opacity duration-500 ease-in-out opacity-100 animate-fade-in"
      >
        {renderPage(currentPage)}
      </div>
    </div>
  );
};
