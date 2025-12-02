import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { MyNode, MyNodeDataInput } from "@/types/flow";

export function InputNode({ data }: NodeProps<MyNode>) {
  const nodeData = data as MyNodeDataInput;

  return (
    <div>
      <Handle type="target" position={Position.Top} />
      <div className="bg-green-100 text-gray-700">
        {nodeData.label} - {nodeData.value}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
