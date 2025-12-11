import { MyEdge } from "@/types/flow";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useFlowStore } from "@/store/flowStore";
import { Save } from "lucide-react";
import { isValidJavaScriptExpression } from "@/lib/utils";

type Props = { edge: MyEdge | null };

const EdgeProperties = ({ edge }: Props) => {
  const updateEdgeData = useFlowStore((state) => state.updateEdgeData);

  const [condition, setCondition] = useState<string>(
    edge?.data?.condition || ""
  );

  useEffect(() => {
    const update = () => {
      setCondition(edge?.data?.condition || "");
    };
    if (edge) update();
  }, [edge]);

  if (edge === null) return null;

  const handleClick = () => {
    const { result } = isValidJavaScriptExpression(condition);
    if (!result) {
      alert("Invalid condition expression!");
      return;
    }

    updateEdgeData(edge.id, { condition });
  };

  return (
    <div className="flex flex-col border rounded-2xl px-4 py-2">
      <h2 className="text-gray-700">Edge</h2>
      <hr />
      <label htmlFor="condition" className="hover:cursor-pointer">
        <p className="block text-sm m-2">Condition:</p>
        <input
          id="condition"
          name="condition"
          type="text"
          placeholder="condition..."
          required
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="text-sm text-gray-600 focus:ring-gray-500 border-gray-300 rounded p-2 w-full"
        />
      </label>
      <Button
        variant={"outline"}
        onClick={handleClick}
        className="hover:cursor-pointer mt-2"
      >
        <Save size={14} />
      </Button>
    </div>
  );
};

export default EdgeProperties;
