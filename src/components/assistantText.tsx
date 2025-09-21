import { Montserrat } from "next/font/google";
import { M_PLUS_2 } from "next/font/google";

const m_plus_2 = M_PLUS_2({
  variable: "--font-m-plus-2",
  display: "swap",
  preload: false,
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  display: "swap",
  subsets: ["latin"],
});

// --- AÑADIR: La propiedad characterName ---
export const AssistantText = ({ message, characterName }: { message: string, characterName: string }) => {
  return (
    <div className="absolute bottom-0 left-0 mb-104  w-full">
      <div className="mx-auto max-w-4xl w-full p-16">
        <div className="bg-white rounded-8">
          <div className="px-24 py-8 bg-secondary rounded-t-8 text-white font-Montserrat font-bold tracking-wider">
            {/* --- UTILIZAR LA PROPIEDAD characterName --- */}
            {characterName.toUpperCase()}
          </div>
          <div className="px-24 py-16">
            <div className="text-secondary typography-16 font-M_PLUS_2 font-bold">
              {message.replace(/\[([a-zA-Z]*?)\]/g, "")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
