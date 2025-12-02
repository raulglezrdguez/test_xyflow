import type { MyNode, MyNodeDataDefault } from "@/types/flow";
import { NodeProps, Handle, Position } from "@xyflow/react";

export function DefaultNode({ data }: NodeProps<MyNode>) {
  const nodeData = data as MyNodeDataDefault;

  return (
    <div>
      <Handle type="target" position={Position.Top} />
      <div>
        {nodeData.variable} - {nodeData.operator}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
