"use client";

import { GeminiInfoNodeData } from "@/types/flow";

type Props = { data: GeminiInfoNodeData | null; id: string };

const GeminiInfoNodeProperties = ({ data, id }: Props) => {
  if (!data) return null;

  return (
    <div className="flex flex-col border rounded-2xl px-4 py-2 max-w-48">
      <h2 className="text-gray-700">Gemini Info Node {id}</h2>
      <hr />
      <p className="mt-2 text-sm text-gray-600">
        This node provides information for Gemini Nodes. It does not have
        configurable properties.
      </p>
    </div>
  );
};

export default GeminiInfoNodeProperties;
