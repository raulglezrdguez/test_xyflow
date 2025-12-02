import { Node, Edge } from "@xyflow/react";

export type MyNodeType = "input" | "default" | "output";

export interface MyNodeDataInput extends Record<string, unknown> {
  label: string;
  value?: number;
  description?: string;
}

export interface MyNodeDataDefault extends Record<string, unknown> {
  variable: string;
  operator?: number;
}

export interface MyNodeDataOutput extends Record<string, unknown> {
  result: string;
}

export type MyNode =
  | Node<MyNodeDataInput, "input">
  | Node<MyNodeDataDefault, "default">
  | Node<MyNodeDataOutput, "output">;
export type MyEdge = Edge;
