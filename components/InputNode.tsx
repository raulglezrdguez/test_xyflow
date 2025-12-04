import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { MyNode, InputNodeData } from "@/types/flow";
// import { useEffect } from "react";
// import { useFlowMachine } from "@/contexts/flowMachineContext";

export function InputNode({ data, id }: NodeProps<MyNode>) {
  const nodeData = data as InputNodeData;

  // const actorRef = useFlowMachine();

  // useEffect(() => {
  //   console.log(data.status);
  //   if (data.status === "running") {
  //     // ✅ Enviar respuesta vacía para marcar como ejecutado
  //     setTimeout(() => {
  //       actorRef.send({
  //         type: "ANSWER",
  //         nodeId: id,
  //         answer: null, // Input/output no necesitan respuesta real
  //       });
  //     }, 500); // Pequeño delay para que se vea el cambio
  //   }
  // }, [data.status, id, data.label, actorRef]);

  return (
    <div>
      <div className="bg-green-100 text-gray-700">{nodeData.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
