"use client";

import { GEMINI_MODELS, GeminiModel, GeminiNodeData } from "@/types/flow";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Save } from "lucide-react";
import { useFlowStore } from "@/store/flowStore";

type Props = { data: GeminiNodeData | null; id: string };

const GeminiNodeProperties = ({ data, id }: Props) => {
  const updateNodeData = useFlowStore((state) => state.updateNodeData);

  const [prompt, setPrompt] = useState<string>(data?.prompt || "");
  const [model, setModel] = useState<string>(data?.model || GEMINI_MODELS[0]);
  const [temperature, setTemperature] = useState<number>(
    data?.temperature || 1.0
  );

  useEffect(() => {
    const update = () => {
      setPrompt(data?.prompt || "");
      setModel(data?.model || GEMINI_MODELS[0]);
      setTemperature(data?.temperature || 1.0);
    };
    if (data) update();
  }, [data]);

  if (!data) return null;

  const handleSave = () => {
    updateNodeData(id, { prompt, model, temperature });
  };

  return (
    <div className="flex flex-col border rounded-2xl px-4 py-2">
      <h2 className="text-gray-700">Gemini Node {id}</h2>
      <hr />
      <label htmlFor="prompt" className="hover:cursor-pointer">
        <p className="block text-sm m-2">Prompt:</p>
        <input
          id="prompt"
          name="prompt"
          type="text"
          placeholder="prompt..."
          required
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="text-sm text-gray-600 focus:ring-gray-500 border-gray-300 rounded p-2 w-full"
        />
      </label>

      <label htmlFor="model" className="mt-2 hover:cursor-pointer">
        <p className="block text-sm m-2">Model:</p>
        <select
          id={"model"}
          name={"model"}
          value={model || GEMINI_MODELS[0]}
          onChange={(e) => setModel(e.target.value as GeminiModel)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {GEMINI_MODELS.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="temperature" className="mt-2 hover:cursor-pointer">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Temperature</span>
          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded-full text-center">
            {temperature.toFixed(2)}
          </span>
        </div>
        <input
          id="temperature"
          name="temperature"
          type="range"
          placeholder="temperature..."
          required
          value={temperature}
          min={0.0}
          max={2.0}
          step={0.01}
          onChange={(e) => {
            setTemperature(parseFloat(e.target.value));
          }}
          className="text-sm text-gray-600 focus:ring-gray-500 border-gray-300 rounded p-2 w-full"
        />
      </label>

      <Button
        variant={"outline"}
        onClick={handleSave}
        className="hover:cursor-pointer mt-2"
      >
        <Save size={14} />
      </Button>
    </div>
  );
};

export default GeminiNodeProperties;
