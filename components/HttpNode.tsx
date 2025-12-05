// components/HttpNode.tsx
"use client";

import { useEffect } from "react";
import { useSelector } from "@xstate/react";
import { useFlowMachine } from "@/contexts/flowMachineContext";
import type { MyNode, HttpNodeData } from "@/types/flow";
import { NodeProps, Handle, Position } from "@xyflow/react";

export function HttpNode({ data, id }: NodeProps<MyNode>) {
  const actorRef = useFlowMachine();
  const nodeData = data as HttpNodeData;

  const isThisNodeRunning = useSelector(actorRef, (state) => {
    return (
      state.value === "running.processingHttp" &&
      state.context.currentNodeId === id
    );
  });

  // Cuando se activa, envía el evento
  useEffect(() => {
    if (isThisNodeRunning) {
      actorRef.send({
        type: "ANSWER", // Ajusta según tu evento
        nodeId: id,
        answer: { endpoint: nodeData.endpoint, method: nodeData.method },
      });
    }
  }, [isThisNodeRunning, id, nodeData.endpoint, nodeData.method, actorRef]);

  return (
    <div
      className={`relative min-w-48 px-4 py-3 rounded-xl border-2 shadow-md ${
        nodeData.status === "loading"
          ? "bg-yellow-100 border-yellow-500 animate-pulse"
          : nodeData.status === "success"
          ? "bg-green-100 border-green-500"
          : nodeData.status === "error"
          ? "bg-red-100 border-red-500"
          : "bg-gray-100 border-gray-400"
      }`}
    >
      <Handle type="target" position={Position.Top} />
      <div className="text-sm font-semibold">🌐 {nodeData.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
