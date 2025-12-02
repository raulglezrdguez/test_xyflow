import type { MyNode, MyNodeDataOutput } from "@/types/flow";
import { Handle, NodeProps, Position } from "@xyflow/react";

export function OutputNode({ data }: NodeProps<MyNode>) {
  const nodeData = data as MyNodeDataOutput;

  return (
    <div>
      <Handle type="target" position={Position.Top} />
      <div>Resultado: {nodeData.result}</div>
    </div>
  );
}
