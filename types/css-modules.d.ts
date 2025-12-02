declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

// Específicamente para xyflow
declare module "@xyflow/react/dist/style.css";
declare module "@xyflow/react/dist/base.css";
