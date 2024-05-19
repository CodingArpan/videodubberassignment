import Editor from "@/components/Editor/Editor";
import IndexOptionbar from "@/components/Optionsbar/Index.Optionbar";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <IndexOptionbar />
      <Editor />
    </>
  );
}
