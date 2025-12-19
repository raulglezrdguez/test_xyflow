import Editor from "@/components/Editor";
import { headers } from "next/headers";

const headersList = await headers();
const protocol = headersList.get("x-forwarded-proto") || "http";
const host = headersList.get("host");
const url = `${protocol}://${host}/api/diagrams`;

const response = await fetch(url, {
  method: "GET",
});

const diagrams = await response.json();

console.log(diagrams);

export default function Home() {
  return (
    <div className="min-h-screen font-sans bg-black">
      <Editor />
    </div>
  );
}
