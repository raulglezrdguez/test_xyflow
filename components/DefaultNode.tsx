import type { MyNode, QuestionNodeData } from "@/types/flow";
import { NodeProps, Handle, Position } from "@xyflow/react";
import { Play, CheckCircle, Clock } from "lucide-react";

export function DefaultNode({ data }: NodeProps<MyNode>) {
  const nodeData = data as QuestionNodeData;
  const status = nodeData.status || "idle";

  const statusStyles = {
    idle: "bg-gray-100 border-gray-400 text-gray-600",
    running: "bg-green-100 border-green-500 text-green-700 animate-pulse",
    executed: "bg-blue-100 border-blue-500 text-blue-700",
  };

  const StatusIcon = {
    idle: Clock,
    running: Play,
    executed: CheckCircle,
  }[status];

  return (
    <div className="p-0 shadow-md rounded-md bg-transparent border-2 border-stone-400">
      <div className={`flex justify-center  ${statusStyles[status]}`}>
        <div className="text-sm font-semibold">
          <div className="truncate">
            {nodeData.label} & {nodeData.question ?? ""}
          </div>
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border border-gray-300 flex items-center justify-center shadow-sm">
          <StatusIcon size={14} />
        </div>
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} id="a" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={{ left: 10, backgroundColor: "#cc0", width: 10, height: 10 }}
      />
    </div>
  );
}
