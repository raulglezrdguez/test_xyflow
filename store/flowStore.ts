import { create } from "zustand";
import type { MyNode, MyEdge } from "@/types/flow";
import { applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import type { NodeChange, EdgeChange, Connection } from "@xyflow/react";

type FlowStore = {
  nodes: MyNode[];
  edges: MyEdge[];
  answers: Record<string, unknown>;
  currentNodeId: string | null;
  executionStatus: "idle" | "running" | "paused" | "completed";

  // Acciones del diagrama
  setNodes: (nodes: MyNode[] | ((nds: MyNode[]) => MyNode[])) => void;
  setEdges: (edges: MyEdge[] | ((eds: MyEdge[]) => MyEdge[])) => void;
  onNodesChange: (changes: NodeChange<MyNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<MyEdge>[]) => void;
  onConnect: (connection: Connection) => void;

  // ✅ Método específico para actualizar status
  setNodeStatus: (nodeId: string, status: string) => void;
  setCurrentNodeId: (nodeId: string | null) => void;
  setAnswer: (nodeId: string, answer: unknown) => void;
  setExecutionStatus: (
    status: "idle" | "running" | "paused" | "completed"
  ) => void;
};

export const useFlowStore = create<FlowStore>()((set) => ({
  nodes: [],
  edges: [],
  answers: {},
  currentNodeId: null,
  executionStatus: "idle",

  setNodes: (nodes) =>
    set(
      typeof nodes === "function"
        ? (state) => ({ nodes: nodes(state.nodes) })
        : { nodes }
    ),
  setEdges: (edges) =>
    set(
      typeof edges === "function"
        ? (state) => ({ edges: edges(state.edges) })
        : { edges }
    ),
  onNodesChange: (changes) =>
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) })),
  onEdgesChange: (changes) =>
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),
  onConnect: (connection) =>
    set((state) => ({ edges: addEdge(connection, state.edges) })),

  setNodeStatus: (nodeId, status) =>
    set((state) => ({
      nodes: state.nodes.map((n) => {
        if (n.id !== nodeId) return n;
        return { ...n, data: { ...n.data, status } } as MyNode;
      }),
    })),

  setCurrentNodeId: (nodeId) => set({ currentNodeId: nodeId }),

  setAnswer: (nodeId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [nodeId]: answer },
    })),

  setExecutionStatus: (status) => set({ executionStatus: status }),
}));
