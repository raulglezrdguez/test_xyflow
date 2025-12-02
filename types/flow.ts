import { Node, Edge } from "@xyflow/react";

export type MyNodeType = "input" | "default" | "output";

export interface MyNodeData extends Record<string, unknown> {
  label: string;
  value?: number;
  description?: string;
}

export interface MyNodeData1 extends Record<string, unknown> {
  variable: string;
  operator?: number;
}

// Tipos para tus nodos y bordes
export type MyNode = Node<MyNodeData | MyNodeData1, MyNodeType>;
export type MyEdge = Edge;
