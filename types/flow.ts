import { Node, Edge } from "@xyflow/react";

export type MyNodeType = "input" | "default" | "output";

export interface MyNodeData extends Record<string, unknown> {
  label: string;
  value?: number;
  description?: string;
}

// Tipos para tus nodos y bordes
export type MyNode = Node<MyNodeData, MyNodeType>;
export type MyEdge = Edge;
