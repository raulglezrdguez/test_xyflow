"use client";

import { DiagramOutput } from "@/lib/types/diagram";
import { useAuthStore } from "@/store/user";
import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Save, XCircle } from "lucide-react";
import * as Switch from "@radix-ui/react-switch";

type Props = { diagram: DiagramOutput; back: () => void };

const DiagramEdit = ({ diagram, back }: Props) => {
  const { user } = useAuthStore();

  const [title, setTitle] = useState<string>(diagram.title);
  const [description, setDescription] = useState<string>(diagram.description);
  const [publicDiagram, setPublicDiagram] = useState<boolean>(diagram.public);

  const handleSave = () => {
    console.log("handle Save");
  };

  const handleRemove = () => {
    console.log("handle remove");
  };

  if (diagram.author.email !== user?.email) {
    return (
      <div className="flex flex-col justify-between items-start align-middle gap-2 text-gray-200 mb-2 border rounded py-2 px-4">
        <div className="w-full flex flex-row justify-around items-center align-middle">
          <Button
            variant={"outline"}
            onClick={back}
            className="w-12 self-center text-gray-200 hover:text-green-200 hover:cursor-pointer transition-colors duration-300 ease-in-out"
          >
            <ArrowLeft size={14} />
          </Button>
          <h2 className="text-gray-200 truncate">{diagram.title}</h2>
        </div>
        <hr />
        <p className=" text-gray-400 text-sm">
          Description: {diagram.description}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between items-center align-middle gap-2 text-gray-200 mb-2 border rounded py-2 px-4">
      <div className="w-full flex flex-row justify-around items-center align-middle">
        <Button
          variant={"outline"}
          onClick={back}
          className="w-12 self-center text-gray-200 hover:text-green-200 hover:cursor-pointer transition-colors duration-300 ease-in-out"
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
      <div className="mt-2 w-full flex flex-row justify-around align-middle items-start">
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

      <div className="mt-2 w-full flex flex-row justify-around items-center align-middle">
        <Button
          variant={"outline"}
          onClick={handleSave}
          className=" text-gray-200 hover:text-green-200 hover:cursor-pointer transition-colors duration-300 ease-in-out"
        >
          <Save size={14} />
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
