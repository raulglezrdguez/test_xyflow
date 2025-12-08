// components/QuestionModal.tsx
"use client";

import { useState } from "react";
import { useSelector } from "@xstate/react";
import { useFlowMachine } from "@/contexts/flowMachineContext";
import type { MyNode, QuestionNodeData, QuestionOption } from "@/types/flow";

export function QuestionModal() {
  const actorRef = useFlowMachine();
  const [answer, setAnswer] = useState<QuestionOption | string>("");

  const currentQuestion = useSelector(
    actorRef,
    (state) => {
      const isWaiting =
        typeof state.value === "object" &&
        state.value.running === "waitingInput";

      if (!isWaiting) return null;

      const nodeId = state.context.currentNodeId;
      if (!nodeId) return null;

      const node = state.context.nodes.find((n: MyNode) => n.id === nodeId);
      return node?.type === "question" ? node : null;
    },
    (a, b) => JSON.stringify(a) === JSON.stringify(b) // Comparador profundo
  );

  // Si no hay pregunta activa, no renderizar nada
  if (!currentQuestion) return null;

  const data = currentQuestion.data as QuestionNodeData;

  const handleSubmit = () => {
    actorRef.send({
      type: "ANSWER",
      nodeId: currentQuestion.id,
      answer: data.questionType === "number" ? Number(answer) : answer,
    });
    setAnswer("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
        <h2 className="text-xl font-bold mb-4">{data.label}</h2>
        <p className="mb-4 text-gray-700">{data.question}</p>

        {data.questionType === "select" && data.options ? (
          <select
            value={(answer as QuestionOption).id?.toString() || ""}
            onChange={(e) => {
              const selectedId = e.target.value; // El id de la opción
              const selectedOption = data.options?.find(
                (opt) => opt.id.toString() === selectedId
              );

              if (selectedOption) {
                setAnswer({
                  id: selectedOption.id,
                  value: selectedOption.value,
                });
              } else {
                setAnswer({
                  id: "0",
                  value: "",
                });
              }
            }}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          >
            <option id="0">Selecciona una opción...</option>
            {data.options.map((opt) => (
              <option key={opt.id} value={opt.id.toString()}>
                {opt.value}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={data.questionType}
            value={answer as string}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Escribe tu respuesta..."
            autoFocus
          />
        )}

        <button
          onClick={handleSubmit}
          disabled={!answer}
          className={`mt-4 w-full px-4 py-2 rounded-lg text-white ${
            answer
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Enviar Respuesta
        </button>
      </div>
    </div>
  );
}

/**
 * 
 * <select
  value={(answer as QuestionOption).id?.toString() || ""}
  onChange={(e) => {
    const selectedId = e.target.value; // El id de la opción
    const selectedOption = data.options.find(opt => opt.id.toString() === selectedId);
    
    if (selectedOption) {
      setAnswer({
        id: selectedOption.id,
        value: selectedOption.value, // El texto visible
      });
    } else {
      // Opción por defecto "Selecciona..."
      setAnswer({
        id: 0,
        value: "",
      });
    }
  }}
  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <option value="">Selecciona una opción...</option>
  {data.options.map((opt) => (
    <option key={opt.id} value={opt.id.toString()}>
      {opt.value}
    </option>
  ))}
</select>
 */
