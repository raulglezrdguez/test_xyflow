import { MyEdge } from "@/types/flow";

type Props = { edge: MyEdge | null };

const EdgeProperties = ({ edge }: Props) => {
  if (edge === null) return null;

  return <div className="text-sm">Edge Properties</div>;
};

export default EdgeProperties;
