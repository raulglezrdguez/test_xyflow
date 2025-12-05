// app/runner/page.tsx
"use client";

import { ReactFlow, Background, Controls } from "@xyflow/react";
import { useFlowStore } from "@/store/flowStore";
import { FlowMachineProvider } from "@/contexts/flowMachineContext";
import { ExecutionPanel } from "@/components/ExecutionPanel";
import { QuestionNode } from "@/components/QuestionNode";
import { HttpNode } from "@/components/HttpNode";

import "@xyflow/react/dist/style.css";
import {
  HttpNodeData,
  InputNodeData,
  MyEdge,
  MyNode,
  OutputNodeData,
  QuestionNodeData,
} from "@/types/flow";
import { useEffect, useState } from "react";
import { InputNode } from "@/components/InputNode";
import { OutputNode } from "@/components/OutputNode";
import { QuestionModal } from "@/components/QuestionModal";

const nodeTypes = {
  input: InputNode,
  question: QuestionNode,
  "http-request": HttpNode,
  output: OutputNode,
};

const initialNodes: MyNode[] = [
  {
    id: "1",
    type: "input",
    position: { x: 0, y: 0 },
    data: {
      label: "Inicio del Flujo",
      status: "idle",
    } as InputNodeData,
  },
  {
    id: "2",
    type: "question",
    position: { x: 300, y: 150 },
    data: {
      label: "Pregunta de Edad",
      question: "¿Cuál es tu edad?",
      questionType: "number",
      options: [],
      status: "idle",
    } as QuestionNodeData,
  },
  {
    id: "3",
    type: "http-request",
    position: { x: 600, y: 150 },
    data: {
      label: "Verificar API",
      endpoint: "http://metaphorpsum.com/paragraphs/2",
      method: "GET" as const,
      responseType: "text" as const,
      status: "idle",
    } as HttpNodeData,
  },
  {
    id: "4",
    type: "output",
    position: { x: 900, y: 0 },
    data: {
      label: "Resultado Final",
      result: "Proceso completado",
      status: "idle",
    } as OutputNodeData,
  },
];

const initialEdges: MyEdge[] = [
  { id: "e1-2", source: "1", target: "2" },
  // { id: "e2-4", source: "2", target: "4" },
  { id: "e2-3", source: "2", target: "3" },
  { id: "e3-4", source: "3", target: "4" },
];

function FlowWithExecution() {
  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);
  const onNodesChange = useFlowStore((state) => state.onNodesChange);
  const onEdgesChange = useFlowStore((state) => state.onEdgesChange);

  return (
    <div className="w-full h-screen flex flex-col">
      <ExecutionPanel />

      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      <QuestionModal />
    </div>
  );
}

export default function Page() {
  const setNodes = useFlowStore((state) => state.setNodes);
  const setEdges = useFlowStore((state) => state.setEdges);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const setReady = () => {
      setIsReady(true);
    };

    setNodes(initialNodes);
    setEdges(initialEdges);
    setReady();
  }, [setNodes, setEdges]);

  if (!isReady) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-xl">Cargando diagrama...</div>
      </div>
    );
  }

  return (
    <FlowMachineProvider>
      <FlowWithExecution />
    </FlowMachineProvider>
  );
}
