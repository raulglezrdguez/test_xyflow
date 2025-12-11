import type { MyNodeType } from "@/types/flow";

export interface NodeTypeInfo {
  type: MyNodeType;
  defaultData: Record<string, unknown>;
}

export const nodeTypeDefaults: Record<MyNodeType, NodeTypeInfo> = {
  input: {
    type: "input",
    defaultData: { label: "Input", status: "idle" },
  },
  question: {
    type: "question",
    defaultData: {
      label: "Nueva Pregunta",
      question: "¿Cuál es tu pregunta?",
      questionType: "text",
      status: "idle",
    },
  },
  "http-request": {
    type: "http-request",
    defaultData: {
      label: "Nueva API",
      endpoint: "https://api.ejemplo.com",
      method: "GET",
      status: "idle",
    },
  },
  "gemini-info": {
    type: "gemini-info",
    defaultData: { label: "Info de Gemini" },
  },
  gemini: {
    type: "gemini",
    defaultData: {
      label: "Gemini service",
      prompt: "Prompt...",
      model: "gemini-2.5-flash",
      temperature: 1.0,
    },
  },
  output: {
    type: "output",
    defaultData: { label: "Nuevo Output", result: "", status: "idle" },
  },
};

export function getNodeDataByType(type: MyNodeType): Record<string, unknown> {
  return nodeTypeDefaults[type].defaultData;
}
