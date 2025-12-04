import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { MyNode, InputNodeData } from "@/types/flow";

export function InputNode({ data }: NodeProps<MyNode>) {
  const nodeData = data as InputNodeData;

  return (
    <div>
      <div className="bg-green-100 text-gray-700">{nodeData.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
