import { Node, Edge } from "@xyflow/react";

export type MyNodeType = "input" | "default" | "output";
export type NodeStatus = "idle" | "running" | "executed";

interface MyNodeDataBase extends Record<string, unknown> {
  status: NodeStatus;
}
export interface MyNodeDataInput extends MyNodeDataBase {
  label: string;
  value?: number;
  description?: string;
}

export interface MyNodeDataDefault extends MyNodeDataBase {
  variable: string;
  operator?: number;
}

export interface MyNodeDataOutput extends MyNodeDataBase {
  result: string;
}

export type MyNode =
  | Node<MyNodeDataInput, "input">
  | Node<MyNodeDataDefault, "default">
  | Node<MyNodeDataOutput, "output">;
export type MyEdge = Edge;
