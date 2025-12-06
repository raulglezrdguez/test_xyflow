import { Node, Edge } from "@xyflow/react";

export type MyNodeType = "input" | "question" | "http-request" | "output";
export type NodeStatus = "idle" | "running" | "executed" | "error";
export type QuestionType = "text" | "select" | "number";

interface MyNodeDataRoot extends Record<string, unknown> {
  label: string;
}

export interface QuestionNodeData extends MyNodeDataRoot {
  question: string;
  questionType: QuestionType;
  options?: string[];
  status?: NodeStatus;
}

export interface HttpNodeData extends MyNodeDataRoot {
  endpoint: string;
  method: "GET" | "POST";
  responseType: "json" | "text";
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
  | Node<OutputNodeData, "output">;

export interface MyEdge extends Edge {
  data?: {
    condition?: string; // expresión JS: "answers['nodo1'] === 'si'"
  };
}
