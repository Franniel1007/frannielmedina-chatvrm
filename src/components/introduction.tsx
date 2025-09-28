// src/components/introduction.tsx (Solo la parte de Props y la función de cambio de idioma)

// ... (imports)
import { LanguageCode } from "@/features/i18n/i18n"; // Importar LanguageCode

type Props = {
  openAiKey: string;
  elevenLabsKey: string;
  onChangeAiKey: (openAiKey: string) => void;
  onChangeElevenLabsKey: (elevenLabsKey: string) => void;
  // --- NUEVAS PROPS DE IDIOMA ---
  language: LanguageCode;
  setAppLanguage: (lang: LanguageCode) => void;
};

// ... (Resto del componente Introduction)

export const Introduction = ({ 
  openAiKey, 
  elevenLabsKey, 
  onChangeAiKey, 
  onChangeElevenLabsKey,
  // Desestructuramos las nuevas props
  language,
  setAppLanguage,
}: Props) => {
    // ... (Estados y useEffects existentes)
    const [currentPage, setCurrentPage] = useState(1);
    const [showDialog, setShowDialog] = useState(false);
    const [doNotShowAgain, setDoNotShowAgain] = useState(false);
    
    // NO NECESITAMOS ESTADO LOCAL PARA EL IDIOMA si lo pasamos desde Home/Index.tsx
    // const [language, setLanguage] = useState("es"); // ANTES

    // 1. Cargar estado al iniciar (usaremos la prop `language` como valor inicial)
    useEffect(() => {
        if (typeof window !== "undefined") {
            const skipIntro = localStorage.getItem("chatvrm_skip_intro") === "true";
            if (!skipIntro) {
                setShowDialog(true);
            }
            setDoNotShowAgain(skipIntro);
        }
    }, []);
    
    // ... (handleNext, handlePrev, handleFinish, handleToggleDoNotShow)

    // --- MANEJADOR DE CAMBIO DE IDIOMA ACTUALIZADO ---
    const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
      const newLang = event.target.value as LanguageCode;
      // USAMOS EL SETTER GLOBAL PASADO POR PROPS
      setAppLanguage(newLang); 
    };
    
    // Obtener textos basados en el idioma actual (Usar la lógica de i18n.ts)
    // const texts = TUTORIAL_TEXTS[language as keyof typeof TUTORIAL_TEXTS]; 
    // ^^^^^^ DEBES REEMPLAZAR TUTORIAL_TEXTS por la importación de tu archivo i18n.ts ^^^^^^

    // ... (renderPage)

    // Ejemplo de Page 1 con el selector:
    // case 1:
    //     return (
    //         // ...
    //         <select 
    //             id="language-select"
    //             value={language} // Usar la prop `language`
    //             onChange={handleLanguageChange}
    //             className="px-8 py-4 bg-surface3 rounded-4"
    //         >
    //             <option value="en">English</option>
    //             <option value="es">Español</option>
    //             <option value="ja">日本語</option>
    //         </select>
    //         // ...
    //     );
    
    // ... (Resto del return)
}
