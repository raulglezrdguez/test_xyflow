import { DragEvent, JSX } from "react";

import {
  StartNodeIcon,
  QuestionNodeIcon,
  HttpRequestNodeIcon,
  GeminiKeyNodeIcon,
  GeminiServiceNodeIcon,
  EndNodeIcon,
} from "./NodeIcons";
import { MyNodeType } from "@/types/flow";

/**
 * Paleta de Nodos Arrastrables para React Flow.
 */
export default function NodePalette(): JSX.Element {
  /**
   * Maneja el inicio del arrastre para React Flow.
   * Establece el tipo de nodo en el dataTransfer para ser leído por onDrop en el canvas.
   * @param event El evento de arrastre (DragEvent).
   * @param nodeType El identificador del tipo de nodo.
   */
  const onDragStart = (
    event: DragEvent<HTMLDivElement>,
    nodeType: MyNodeType
  ) => {
    // Es crucial que el tipo MIME ('application/reactflow') sea usado y el tipo de nodo sea la data.
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="p-4 border border-gray-500 rounded-lg">
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
        {/* Nodo de Inicio */}
        <div onDragStart={(event) => onDragStart(event, "input")} draggable>
          <StartNodeIcon />
        </div>

        {/* Nodo de Pregunta */}
        <div onDragStart={(event) => onDragStart(event, "question")} draggable>
          <QuestionNodeIcon />
        </div>

        {/* Nodo HTTP Request */}
        <div
          onDragStart={(event) => onDragStart(event, "http-request")}
          draggable
        >
          <HttpRequestNodeIcon />
        </div>

        {/* Nodo Gemini API Key */}
        <div
          onDragStart={(event) => onDragStart(event, "gemini-info")}
          draggable
        >
          <GeminiKeyNodeIcon />
        </div>

        {/* Nodo Gemini Service */}
        <div onDragStart={(event) => onDragStart(event, "gemini")} draggable>
          <GeminiServiceNodeIcon />
        </div>

        {/* Nodo de Finalización */}
        <div onDragStart={(event) => onDragStart(event, "output")} draggable>
          <EndNodeIcon />
        </div>
      </div>
    </div>
  );
}
