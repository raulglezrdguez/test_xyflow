"use client";

import { useFlowStore } from "@/store/flowStore";
import { useFlowMachine, useFlowSnapshot } from "@/contexts/flowMachineContext";
import { Button } from "@/components/ui/button";

export function ExecutionPanel() {
  const nodes = useFlowStore((state) => state.nodes);
  const actorRef = useFlowMachine();
  const snapshot = useFlowSnapshot();

  const startNode = nodes.find((n) => n.type === "input");

  // Estado idle: muestra botón de inicio
  if (snapshot.value === "idle") {
    return (
      <div id="execution-panel" className="p-4 bg-white shadow-lg rounded-lg">
        <Button
          onClick={() => {
            if (startNode) {
              useFlowStore.getState().setNodeStatus(startNode.id, "running");
            }
            actorRef.send({ type: "START" });
          }}
          className="hover:cursor-pointer"
        >
          ▶️ Iniciar Ejecución
        </Button>
      </div>
    );
  }

  if (snapshot.value === "running") {
    // No renderizar nada - el modal aparece automáticamente cuando detecta una pregunta
    return (
      <div id="execution-panel" className="p-4 bg-blue-50 shadow-lg rounded-lg">
        <p className="text-sm text-blue-700">
          ⏳ Ejecutando nodo: {snapshot.context.currentNodeId || "Iniciando..."}
        </p>
      </div>
    );
  }

  // Estado completed: muestra resultados
  if (snapshot.value === "completed") {
    return (
      <div
        id="execution-panel"
        className="p-4 bg-green-100 shadow-lg rounded-lg"
      >
        <h2 className="font-bold mb-2">✅ Ejecución Completada</h2>
        <pre className="text-xs bg-white p-2 rounded text-wrap">
          {JSON.stringify(snapshot.context.answers, null, 2)}
        </pre>
      </div>
    );
  }

  // Durante la ejecución, no mostrar nada (el modal aparece solo)
  return null;
}
