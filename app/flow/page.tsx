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
  Connection,
  Node,
} from "@xyflow/react";
import { useCallback, useState } from "react";
import {
  MyNode,
  MyEdge,
  MyNodeDataInput,
  MyNodeDataDefault,
  MyNodeDataOutput,
} from "@/types/flow";
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

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: MyEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        animated: false,
      };
      setEdges((eds) => [...eds, newEdge]);
    },
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: MyNode) => {
    console.log("Nodo clickeado:", node);
  }, []);

  const handleAddInput = useCallback(() => {
    const newNode: Node<MyNodeDataInput, "input"> = {
      id: `${Date.now()}`,
      type: "input",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: "Nuevo Input",
        value: 123,
        description: "Entrada de datos",
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, []);

  const handleAddDefault = useCallback(() => {
    const newNode: Node<MyNodeDataDefault, "default"> = {
      id: `${Date.now()}`,
      type: "default",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        variable: "I",
        operator: 2,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, []);

  const handleAddOutput = useCallback(() => {
    const newNode: Node<MyNodeDataOutput, "output"> = {
      id: `${Date.now()}`,
      type: "output",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        result: "Result",
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="p-4 bg-gray-100 border-b flex gap-2">
        <button
          onClick={handleAddInput}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          + Input
        </button>
        <button
          onClick={handleAddDefault}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          + Default
        </button>
        <button
          onClick={handleAddOutput}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          + Output
        </button>
      </div>
      <div className="flex-1">
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
        >
          <Background color="#ccc" variant={BackgroundVariant.Dots} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
