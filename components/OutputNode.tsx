import type { MyNode, OutputNodeData } from "@/types/flow";
import { Handle, NodeProps, Position } from "@xyflow/react";

export function OutputNode({ data }: NodeProps<MyNode>) {
  const nodeData = data as OutputNodeData;

  return (
    <div className="bg-amber-100">
      <Handle type="target" position={Position.Top} />
      <div className="bg-amber-100 text-black">
        Resultado: {`${nodeData.result}` || "N/A"}
      </div>
    </div>
  );
}
