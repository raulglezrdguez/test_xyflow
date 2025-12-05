// machines/flowMachine.ts
import { createMachine, assign, fromPromise } from "xstate";
import type { MyNode, MyEdge } from "@/types/flow";
import { useFlowStore } from "@/store/flowStore";

interface FlowContext {
  nodes: MyNode[];
  edges: MyEdge[];
  currentNodeId: string | null;
  answers: Record<string, unknown>;
}

type FlowEvent =
  | { type: "START" }
  | { type: "ANSWER"; nodeId: string; answer: unknown }
  | { type: "COMPLETE" }
  | { type: "RESET" };

const httpActor = fromPromise(
  async ({
    input,
  }: {
    input: { endpoint: string; method: string; responseType: string };
  }) => {
    const response = await fetch(input.endpoint, {
      method: input.method,
      headers: { "Content-Type": "application/json" },
      // body: "",
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return input.responseType === "text" ? response.text() : response.json();
  }
);

export const flowMachine = createMachine(
  {
    id: "flowExecution",
    initial: "idle",

    types: {
      context: {} as FlowContext,
      events: {} as FlowEvent,
      input: {} as { nodes: MyNode[]; edges: MyEdge[] },
    },

    context: ({ input }) => ({
      nodes: input.nodes,
      edges: input.edges,
      currentNodeId: null,
      answers: {},
    }),

    states: {
      idle: {
        on: { START: "running" },
      },

      running: {
        initial: "evaluating",

        states: {
          evaluating: {
            entry: "findNextNode",
            always: [
              { target: "executing", guard: "isAutoExecutableNode" },
              { target: "waitingInput", guard: "isQuestionNode" },
              { target: "processingHttp", guard: "isHttpNode" },
              { target: "#flowExecution.completed", guard: "noMoreNodes" },
            ],
          },

          waitingInput: {
            on: {
              ANSWER: {
                target: "evaluating",
                actions: [
                  assign({
                    answers: ({ context, event }) => ({
                      ...context.answers,
                      [event.nodeId]: event.answer,
                    }),
                  }),
                  "markNodeAsExecuted",
                ],
              },
            },
          },

          processingHttp: {
            invoke: {
              src: httpActor,
              input: ({ context }) => {
                const node = context.nodes.find(
                  (n) => n.id === context.currentNodeId
                );
                if (!node || node.type !== "http-request")
                  throw new Error("Invalid node");
                return {
                  endpoint: node.data.endpoint,
                  method: node.data.method,
                  responseType: node.data.responseType,
                };
              },
              onDone: {
                target: "evaluating",
                actions: assign({
                  answers: ({ context, event }) => ({
                    ...context.answers,
                    [context.currentNodeId as string]: event.output,
                  }),
                }),
              },
              onError: {
                target: "evaluating",
                actions: assign({
                  answers: ({ context, event }) => ({
                    ...context.answers,
                    [context.currentNodeId as string]: {
                      error: (event.error as Error).message,
                    },
                  }),
                }),
              },
            },
          },

          executing: {
            entry: "markNodeAsExecuted",
            always: "evaluating",
          },
        },
      },

      completed: {
        on: { RESET: "idle" },
      },
    },
  },
  {
    guards: {
      isAutoExecutableNode: ({ context }) => {
        const node = context.nodes.find((n) => n.id === context.currentNodeId);
        return node?.type === "input" || node?.type === "output";
      },
      isQuestionNode: ({ context }) => {
        const node = context.nodes.find((n) => n.id === context.currentNodeId);
        return node?.type === "question";
      },
      isHttpNode: ({ context }) => {
        const node = context.nodes.find((n) => n.id === context.currentNodeId);
        return node?.type === "http-request";
      },
      isOutputNode: ({ context }) => {
        const node = context.nodes.find((n) => n.id === context.currentNodeId);
        return node?.type === "output";
      },
      noMoreNodes: ({ context }) => {
        return context.currentNodeId === null;
      },
    },

    actions: {
      findNextNode: assign(({ context }) => {
        const currentNodeId = context.currentNodeId;
        let nextNodeId: string | null = null;

        if (!currentNodeId) {
          const startNode = context.nodes.find((n) => n.type === "input");
          return { currentNodeId: startNode?.id || null };
        }

        // Lógica para encontrar siguiente nodo basado en condiciones
        const connectedEdges = context.edges.filter(
          (e) => e.source === currentNodeId
        );

        for (const edge of connectedEdges) {
          if (edge.data?.condition) {
            try {
              const func = new Function(
                "answers",
                `return ${edge.data.condition}`
              );
              if (func(context.answers)) {
                nextNodeId = edge.target;
                break;
              }
            } catch (e) {
              console.error("Invalid condition:", e);
            }
          } else {
            nextNodeId = edge.target;
            break;
          }
        }

        return { currentNodeId: nextNodeId };
      }),

      markNodeAsExecuted: ({ context }) => {
        // Actualiza el status en Zustand
        if (context.currentNodeId) {
          useFlowStore
            .getState()
            .setNodeStatus(context.currentNodeId, "executed");
        }
      },

      updateAnswer: ({ context, event }) => {
        // Acción separada para actualizar la respuesta
        if (event.type === "ANSWER") {
          // Ya manejado por assign
        }
      },
    },
  }
);
