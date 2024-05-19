import React from "react";
import Link from "next/link";
const Editor = () => {
  return (
    <div className="page w-full max-w-xl mx-auto min-h-screen max-h-max flex flex-col justify-center items-center gap-10">
      <div className="top-menu uppercase">
        <div className="flex flex-row justify-between items-center gap-5 list-none font-bold">
          <li>
            <Link href={"/joiner"}>
              <p className="">How it works</p>
            </Link>
          </li>
          <li>
            <Link href={"/joiner"}>
              <p className="">Joiner</p>
            </Link>
          </li>
        </div>
      </div>
      <h1 className="text-5xl font-bold text-gray-200">Audio Cutter</h1>
      <h3 className="text-2xl font-medium text-gray-200">
        Free editor to trim and cut any audio file online
      </h3>
      <input
        id="audioupload"
        className="hidden"
        type="file"
        accept=".wav,.mp3,.aac,.ogg,.wma,.flac,.alac,.aiff,audio/*"
      />
      <label
        htmlFor="audioupload"
        className="upload px-6 py-2 border-2 border-indigo-400 rounded-full hover:bg-indigo-600/20 cursor-pointer"
      >
        Browse my files
      </label>

    </div>
  );
};

export default Editor;
