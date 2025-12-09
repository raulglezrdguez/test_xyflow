"use client";

import { useSelector } from "@xstate/react";
import { useFlowMachine } from "@/contexts/flowMachineContext";
import type { MyNode } from "@/types/flow";
import QuestionForm from "./QuestionForm";
import GeminiInfoForm from "./GeminiInfoForm";

export function QuestionModal() {
  const actorRef = useFlowMachine();

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
      return node?.type === "question" || node?.type === "gemini-info"
        ? node
        : null;
    },
    (a, b) => JSON.stringify(a) === JSON.stringify(b) // Comparador profundo
  );

  // Si no hay pregunta activa, no renderizar nada
  if (!currentQuestion) return null;

  if (currentQuestion.type === "gemini-info") {
    return <GeminiInfoForm currentQuestion={currentQuestion} />;
  } else {
    return <QuestionForm currentQuestion={currentQuestion} />;
  }
}
