import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { MyNode, InputNodeData } from "@/types/flow";
import { CheckCircle, Clock, Play, XCircle } from "lucide-react";
import { useFlowStore } from "@/store/flowStore";

export function InputNode({ data, id }: NodeProps<MyNode>) {
  const nodeData = data as InputNodeData;
  const status = nodeData.status || "idle";

  const nodeSelected = useFlowStore((status) => status.nodeSelected);
  const nodeSelectedText = nodeSelected?.id === id ? "text-green-800/80" : null;

  const statusStyles = {
    idle: "bg-gray-100 border-gray-400 text-gray-600",
    running: "bg-green-100 border-green-500 text-green-700 animate-pulse",
    executed: "bg-blue-100 border-blue-500 text-blue-700",
    error: "bg-red-100 border-red-500 text-red-700",
  };

  const StatusIcon = {
    idle: Clock,
    running: Play,
    executed: CheckCircle,
    error: XCircle,
  }[status];

  return (
    <div
      className={`relative min-w-48 px-4 py-3 rounded-xl border-2 shadow-md ${statusStyles[status]}`}
    >
      <div className={`flex flex-col justify-center ${nodeSelectedText}`}>
        <div className={`text-sm font-semibold truncate`}>{nodeData.label}</div>

        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border border-gray-600 flex items-center justify-center shadow-sm">
          <StatusIcon size={14} />
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
