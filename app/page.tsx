import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Editor from "@/components/Editor";

export default function Home() {
  return (
    <div className="min-h-screen font-sans bg-black">
      <Editor />
    </div>
  );
}
