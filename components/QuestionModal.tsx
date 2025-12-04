// components/QuestionModal.tsx
"use client";

import { useState } from "react";
import { useSelector } from "@xstate/react";
import { useFlowMachine } from "@/contexts/flowMachineContext";
import type { MyNode, QuestionNodeData } from "@/types/flow";

export function QuestionModal() {
  const actorRef = useFlowMachine();
  const [answer, setAnswer] = useState("");

  console.log(actorRef);

  // ✅ SELECTOR: Solo se renderiza si hay una pregunta activa
  const currentQuestion = useSelector(
    actorRef,
    (state) => {
      // ✅ VERIFICA ESTADO EXACTO
      const isWaiting =
        typeof state.value === "object" &&
        state.value.running === "waitingInput";

      if (!isWaiting) return null;

      const nodeId = state.context.currentNodeId;
      if (!nodeId) return null;

      const node = state.context.nodes.find((n: MyNode) => n.id === nodeId);
      return node?.type === "question" ? node : null;
    },
    (a, b) => JSON.stringify(a) === JSON.stringify(b) // Comparador profundo
  );

  console.log("📌 Estado máquina:", actorRef.getSnapshot().value);
  console.log("🎯 Nodo actual:", actorRef.getSnapshot().context.currentNodeId);
  console.log("📝 Pregunta detectada:", currentQuestion);

  // Si no hay pregunta activa, no renderizar nada
  if (!currentQuestion) return null;

  const data = currentQuestion.data as QuestionNodeData;

  const handleSubmit = () => {
    actorRef.send({
      type: "ANSWER",
      nodeId: currentQuestion.id,
      answer: data.questionType === "number" ? Number(answer) : answer,
    });
    setAnswer("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
        <h2 className="text-xl font-bold mb-4">{data.label}</h2>
        <p className="mb-4 text-gray-700">{data.question}</p>

        {data.questionType === "select" && data.options ? (
          <select
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona una opción...</option>
            {data.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={data.questionType}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Escribe tu respuesta..."
          />
        )}

        <button
          onClick={handleSubmit}
          disabled={!answer}
          className={`mt-4 w-full px-4 py-2 rounded-lg text-white ${
            answer
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Enviar Respuesta
        </button>
      </div>
    </div>
  );
}

//"use client";
// import { useFlowMachine, useFlowSnapshot } from "@/contexts/flowMachineContext";
// import type { MyNode, QuestionNodeData } from "@/types/flow";
// import { useState } from "react";

// export function QuestionModal() {
//   const actorRef = useFlowMachine();
//   const snapshot = useFlowSnapshot();

//   const [answer, setAnswer] = useState("");

//   // ✅ Usa el snapshot para obtener datos
//   const currentNodeId = snapshot.context.currentNodeId;
//   const currentNode = snapshot.context.nodes.find(
//     (n: MyNode) => n.id === currentNodeId
//   );

//   // ✅ Verifica el estado actual de la máquina
//   if (
//     snapshot.value !== "running" ||
//     !currentNode ||
//     currentNode.type !== "question"
//   ) {
//     return null;
//   }

//   const data = currentNode.data as QuestionNodeData;

//   const handleSubmit = () => {
//     actorRef.send({
//       type: "ANSWER",
//       nodeId: currentNodeId || "",
//       answer: data.questionType === "number" ? Number(answer) : answer,
//     });
//     setAnswer("");
//   };

//   return (
//     // ... tu UI aquí
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//       <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
//         <h2 className="text-xl font-bold mb-4">{data.label}</h2>
//         <p className="mb-4">{data.question}</p>

//         {data.questionType === "select" && data.options ? (
//           <select
//             value={answer}
//             onChange={(e) => setAnswer(e.target.value)}
//             className="w-full px-3 py-2 border rounded-lg"
//           >
//             <option value="">Selecciona...</option>
//             {data.options.map((opt) => (
//               <option key={opt} value={opt}>
//                 {opt}
//               </option>
//             ))}
//           </select>
//         ) : (
//           <input
//             type={data.questionType}
//             value={answer}
//             onChange={(e) => setAnswer(e.target.value)}
//             className="w-full px-3 py-2 border rounded-lg"
//             placeholder="Tu respuesta..."
//           />
//         )}

//         <button
//           onClick={handleSubmit}
//           className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
//         >
//           Responder
//         </button>
//       </div>
//     </div>
//   );
// }
