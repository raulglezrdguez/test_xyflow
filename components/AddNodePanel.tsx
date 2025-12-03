// components/AddNodePanel.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { Panel, Node } from "@xyflow/react";
import type {
  MyNode,
  MyNodeDataDefault,
  MyNodeDataInput,
  MyNodeDataOutput,
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
    const newNode: Node<MyNodeDataInput, "input"> = {
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

  const handleAddDefault = useCallback(() => {
    const newNode: Node<MyNodeDataDefault, "default"> = {
      id: `${Date.now()}`,
      type: "default",
      position: { x: position.x, y: position.y },
      data: {
        variable: "Nuevo Default",
        operator: 123,
        status: "idle",
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [position, setNodes]);

  const handleAddOutput = useCallback(() => {
    const newNode: Node<MyNodeDataOutput, "output"> = {
      id: `${Date.now()}`,
      type: "output",
      position: { x: position.x, y: position.y },
      data: {
        result: "Nuevo Result",
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
      <button
        onClick={handleAddDefault}
        className="px-3 py-1 bg-blue-500 text-white rounded"
      >
        + Default
      </button>
      <button
        onClick={handleAddOutput}
        className="px-3 py-1 bg-yellow-500 text-white rounded"
      >
        + Output
      </button>
    </Panel>
  );
}
