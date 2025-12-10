import { MyNode } from "@/types/flow";
import InputNodeProperties from "./InputNodeProperties";
import QuestionNodeProperties from "./QuestionNodeProperties";

type Props = { node: MyNode | null };

const NodeProperties = ({ node }: Props) => {
  if (node === null) return null;

  if (node.type === "input")
    return <InputNodeProperties id={node.id} data={node.data} />;
  if (node.type === "question")
    return <QuestionNodeProperties id={node.id} data={node.data} />;

  return <div className="text-sm">Node Properties</div>;
};

export default NodeProperties;
