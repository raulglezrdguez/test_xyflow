import { Node, Edge } from "@xyflow/react";

export type MyNodeType =
  | "input"
  | "question"
  | "http-request"
  | "gemini-info"
  | "gemini"
  | "output";
export type NodeStatus = "idle" | "running" | "executed" | "error";
export type QuestionType = "text" | "select" | "number";
export type QuestionOption = { id: string; value: string };
export const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
  "gemini-pro-latest",
  "gemini-2.5-flash-lite",
] as const;
export type GeminiModel = (typeof GEMINI_MODELS)[number];
interface MyNodeDataRoot extends Record<string, unknown> {
  label: string;
}

export interface QuestionNodeData extends MyNodeDataRoot {
  question: string;
  questionType: QuestionType;
  options?: QuestionOption[];
  status?: NodeStatus;
}

export interface HttpNodeData extends MyNodeDataRoot {
  endpoint: string;
  method: "GET" | "POST";
  responseType: "json" | "text";
  status?: NodeStatus;
  response?: unknown;
}

export interface GeminiInfoNodeData extends MyNodeDataRoot {
  apiKey?: string;
  status?: NodeStatus;
}

export interface GeminiNodeData extends MyNodeDataRoot {
  prompt: string;
  model: GeminiModel;
  temperature?: number;
  status?: NodeStatus;
  response?: unknown;
}

export interface InputNodeData extends MyNodeDataRoot {
  status?: NodeStatus;
}

export interface OutputNodeData extends MyNodeDataRoot {
  status?: NodeStatus;
  result: unknown;
}

export type MyNode =
  | Node<InputNodeData, "input">
  | Node<QuestionNodeData, "question">
  | Node<HttpNodeData, "http-request">
  | Node<GeminiInfoNodeData, "gemini-info">
  | Node<GeminiNodeData, "gemini">
  | Node<OutputNodeData, "output">;

export interface MyEdge extends Edge {
  data?: {
    condition?: string; // expresión JS: "answers['nodo1'] === 'si'"
  };
}
