"use client";

import { DiagramOutput, ResultInput } from "@/lib/types/diagram";
import { useAuthStore } from "@/store/user";
import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Check, Loader, Save, XCircle } from "lucide-react";
import * as Switch from "@radix-ui/react-switch";
import { toast } from "sonner";
import ErrorMessage from "../ErrorMessage";

type Props = { diagram: DiagramOutput; back: () => void };

const DiagramEdit = ({ diagram, back }: Props) => {
  const { user } = useAuthStore();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState<string>(diagram.title);
  const [description, setDescription] = useState<string>(diagram.description);
  const [publicDiagram, setPublicDiagram] = useState<boolean>(diagram.public);
  const [results, setResults] = useState<ResultInput[]>(diagram.result || []);
  const [newLabel, setNewLabel] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");
  const [newReference, setNewReference] = useState<string>("");

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const payload = {
      title,
      description,
      public: publicDiagram,
      result: results,
    };

    try {
      const res = await fetch(`/api/diagrams/${diagram?._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Error al guardar");
      }

      toast.success(`Diagram "${title}" saved!`);
    } catch (err: unknown) {
      setError((err as Error).message || String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = () => {
    console.log("handle remove");
  };

  const setResult = (
    label: string,
    newLabel: string,
    value: string,
    reference: string
  ) => {
    const res = results.map((r) => {
      if (r.label === label) {
        r.label = newLabel;
        r.value = value;
        r.reference = reference;
      }
      return r;
    });

    setResults(res);
  };

  const removeResult = (label: string) => {
    const res = results.filter((r) => r.label !== label);
    setResults(res);
  };

  const addResult = () => {
    if (!newLabel || !newValue) return;
    setResults([
      ...results,
      { label: newLabel, value: newValue, reference: newReference || "" },
    ]);
    setNewLabel("");
    setNewValue("");
    setNewReference("");
  };

  if (diagram.author.email !== user?.email) {
    return (
      <div className="flex flex-col justify-between items-start align-middle gap-2 text-gray-200 mb-2 border rounded py-2 px-4">
        <div className="w-full flex flex-row justify-start items-center align-middle gap-4">
          <Button
            variant={"outline"}
            onClick={back}
            className="w-6 h-6 self-center text-gray-200 hover:text-green-200 hover:cursor-pointer transition-colors duration-300 ease-in-out"
          >
            <ArrowLeft size={14} />
          </Button>
          <h2 className="text-gray-200 truncate">{diagram.title}</h2>
        </div>
        <hr />
        <p className=" text-gray-400 text-sm">
          Description: {diagram.description}
        </p>
        <p className=" text-gray-400 text-sm">
          Result:
          {diagram.result.map(
            (r) => `${r.label}: ${r.value} ref: (${r.reference})`
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between items-start align-middle gap-2 text-gray-200 mb-2 border rounded py-2 px-4">
      {error && <ErrorMessage error={error} onClose={() => setError("")} />}
      <div className="w-full flex flex-row justify-start items-center align-middle gap-4">
        <Button
          variant={"outline"}
          onClick={back}
          className="w-6 h-6 self-center text-gray-200 hover:text-green-200 hover:cursor-pointer transition-colors duration-300 ease-in-out"
        >
          <ArrowLeft size={14} />
        </Button>
        <h2 className="text-gray-200 truncate">{diagram.title}</h2>
      </div>
      <hr />
      <label htmlFor={`${diagram._id}-title`} className="hover:cursor-pointer">
        <p className="block text-gray-400 text-sm m-2">Title:</p>
        <input
          id={`${diagram._id}-title`}
          name="title"
          type="text"
          placeholder="title..."
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-sm text-gray-200 focus:ring-gray-500 border-gray-300 rounded p-2 w-full"
        />
      </label>
      <label
        htmlFor={`${diagram._id}-description`}
        className="hover:cursor-pointer"
      >
        <p className="block text-gray-400 text-sm m-2">Description:</p>
        <input
          id={`${diagram._id}-description`}
          name="description"
          type="text"
          placeholder="description..."
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="text-sm text-gray-200 focus:ring-gray-500 border-gray-300 rounded p-2 w-full"
        />
      </label>
      <div className="mt-2 w-full flex flex-row justify-start align-middle items-start gap-4">
        <label
          className=" text-gray-200"
          htmlFor={`${diagram._id}-public-diagram`}
        >
          {publicDiagram ? "Public" : "Private"}
        </label>
        <Switch.Root
          className="relative h-[25px] w-[42px] cursor-default rounded-full bg-gray-600 shadow-[0_2px_10px] shadow-gray-300 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black"
          id={`${diagram._id}-public-diagram`}
          onCheckedChange={(value) => setPublicDiagram(value)}
          checked={publicDiagram}
        >
          <Switch.Thumb className="block size-[21px] translate-x-0.5 rounded-full bg-gray-200 data-[state=checked]:bg-green-600 shadow-[0_2px_2px] shadow-gray-600 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
        </Switch.Root>
      </div>

      <h2 className="text-gray-400">Results</h2>
      {results.map((r) => (
        <div
          key={r.label}
          className="flex flex-row justify-center align-middle items-center mt-2"
        >
          <input
            id={r.label}
            name={r.label}
            type="text"
            placeholder="label..."
            required
            value={r.label}
            onChange={(e) =>
              setResult(r.label, e.target.value, r.value, r.reference || "")
            }
            className="text-sm text-gray-200 focus:ring-gray-500 border-gray-300 rounded p-2 max-w-12"
          />
          <input
            id={r.value}
            name={r.value}
            type="text"
            placeholder="value..."
            required
            value={r.value}
            onChange={(e) =>
              setResult(r.label, r.label, e.target.value, r.reference || "")
            }
            className="text-sm text-gray-200 focus:ring-gray-500 border-gray-300 rounded p-2 w-full"
          />
          <input
            id={r.reference}
            name={r.reference}
            type="text"
            placeholder="reference..."
            required
            value={r.reference}
            onChange={(e) =>
              setResult(r.label, r.label, r.value, e.target.value)
            }
            className="text-sm text-gray-200 focus:ring-gray-500 border-gray-300 rounded p-2 w-full"
          />
          <Button
            variant={"outline"}
            onClick={() => removeResult(r.label)}
            className="hover:cursor-pointer ml-2 text-red-400 hover:text-red-200 transition-colors duration-300 ease-in-out"
          >
            <XCircle size={14} />
          </Button>
        </div>
      ))}
      <div className="flex flex-row justify-center align-middle items-center mt-2">
        <input
          id={"newLabel"}
          name={"newLabel"}
          type="text"
          placeholder="label..."
          required
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          className="text-sm text-gray-200 focus:ring-gray-500 border-gray-300 rounded p-2 max-w-24"
          autoFocus
        />
        <input
          id={"newValue"}
          name={"newValue"}
          type="text"
          placeholder="value..."
          required
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="text-sm text-gray-200 focus:ring-gray-500 border-gray-300 rounded p-2 w-full"
        />
        <input
          id={"newReference"}
          name={"newReference"}
          type="text"
          placeholder="reference..."
          required
          value={newReference}
          onChange={(e) => setNewReference(e.target.value)}
          className="text-sm text-gray-200 focus:ring-gray-500 border-gray-300 rounded p-2 w-full"
        />
        <Button
          variant={"outline"}
          onClick={addResult}
          className="hover:cursor-pointer ml-2 text-green-400 hover:text-green-200 transition-colors duration-300 ease-in-out"
        >
          <Check size={14} />
        </Button>
      </div>

      <div className="mt-2 w-full flex flex-row justify-around items-center align-middle">
        <Button
          variant={"outline"}
          disabled={saving}
          onClick={handleSave}
          className=" text-gray-200 hover:text-green-200 hover:cursor-pointer transition-colors duration-300 ease-in-out"
        >
          {saving ? (
            <Loader className="animate-spin" size={14} />
          ) : (
            <Save size={14} />
          )}
        </Button>
        <Button
          variant={"outline"}
          onClick={handleRemove}
          className="hover:cursor-pointer text-red-400 hover:text-red-200 transition-colors duration-300 ease-in-out"
        >
          <XCircle size={14} />
        </Button>
      </div>
    </div>
  );
};

export default DiagramEdit;
