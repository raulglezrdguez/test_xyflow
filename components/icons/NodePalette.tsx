import { DragEvent, JSX, useState } from "react";

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
  const [draggedType, setDraggedType] = useState<MyNodeType | null>(null);

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
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "copy";
    console.log(nodeType);
    setDraggedType(nodeType);
  };

  const onDragEnd = () => {
    console.log("Drag End:");
    setDraggedType(null);
  };

  return (
    <div className="p-4 border border-gray-500 rounded-lg">
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
        <div
          draggable
          onDragStart={(event) => onDragStart(event, "input")}
          onDragEnd={onDragEnd}
        >
          <StartNodeIcon />
        </div>

        <div
          draggable
          onDragStart={(event) => onDragStart(event, "question")}
          onDragEnd={onDragEnd}
        >
          <QuestionNodeIcon />
        </div>

        <div
          draggable
          onDragStart={(event) => onDragStart(event, "http-request")}
          onDragEnd={onDragEnd}
        >
          <HttpRequestNodeIcon />
        </div>

        <div
          draggable
          onDragStart={(event) => onDragStart(event, "gemini-info")}
          onDragEnd={onDragEnd}
        >
          <GeminiKeyNodeIcon />
        </div>

        <div
          draggable
          onDragStart={(event) => onDragStart(event, "gemini")}
          onDragEnd={onDragEnd}
        >
          <GeminiServiceNodeIcon />
        </div>

        <div
          draggable
          onDragStart={(event) => onDragStart(event, "output")}
          onDragEnd={onDragEnd}
        >
          <EndNodeIcon />
        </div>
      </div>
    </div>
  );
}
