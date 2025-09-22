import { useContext, useCallback, useState, useEffect } from "react"; // 👈🏻 Añadir useEffect
import { ViewerContext } from "../features/vrmViewer/viewerContext";
import { buildUrl } from "@/utils/buildUrl";

export default function VrmViewer() {
  const { viewer } = useContext(ViewerContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false); // 👈🏻 Nuevo estado para el desvanecimiento

  const AVATAR_SAMPLE_B_VRM_URL = 'https://ipfs.io/ipfs/bafybeihx4xjb5mphocdq2os63g43pgnpi46ynolpmhln3oycoasywdnl3u';

  const canvasRef = useCallback(
    (canvas: HTMLCanvasElement) => {
      if (canvas) {
        viewer.setup(canvas);

        const loadAndSetLoading = async (url: string) => {
          setIsFadingOut(false); // Asegúrate de que no esté desvaneciéndose al inicio de una nueva carga
          setIsLoading(true); // Inicia la carga
          try {
            await viewer.loadVrm(url);
          } catch (error) {
            console.error("Error loading VRM:", error);
          } finally {
            // Cuando la carga termine, inicia el desvanecimiento
            setIsFadingOut(true);
            // Después de un tiempo, oculta el cargador completamente
            setTimeout(() => {
              setIsLoading(false);
            }, 500); // 👈🏻 Debe coincidir con la duración de la transición en CSS
          }
        };

        loadAndSetLoading(buildUrl(AVATAR_SAMPLE_B_VRM_URL));

        // Drag and Drop para cambiar el VRM
        canvas.addEventListener("dragover", function (event) {
          event.preventDefault();
        });

        canvas.addEventListener("drop", function (event) {
          event.preventDefault();

          const files = event.dataTransfer?.files;
          if (!files) {
            return;
          }

          const file = files[0];
          if (!file) {
            return;
          }

          const file_type = file.name.split(".").pop();
          if (file_type === "vrm") {
            const blob = new Blob([file], { type: "application/octet-stream" });
            const url = window.URL.createObjectURL(blob);
            loadAndSetLoading(url);
          }
        });
      }
    },
    [viewer]
  );

  return (
    <div className={"absolute top-0 left-0 w-screen h-[100svh] -z-10"}>
      {isLoading && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 text-white z-20 transition-opacity duration-500 ease-out ${
            isFadingOut ? "opacity-0" : "opacity-100" // 👈🏻 Aplica la opacidad para el desvanecimiento
          }`}
        >
          <img src="https://media.tenor.com/hQy5PLbyiH9.gif" alt="Cargando..." className="w-24 h-24 mb-4" />
          <p>Cargando...</p>
        </div>
      )}
      <canvas ref={canvasRef} className={"h-full w-full"}></canvas>
    </div>
  );
}
