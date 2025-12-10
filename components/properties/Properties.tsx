"use client";

import { useEffect, useState } from "react";
import { useFlowStore } from "@/store/flowStore";
import NodeProperties from "./NodeProperties";
import EdgeProperties from "./EdgeProperties";

const Properties = () => {
  const nodeSelected = useFlowStore((state) => state.nodeSelected);
  const edgeSelected = useFlowStore((state) => state.edgeSelected);

  const [execHeight, setExecHeight] = useState(0);

  useEffect(() => {
    const measure = () => {
      const el = document.getElementById("execution-panel");
      setExecHeight(el ? el.getBoundingClientRect().height : 0);
    };

    measure();
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    const el = document.getElementById("execution-panel");
    if (el) ro.observe(el);

    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  if (!nodeSelected && !edgeSelected) return null;

  const style = { height: `calc(100vh - ${execHeight}px)` } as const;

  return (
    <div
      className="min-w-24 mx-4 my-2 flex flex-col gap-4 overflow-y-auto pb-4"
      style={style}
    >
      {nodeSelected && <NodeProperties node={nodeSelected} />}
      {edgeSelected && <EdgeProperties edge={edgeSelected} />}
    </div>
  );
};

export default Properties;
