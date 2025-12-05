// contexts/FlowMachineContext.tsx
"use client";

import { createContext, useContext, ReactNode, useEffect } from "react";
import { useMachine } from "@xstate/react";
import { ActorRefFrom } from "xstate";
import { flowMachine } from "@/machines/flowMachine";
import { useFlowStore } from "@/store/flowStore";

type FlowMachineActorRef = ActorRefFrom<typeof flowMachine>;

const FlowMachineContext = createContext<FlowMachineActorRef | null>(null);

export function FlowMachineProvider({ children }: { children: ReactNode }) {
  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);

  const [snapshot, send, actorRef] = useMachine(flowMachine, {
    input: { nodes, edges },
  });

  useEffect(() => {
    const subscription = actorRef.subscribe((nextSnapshot) => {
      // Actualiza nodo actual en Zustand
      if (
        nextSnapshot.context.currentNodeId !==
        useFlowStore.getState().currentNodeId
      ) {
        useFlowStore
          .getState()
          .setCurrentNodeId(nextSnapshot.context.currentNodeId);
      }

      // Sincroniza respuestas
      Object.entries(nextSnapshot.context.answers).forEach(
        ([nodeId, answer]) => {
          useFlowStore.getState().setAnswer(nodeId, answer);
        }
      );
    });

    return () => subscription.unsubscribe();
  }, [actorRef]);

  return (
    <FlowMachineContext.Provider value={actorRef}>
      {children}
    </FlowMachineContext.Provider>
  );
}

export const useFlowMachine = (): FlowMachineActorRef => {
  const context = useContext(FlowMachineContext);
  if (!context)
    throw new Error("useFlowMachine must be used within FlowMachineProvider");
  return context;
};

export const useFlowSnapshot = () => {
  const actorRef = useFlowMachine();
  return actorRef.getSnapshot();
};

// "use client";

// import { createContext, useContext, ReactNode, useEffect } from "react";
// import { useMachine } from "@xstate/react";
// import { ActorRefFrom } from "xstate";
// import { flowMachine } from "@/machines/flowMachine";
// import { useFlowStore } from "@/store/flowStore";

// type FlowMachineActorRef = ActorRefFrom<typeof flowMachine>;

// const FlowMachineContext = createContext<FlowMachineActorRef | null>(null);

// export function FlowMachineProvider({ children }: { children: ReactNode }) {
//   const nodes = useFlowStore((state) => state.nodes);
//   const edges = useFlowStore((state) => state.edges);

//   const [snapshot, send, actorRef] = useMachine(flowMachine, {
//     input: nodes.length > 0 ? { nodes, edges } : { nodes: [], edges: [] },
//   });

//   const setCurrentNodeId = useFlowStore((state) => state.setCurrentNodeId);
//   const setAnswer = useFlowStore((state) => state.setAnswer);

//   useEffect(() => {
//     // Suscribe a cambios del actor
//     const subscription = actorRef.subscribe((nextSnapshot) => {
//       // Actualiza nodo actual
//       if (
//         nextSnapshot.context.currentNodeId !==
//         useFlowStore.getState().currentNodeId
//       ) {
//         setCurrentNodeId(nextSnapshot.context.currentNodeId);
//       }

//       // Sincroniza respuestas
//       const storeAnswers = useFlowStore.getState().answers;
//       Object.entries(nextSnapshot.context.answers).forEach(
//         ([nodeId, answer]) => {
//           if (storeAnswers[nodeId] !== answer) {
//             setAnswer(nodeId, answer);
//           }
//         }
//       );
//     });

//     return () => subscription.unsubscribe();
//   }, [actorRef, setCurrentNodeId, setAnswer]);

//   return (
//     <FlowMachineContext.Provider value={actorRef}>
//       {children}
//     </FlowMachineContext.Provider>
//   );
// }

// export const useFlowMachine = (): FlowMachineActorRef => {
//   const context = useContext(FlowMachineContext);
//   if (!context) {
//     throw new Error("useFlowMachine must be used within FlowMachineProvider");
//   }
//   return context;
// };

// export const useFlowSnapshot = () => {
//   const actorRef = useFlowMachine();
//   return actorRef.getSnapshot();
// };
