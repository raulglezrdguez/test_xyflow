"use client";

import {
  ReactFlow,
  Background,
  Controls,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  BackgroundVariant,
} from "@xyflow/react";
import { useCallback, useState } from "react";
import { MyNode, MyEdge } from "@/types/flow";
import "@xyflow/react/dist/style.css";

import { InputNode } from "@/components/InputNode";
import { DefaultNode } from "@/components/DefaultNode";
import { OutputNode } from "@/components/OutputNode";

const nodeTypes = {
  input: InputNode,
  default: DefaultNode,
  output: OutputNode,
};

const initialNodes: MyNode[] = [
  {
    id: "1",
    type: "input",
    position: { x: 0, y: 0 },
    data: { label: "Entrada", value: 100 },
  },
  {
    id: "2",
    type: "default",
    position: { x: 200, y: 100 },
    data: { variable: "x", operator: 42 },
  },
  {
    id: "3",
    type: "output",
    position: { x: 400, y: 0 },
    data: { result: "Éxito" },
  },
];

const initialEdges: MyEdge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e1-3", source: "1", target: "3" },
];

export default function FlowPage() {
  const [nodes, setNodes] = useState<MyNode[]>(initialNodes);
  const [edges, setEdges] = useState<MyEdge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange<MyNode>[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<MyEdge>[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  return (
    <div className="w-full h-screen">
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background color="#ccc" variant={BackgroundVariant.Dots} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
