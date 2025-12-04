"use client";

import { NodeProps, Handle, Position } from "@xyflow/react";
import type { MyNode, QuestionNodeData } from "@/types/flow";

export function QuestionNode({ data }: NodeProps<MyNode>) {
  const nodeData = data as QuestionNodeData;

  return (
    <div
      className={`relative min-w-48 px-4 py-3 rounded-xl border-2 shadow-md ${
        nodeData.status === "running"
          ? "bg-purple-100 border-purple-500 animate-pulse"
          : nodeData.status === "executed"
          ? "bg-green-100 border-green-500"
          : "bg-gray-100 border-gray-400"
      }`}
    >
      <Handle type="target" position={Position.Top} />

      <div className="text-sm font-semibold text-gray-700">
        ❓ {nodeData.question}
      </div>

      {nodeData.questionType === "select" && nodeData.options && (
        <div className="mt-2 text-xs">
          Opciones: {nodeData.options.join(", ")}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
