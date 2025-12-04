"use client";

import {
  ReactFlow,
  Background,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  BackgroundVariant,
  Connection,
  MiniMap,
} from "@xyflow/react";
import { useCallback, useState } from "react";
import { MyNode, MyEdge } from "@/types/flow";
import "@xyflow/react/dist/style.css";
import "./styles.css";

import { InputNode } from "@/components/InputNode";
import { DefaultNode } from "@/components/DefaultNode";
import { OutputNode } from "@/components/OutputNode";
import { AddNodePanel } from "@/components/AddNodePanel";

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
    data: { label: "Entrada", value: 100, status: "idle" },
  },
  {
    id: "2",
    type: "question",
    position: { x: 200, y: 100 },
    data: {
      label: "label",
      question: "question",
      questionType: "number",
      status: "idle",
    },
  },
  {
    id: "3",
    type: "output",
    position: { x: 400, y: 0 },
    data: { label: "label", result: "Éxito", status: "idle" },
  },
];

const initialEdges: MyEdge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e1-3", source: "2", target: "3" },
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
    console.log("Nodo clickeado:", node.position);
  }, []);

  //   const onNodeDragStop = useCallback((_: React.MouseEvent, node: MyNode) => {
  //     console.log("Nodo arrastrado:", node);
  //   }, []);

  //   const onNodeDoubleClick = useCallback((_: React.MouseEvent, node: MyNode) => {
  //     console.log("Nodo doble clickeado:", node);
  //   }, []);

  //   const onNodeContextMenu = useCallback((_: React.MouseEvent, node: MyNode) => {
  //     console.log("Nodo clic derecho:", node);
  //   }, []);

  //   const onNodeMouseEnter = useCallback((_: React.MouseEvent, node: MyNode) => {
  //     console.log("Nodo mouse enter:", node);
  //   }, []);

  //   const onNodeMouseLeave = useCallback((_: React.MouseEvent, node: MyNode) => {
  //     console.log("Nodo mouse leave:", node);
  //   }, []);

  //   const onNodeDragStart = useCallback((_: React.MouseEvent, node: MyNode) => {
  //     console.log("Nodo drag start:", node);
  //   }, []);

  //   const onNodeDrag = useCallback((_: React.MouseEvent, node: MyNode) => {
  //     console.log("Nodo drag:", node);
  //   }, []);

  //   const onNodeDragEnd = useCallback((_: React.MouseEvent, node: MyNode) => {
  //     console.log("Nodo drag end:", node);
  //   }, []);

  //   const onNodeDragOver = useCallback((_: React.MouseEvent, node: MyNode) => {
  //     console.log("Nodo drag over:", node);
  //   }, []);

  //   const onNodeDragEnter = useCallback((_: React.MouseEvent, node: MyNode) => {
  //     console.log("Nodo drag enter:", node);
  //   }, []);

  //   const onNodeDragExit = useCallback((_: React.MouseEvent, node: MyNode) => {
  //     console.log("Nodo drag exit:", node);
  //   }, []);

  //   const onNodeDragLeave = useCallback((_: React.MouseEvent, node: MyNode) => {
  //     console.log("Nodo drag leave:", node);
  //   }, []);

  //   const onNodeDragMove = useCallback((_: React.MouseEvent, node: MyNode) => {
  //     console.log("Nodo drag move:", node);
  //   }, []);

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex-1 [&_.react-flow__node]:bg-transparent! [&_.react-flow__node]:border-0! [&_.react-flow__node]:p-0! [&_.react-flow__node]:min-w-0!">
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
          <Background
            color="#1a1a1a"
            variant={BackgroundVariant.Dots}
            style={{ background: "#494949" }}
          />
          <MiniMap />
          <AddNodePanel setNodes={setNodes} nodes={nodes} />
        </ReactFlow>
      </div>
    </div>
  );
}
