"use client";
import { useState } from "react";
import Link from "next/link";
import UploadBtn from "../Buttons/UploadBtn";
import AudioWaveform from "../AudioWaveform";
import { FileContextProvider } from "../../context/audioContext";
const Editor = () => {
  const [Upload, setUpload] = useState<boolean>(false);
  return (
    <div className="relative px-40 w-full flex flex-col justify-center items-center min-h-screen max-h-max">
      <FileContextProvider>
        {!Upload && (
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
            <UploadBtn setUpload={setUpload} />
          </div>
        )}

        {Upload && <AudioWaveform />}
      </FileContextProvider>
    </div>
  );
};

export default Editor;
