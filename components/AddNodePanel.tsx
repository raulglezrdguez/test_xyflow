// components/AddNodePanel.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { Panel, Node } from "@xyflow/react";
import type {
  MyNode,
  InputNodeData,
  QuestionNodeData,
  HttpNodeData,
  GeminiInfoNodeData,
  GeminiNodeData,
  OutputNodeData,
} from "@/types/flow";

export function AddNodePanel({
  nodes,
  setNodes,
}: {
  nodes: MyNode[];
  setNodes: (nodes: MyNode[] | ((nds: MyNode[]) => MyNode[])) => void;
}) {
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const findPosition = () => {
      if (!nodes || nodes.length === 0) {
        setPosition({ x: 0, y: 0 });
        return;
      }

      const selNode = nodes.find((n) => n.selected);
      if (selNode) {
        setPosition({ x: selNode.position.x + 20, y: selNode.position.y + 50 });
      } else
        setPosition({
          x: nodes[0].position.x + 20,
          y: nodes[0].position.y + 50,
        });
    };

    findPosition();
  }, [nodes]);

  const handleAddInput = useCallback(() => {
    const newNode: Node<InputNodeData, "input"> = {
      id: `${Date.now()}`,
      type: "input",
      position: { x: position.x, y: position.y },
      data: {
        label: "Nuevo Input",
        value: 123,
        description: "Entrada de datos",
        status: "idle",
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [position, setNodes]);

  return (
    <Panel
      position="top-left"
      className="flex flex-col gap-2 p-2 bg-white shadow-lg rounded"
    >
      <button
        onClick={handleAddInput}
        className="px-3 py-1 bg-green-500 text-white rounded"
      >
        + Input
      </button>
    </Panel>
  );
}
