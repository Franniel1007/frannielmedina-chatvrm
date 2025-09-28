// src/components/introduction.tsx

import React, { useState, useEffect, ChangeEvent } from "react"; // <-- ¡IMPORTACIÓN CORREGIDA!
import { Link } from "./link";
import { TextButton } from "./textButton";
import { IconButton } from "./iconButton";

// --- IMPORTACIONES i18n ---
import { LanguageCode, useLanguage } from "@/features/i18n/i18n";
// -------------------------

type Props = {
  openAiKey: string;
  elevenLabsKey: string;
  onChangeAiKey: (openAiKey: string) => void;
  onChangeElevenLabsKey: (elevenLabsKey: string) => void;
  // --- NUEVAS PROPS DE IDIOMA ---
  language: LanguageCode;
  setAppLanguage: (lang: LanguageCode) => void;
};

export const Introduction = ({ 
  openAiKey, 
  elevenLabsKey, 
  onChangeAiKey, 
  onChangeElevenLabsKey,
  language,
  setAppLanguage,
}: Props) => {
    // Usamos el hook useLanguage para obtener los textos
    const { texts } = useLanguage();
    const introTexts = texts.introduction;
    const settingsTexts = texts.settings;
    
    // --- ESTADOS CORREGIDOS ---
    const [currentPage, setCurrentPage] = useState(1);
    const [showDialog, setShowDialog] = useState(false);
    const [doNotShowAgain, setDoNotShowAgain] = useState(false);
    // --------------------------

    useEffect(() => {
        if (typeof window !== "undefined") {
            const skipIntro = localStorage.getItem("chatvrm_skip_intro") === "true";
            if (!skipIntro) {
                setShowDialog(true);
            }
            setDoNotShowAgain(skipIntro);
        }
    }, []);

    const handleNext = () => {
        setCurrentPage(prev => prev + 1);
    };

    const handlePrev = () => {
        setCurrentPage(prev => prev - 1);
    };

    const handleFinish = () => {
        setShowDialog(false);
        if (doNotShowAgain) {
            localStorage.setItem("chatvrm_skip_intro", "true");
        }
    };
    
    const handleToggleDoNotShow = () => {
        setDoNotShowAgain(prev => !prev);
    };

    // --- MANEJADOR DE CAMBIO DE IDIOMA ---
    const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
      const newLang = event.target.value as LanguageCode;
      setAppLanguage(newLang); 
    };
    // ------------------------------------


    const renderPage = () => {
        switch (currentPage) {
            case 1:
                return (
                    <div className="flex flex-col gap-16">
                        <div className="my-16 typography-28 font-bold text-center">{introTexts.title}</div>
                        <p>{introTexts.welcome}</p>
                        
                        {/* Selector de Idioma */}
                        <div className="flex items-center gap-4 my-8">
                            <label htmlFor="intro-language-select" className="font-bold text-sm">{settingsTexts.languageSelector}</label>
                            <select 
                                id="intro-language-select"
                                value={language} // Usar la prop `language`
                                onChange={handleLanguageChange}
                                className="px-8 py-4 bg-surface3 rounded-4"
                            >
                                <option value="en">English (Default)</option>
                                <option value="es">Español</option>
                                <option value="ja">日本語</option>
                            </select>
                        </div>
                        <p className="text-sm text-gray-500">{introTexts.page1Help}</p>
                    </div>
                );
            case 2:
                return (
                    <div className="flex flex-col gap-16">
                        <div className="my-16 typography-28 font-bold">API de OpenRouter (Recomendado)</div>
                        <p>ChatVRM usa OpenRouter para los modelos de lenguaje (LLM). Puedes usar la API gratuita por defecto o añadir tu propia clave para acceder a modelos más avanzados.</p>
                        <input
                            type="text"
                            placeholder="Clave de API de OpenRouter"
                            value={openAiKey} // Usamos openAiKey ya que se usa para la API principal de OpenRouter/OpenAI
                            onChange={(e) => onChangeAiKey(e.target.value)}
                            className="px-16 py-8 w-full h-40 bg-surface3 hover:bg-surface3-hover rounded-4 text-ellipsis"
                        />
                        <p className="text-sm text-gray-500">
                            Obtén tu clave en el <Link url="https://openrouter.ai/" label="sitio web de OpenRouter" />.
                        </p>
                    </div>
                );
            case 3:
                return (
                    <div className="flex flex-col gap-16">
                        <div className="my-16 typography-28 font-bold">API de ElevenLabs (Opcional)</div>
                        <p>Introduce tu clave de ElevenLabs para habilitar la **conversión de texto a voz realista**. Si omites este paso, el personaje no hablará con voz.</p>
                        <input
                            type="text"
                            placeholder="Clave de API de ElevenLabs"
                            value={elevenLabsKey}
                            onChange={(e) => onChangeElevenLabsKey(e.target.value)}
                            className="px-16 py-8 w-full h-40 bg-surface3 hover:bg-surface3-hover rounded-4 text-ellipsis"
                        />
                        <p className="text-sm text-gray-500">
                            Obtén tu clave en el <Link url="https://beta.elevenlabs.io/" label="sitio web de ElevenLabs" />.
                        </p>
                    </div>
                );
            default:
                return null;
        }
    };

    if (!showDialog) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full">
                
                {renderPage()}
                
                <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                        <input 
                            type="checkbox" 
                            id="do-not-show" 
                            checked={doNotShowAgain} 
                            onChange={handleToggleDoNotShow}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                        />
                        <label htmlFor="do-not-show" className="text-sm text-gray-600">No volver a mostrar</label>
                    </div>

                    <div className="flex gap-4">
                        {currentPage > 1 && (
                            <TextButton onClick={handlePrev} color="gray">
                                {introTexts.back}
                            </TextButton>
                        )}
                        {currentPage < 3 ? (
                            <TextButton onClick={handleNext}>
                                {introTexts.next}
                            </TextButton>
                        ) : (
                            <TextButton onClick={handleFinish} color="green">
                                {introTexts.finish}
                            </TextButton>
                        )}
                    </div>
                </div>
                
                {/* Botón para cerrar rápidamente */}
                <div className="absolute top-4 right-4">
                    <IconButton iconName="24/Close" isProcessing={false} onClick={handleFinish} />
                </div>
            </div>
        </div>
    );
};
