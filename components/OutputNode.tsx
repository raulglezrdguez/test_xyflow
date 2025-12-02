import type { MyNode, MyNodeDataOutput } from "@/types/flow";
import { Handle, NodeProps, Position } from "@xyflow/react";

export function OutputNode({ data }: NodeProps<MyNode>) {
  const nodeData = data as MyNodeDataOutput;

  return (
    <div className="bg-amber-100">
      <Handle type="target" position={Position.Top} />
      <div className="bg-amber-100 text-black">
        Resultado: {nodeData.result}
      </div>
    </div>
  );
}
