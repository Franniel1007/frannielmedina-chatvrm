// src/features/i18n/i18n.ts

import { useState } from "react";

export type LanguageCode = 'en' | 'es' | 'ja';

// =================================================================
// 1. DEFINICIÓN DE LA ESTRUCTURA DE TEXTOS (TYPE)
// =================================================================
export type UITexts = {
    settings: {
        title: string;
        general: string;
        model: string; // Se usa para la pestaña API
        language: string;
        languageSelector: string;
        
        // --- TEXTOS GENERAL ---
        characterName: string;
        characterNameHelp: string;
        customErrorMessage: string;
        customErrorMessagePlaceholder: string;
        customErrorMessageHelp: string;
        saveLoad: string;
        saveOptions: string;
        loadOptions: string;
        dangerZone: string;
        resetAllSettings: string;
        resetAllSettingsHelp: string;
        
        // --- TEXTOS API ---
        openRouterApi: string;
        openRouterApiPlaceholder: string;
        openRouterApiHelp1: string;
        openRouterApiHelp2: string; // 'sitio web de OpenRouter'
        elevenLabsApi: string;
        elevenLabsApiPlaceholder: string;
        elevenLabsApiHelp1: string;
        elevenLabsApiHelp2: string; // 'sitio web de ElevenLabs'
        
        // --- TEXTOS CHAT/PERSONALIDAD (characterSettings) ---
        llmModel: string;
        personalityPrompt: string;
        resetCharacterSettings: string;
        personalityPlaceholder: string;
        chatHistory: string;
        resetChatHistory: string;
        character: string; // 'Personaje'
        you: string; // 'Tú'
        
        // --- TEXTOS VOZ ---
        voiceSelection: string;
        elevenLabsWarning: string;
        elevenLabsVoiceHelp: string;
        
        // --- TEXTOS PERSONALIZACIÓN ---
        characterModel: string;
        openVrm: string;
        defaultVrm: string;
        backgroundImage: string;
        backgroundImagePrompt: string;
        removeBackground: string;
        backgroundImageHelp: string;
        
        // --- TEXTOS STREAMING ---
        streamingTitle: string;
        streamingHelp: string;
        
        // --- TEXTOS ACERCA DE ---
        aboutTitle: string;
        aboutAuthor: string;
        aboutBaseVersion: string;

        // --- TEXTOS DE CONFIRMACIÓN y ALERTAS ---
        confirmations: {
            areYouSure: string;
            removeBackground: string;
            resetCharacter: string;
            resetVrm: string;
            resetAll: string;
        };
        yes: string;
        no: string;
        yesReset: string;
        noCancel: string;
        alerts: {
            loadSuccess: string;
            loadError: string;
        };

        // Textos para pestañas de Menu.tsx (si se usaran)
        vrmSettings: string; 
        chatSettings: string;
        personalization: string;
        streaming: string;
        about: string;
    }
    introduction: {
        title: string;
        welcome: string;
        page1Help: string;
        next: string;
        back: string;
        finish: string;
    }
};

// =================================================================
// 2. TEXTOS TRADUCIDOS (i18nTexts)
// =================================================================
export const i18nTexts: Record<LanguageCode, UITexts> = {
    en: { // INGLÉS (PREDETERMINADO)
        settings: {
            title: "Settings",
            general: "General",
            model: "Model",
            language: "Language",
            languageSelector: "Select Language:",
            
            characterName: "Character Name",
            characterNameHelp: "Change the name that appears in the character's dialog box.",
            customErrorMessage: "Custom Error Message",
            customErrorMessagePlaceholder: "OpenRouter API is down. Please try again later.",
            customErrorMessageHelp: "This message will be shown if the OpenRouter API is unavailable.",
            saveLoad: "Save/Load",
            saveOptions: "Save Options File",
            loadOptions: "Load Options File",
            dangerZone: "Danger Zone",
            resetAllSettings: "Reset All Settings",
            resetAllSettingsHelp: "This action will delete all application data from your browser.",
            
            openRouterApi: "OpenRouter API",
            openRouterApiPlaceholder: "OpenRouter API Key",
            openRouterApiHelp1: "Enter your OpenRouter API key for personalized access. You can get an API key on the",
            openRouterApiHelp2: "OpenRouter website", 
            elevenLabsApi: "ElevenLabs API",
            elevenLabsApiPlaceholder: "ElevenLabs API Key",
            elevenLabsApiHelp1: "Enter your ElevenLabs API key to enable text-to-speech. You can get an API key on the",
            elevenLabsApiHelp2: "ElevenLabs website",
            
            llmModel: "Language Model",
            personalityPrompt: "Personality Prompt",
            resetCharacterSettings: "Reset Character Settings",
            personalityPlaceholder: "You are a...",
            chatHistory: "Conversation History",
            resetChatHistory: "Reset Conversation History",
            character: "Character",
            you: "You",

            voiceSelection: "Voice Selection",
            elevenLabsWarning: "You haven't entered the ElevenLabs API, the character will remain silent! Please get the API and paste it in the APIs tab.",
            elevenLabsVoiceHelp: "Select from ElevenLabs voices (Also includes saved voices):",
            
            characterModel: "Character Model",
            openVrm: "Open VRM",
            defaultVrm: "Default VRM",
            backgroundImage: "Background Image",
            backgroundImagePrompt: "Choose a custom background image:",
            removeBackground: "Remove Background",
            backgroundImageHelp: "The background image will be saved to your browser and restored when you return.",

            streamingTitle: "Streaming",
            streamingHelp: "You can stream live using ChatVRM with Restream, it works with Twitch. To stream live on Twitch and YouTube, you need to have the RestreamBot on your Twitch channel and also enable the Forwarding mode so that the YouTube chat synchronizes with Twitch, allowing the character to respond to the YouTube chat.",
            
            aboutTitle: "About",
            aboutAuthor: "ChatVRM by FrannielMedina",
            aboutBaseVersion: "Improved version based on",

            confirmations: {
                areYouSure: "Are you sure?",
                removeBackground: "Are you sure you want to remove the background and set the default one?",
                resetCharacter: "Are you sure you want to reset the character's settings?",
                resetVrm: "Are you sure you want to set the default VRM?",
                resetAll: "Are you sure you want to **reset all settings**? This will be **irreversible**.",
            },
            yes: "Yes",
            no: "No",
            yesReset: "Yes, Reset",
            noCancel: "No, Cancel",
            alerts: {
                loadSuccess: "Configuration loaded successfully.",
                loadError: "Error loading the file. Make sure it is a valid options file.",
            },

            vrmSettings: "VRM Settings", 
            chatSettings: "Chat Settings",
            personalization: "Personalization",
            streaming: "Streaming",
            about: "About",
        },
        introduction: {
            title: "Welcome to ChatVRM",
            welcome: "Thank you for using ChatVRM! Before you start, please select your language and set up your API keys.",
            page1Help: "The default language is English. You can change it at any time in Settings.",
            next: "Next",
            back: "Back",
            finish: "Start Chatting",
        }
    },
    es: { // ESPAÑOL
        settings: {
            title: "Configuración",
            general: "General",
            model: "Modelo", 
            language: "Idioma",
            languageSelector: "Seleccionar Idioma:",
            
            characterName: "Nombre del personaje",
            characterNameHelp: "Cambia el nombre que aparece en el cuadro de diálogo del personaje.",
            customErrorMessage: "Mensaje de error personalizado",
            customErrorMessagePlaceholder: "La API de OpenRouter está temporalmente caída. Inténtalo de nuevo más tarde.",
            customErrorMessageHelp: "Este mensaje se mostrará si la API de OpenRouter no está disponible.",
            saveLoad: "Guardado",
            saveOptions: "Guardar archivo de opciones",
            loadOptions: "Cargar archivo de opciones",
            dangerZone: "Zona de peligro",
            resetAllSettings: "Reiniciar toda la configuración",
            resetAllSettingsHelp: "Esta acción eliminará todos los datos de la aplicación de tu navegador.",
            
            openRouterApi: "API de OpenRouter",
            openRouterApiPlaceholder: "Clave de API de OpenRouter",
            openRouterApiHelp1: "Introduce tu clave de API de OpenRouter para un acceso personalizado. Puedes obtener una clave de API en el",
            openRouterApiHelp2: "sitio web de OpenRouter", 
            elevenLabsApi: "API de ElevenLabs",
            elevenLabsApiPlaceholder: "Clave de API de ElevenLabs",
            elevenLabsApiHelp1: "Introduce tu clave de API de ElevenLabs para habilitar la conversión de texto a voz. Puedes obtener una clave de API en el",
            elevenLabsApiHelp2: "sitio web de ElevenLabs",
            
            llmModel: "Modelo de Lenguaje",
            personalityPrompt: "Prompt de Personalidad",
            resetCharacterSettings: "Restablecer configuración del personaje",
            personalityPlaceholder: "Eres un/a...",
            chatHistory: "Historial de conversaciones",
            resetChatHistory: "Restablecer historial de conversaciones",
            character: "Personaje",
            you: "Tú",

            voiceSelection: "Selección de voz",
            elevenLabsWarning: "¡No has introducido la API de ElevenLabs, el personaje quedará en silencio! Por favor, obtén la API, copia y pega desde la pestaña APIs.",
            elevenLabsVoiceHelp: "Selecciona entre las voces de ElevenLabs (También incluyen voces que tienes guardadas):",
            
            characterModel: "Modelo del personaje",
            openVrm: "Abrir VRM",
            defaultVrm: "VRM por defecto",
            backgroundImage: "Imagen de fondo",
            backgroundImagePrompt: "Elige una imagen de fondo personalizada:",
            removeBackground: "Eliminar fondo",
            backgroundImageHelp: "La imagen de fondo se guardará en tu navegador y se restaurará cuando regreses.",

            streamingTitle: "Transmisión",
            streamingHelp: "Aquí puedes transmitir en vivo utilizando ChatVRM con Restream, funciona con Twitch. Para transmitir en vivo en Twitch y YouTube, necesitas tener el bot de RestreamBot en tu canal de Twitch y también activar el modo de Reenvío para que el chat de YouTube se sincronice con Twitch y así el personaje pueda responder al chat de YouTube.",
            
            aboutTitle: "Acerca de",
            aboutAuthor: "ChatVRM de FrannielMedina",
            aboutBaseVersion: "Versión mejorada basada en",

            confirmations: {
                areYouSure: "¿Estás seguro?",
                removeBackground: "¿Estás seguro de que deseas eliminar el fondo y poner el predeterminado?",
                resetCharacter: "¿Estás seguro de que deseas reiniciar la configuración del personaje?",
                resetVrm: "¿Estás seguro de que deseas poner el VRM por defecto?",
                resetAll: "¿Estás seguro que deseas **reiniciar toda la configuración**? Esto será **irreversible**.",
            },
            yes: "Sí",
            no: "No",
            yesReset: "Sí, reiniciar",
            noCancel: "No, cancelar",
            alerts: {
                loadSuccess: "Configuración cargada correctamente.",
                loadError: "Error al cargar el archivo. Asegúrate de que es un archivo de opciones válido.",
            },

            vrmSettings: "Ajustes VRM", 
            chatSettings: "Ajustes de Chat",
            personalization: "Personalización",
            streaming: "Transmisión",
            about: "Acerca de",
        },
        introduction: {
            title: "Bienvenido a ChatVRM",
            welcome: "¡Gracias por usar ChatVRM! Antes de comenzar, por favor, selecciona tu idioma y configura tus claves API.",
            page1Help: "El idioma predeterminado es Inglés. Puedes cambiarlo en cualquier momento desde Opciones.",
            next: "Siguiente",
            back: "Atrás",
            finish: "Comenzar a Chatear",
        }
    },
    ja: { // JAPONÉS
        settings: {
            title: "設定",
            general: "一般",
            model: "モデル",
            language: "言語",
            languageSelector: "言語を選択:",
            
            characterName: "キャラクター名",
            characterNameHelp: "キャラクターのダイアログボックスに表示される名前を変更します。",
            customErrorMessage: "カスタムエラーメッセージ",
            customErrorMessagePlaceholder: "OpenRouter API は一時的に停止しています。後でもう一度お試しください。",
            customErrorMessageHelp: "OpenRouter API が利用できない場合にこのメッセージが表示されます。",
            saveLoad: "保存/読み込み",
            saveOptions: "オプションファイルを保存",
            loadOptions: "オプションファイルを読み込む",
            dangerZone: "危険なゾーン",
            resetAllSettings: "すべての設定をリセット",
            resetAllSettingsHelp: "この操作により、ブラウザからすべてのアプリケーションデータが削除されます。",
            
            openRouterApi: "OpenRouter API",
            openRouterApiPlaceholder: "OpenRouter API キー",
            openRouterApiHelp1: "パーソナライズされたアクセスには、OpenRouter API キーを入力してください。API キーは",
            openRouterApiHelp2: "OpenRouter ウェブサイト", 
            elevenLabsApi: "ElevenLabs API",
            elevenLabsApiPlaceholder: "ElevenLabs API キー",
            elevenLabsApiHelp1: "テキスト読み上げを有効にするには、ElevenLabs API キーを入力してください。API キーは",
            elevenLabsApiHelp2: "ElevenLabs ウェブサイト",
            
            llmModel: "言語モデル",
            personalityPrompt: "パーソナリティプロンプト",
            resetCharacterSettings: "キャラクター設定をリセット",
            personalityPlaceholder: "あなたは...",
            chatHistory: "会話履歴",
            resetChatHistory: "会話履歴をリセット",
            character: "キャラクター",
            you: "あなた",

            voiceSelection: "音声の選択",
            elevenLabsWarning: "ElevenLabs APIが入力されていません。キャラクターは無音になります！APIタブからAPIを取得して貼り付けてください。",
            elevenLabsVoiceHelp: "ElevenLabsの音声から選択してください（保存された音声も含まれます）：",
            
            characterModel: "キャラクターモデル",
            openVrm: "VRMを開く",
            defaultVrm: "デフォルトVRM",
            backgroundImage: "背景画像",
            backgroundImagePrompt: "カスタム背景画像を選択してください：",
            removeBackground: "背景を削除",
            backgroundImageHelp: "背景画像はブラウザに保存され、戻ったときに復元されます。",

            streamingTitle: "ストリーミング",
            streamingHelp: "Restreamを使用してChatVRMでライブストリーミングできます。Twitchで動作します。TwitchとYouTubeでライブストリーミングするには、TwitchチャンネルにRestreamBotを導入し、転送モードを有効にして、YouTubeチャットがTwitchと同期するように設定する必要があります。これにより、キャラクターがYouTubeチャットに応答できるようになります。",
            
            aboutTitle: "について",
            aboutAuthor: "FrannielMedinaによるChatVRM",
            aboutBaseVersion: "に基づいて改善されたバージョン",

            confirmations: {
                areYouSure: "よろしいですか？",
                removeBackground: "背景を削除してデフォルトに戻してもよろしいですか？",
                resetCharacter: "キャラクター設定をリセットしてもよろしいですか？",
                resetVrm: "デフォルトのVRMに戻してもよろしいですか？",
                resetAll: "**すべての設定をリセット**してもよろしいですか？これは**元に戻せません**。",
            },
            yes: "はい",
            no: "いいえ",
            yesReset: "はい、リセット",
            noCancel: "いいえ、キャンセル",
            alerts: {
                loadSuccess: "設定が正常に読み込まれました。",
                loadError: "ファイルの読み込み中にエラーが発生しました。有効なオプションファイルであることを確認してください。",
            },

            vrmSettings: "VRM設定", 
            chatSettings: "チャット設定",
            personalization: "パーソナライズ",
            streaming: "ストリーミング",
            about: "について",
        },
        introduction: {
            title: "ChatVRMへようこそ",
            welcome: "ChatVRMをご利用いただきありがとうございます！始める前に、言語を選択し、APIキーを設定してください。",
            page1Help: "デフォルトの言語は英語です。設定でいつでも変更できます。",
            next: "次へ",
            back: "戻る",
            finish: "チャットを開始",
        }
    }
};

// =================================================================
// 3. LÓGICA DEL IDIOMA (HOOKS)
// =================================================================

/**
 * Obtiene el código de idioma guardado o el valor por defecto.
 * Si no hay almacenamiento (ej. renderizado en el servidor), usa 'en'.
 * @returns El código de idioma actual ('en', 'es', 'ja').
 */
export const getStoredLanguage = (): LanguageCode => {
    if (typeof window === 'undefined' || !localStorage.getItem("chatvrm_lang")) {
        // 'en' (inglés) es el idioma predeterminado si no hay nada guardado.
        return 'en'; 
    }
    return localStorage.getItem("chatvrm_lang") as LanguageCode;
};

/**
 * Obtiene el objeto de textos de la UI en el idioma seleccionado.
 */
export const getUITexts = (langCode: LanguageCode): UITexts => {
    return i18nTexts[langCode] || i18nTexts.en;
};

/**
 * Hook personalizado para manejar el estado del idioma y sus textos.
 * Se inicializa con el valor guardado en localStorage o 'en' por defecto.
 */
export const useLanguage = () => {
    // Inicializa el estado con el idioma guardado o 'en'
    const [language, setLanguage] = useState<LanguageCode>(getStoredLanguage());
    const texts = getUITexts(language);

    /**
     * Establece el nuevo idioma y lo guarda en localStorage.
     */
    const setAppLanguage = (newLang: LanguageCode) => {
        setLanguage(newLang);
        if (typeof window !== 'undefined') {
            localStorage.setItem("chatvrm_lang", newLang);
        }
    };

    return { language, texts, setAppLanguage };
};

