"use client";

import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
} from "@xyflow/react";
import { useFlowStore } from "@/store/flowStore";
import { FlowMachineProvider } from "@/contexts/flowMachineContext";
import { ExecutionPanel } from "@/components/ExecutionPanel";
import { QuestionNode } from "@/components/QuestionNode";
import { HttpNode } from "@/components/HttpNode";

import "@xyflow/react/dist/style.css";
import "./styles.css";

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
    id: "I",
    type: "input",
    position: { x: 0, y: 0 },
    data: {
      label: "Inicio del Flujo",
      status: "idle",
    } as InputNodeData,
  },
  {
    id: "II",
    type: "question",
    position: { x: 300, y: 150 },
    data: {
      label: "Pregunta de Edad",
      question: "¿Cuál es tu edad?",
      // questionType: "number",
      questionType: "select",
      options: [
        { id: "1", value: "opcion 1 con mas texto" },
        { id: "2", value: "opción 2 con un poquito mas de texto todavia" },
      ],
      // options: undefined,
      status: "idle",
    } as QuestionNodeData,
  },
  {
    id: "III",
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
    id: "IV",
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
  { id: "eI-II", source: "I", target: "II" },
  { id: "eII-III", source: "II", target: "III" },
  { id: "eIII-IV", source: "III", target: "IV" },
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
          <Background
            color={"#aaa"}
            style={{ background: "#333" }}
            variant={BackgroundVariant.Dots}
          />
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
