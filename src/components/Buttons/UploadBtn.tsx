// @ts-nocheck
"use client"
import React, { useState, useEffect, useRef, useContext } from "react";
import { FileContext } from "../../context/audioContext";

const UploadBtn = ({ setUpload }) => {
  const inputFile = useRef(null);
  const { fileURL, setFileURL } = useContext(FileContext);
  const [file, setFile] = useState("");

  useEffect(() => {
    if (file) {
      setFileURL(file);
      setUpload(true);
    }else{
        setUpload(false);
    }
  }, [file, setFileURL]);

  const handleButtonClick = () => {
    inputFile.current.click();
  };

  const handleFileUpload = (e) => {
    // console.log(file);
    setFile(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <>
      <input
        type="file"
        id="audioupload"
        ref={inputFile}
        style={{ display: "none" }}
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      <label
        htmlFor="audioupload"
        className="upload px-6 py-2 border-2 border-indigo-400 rounded-full hover:bg-indigo-600/20 cursor-pointer"
      >
        Browse my files
      </label>
    </>
  );
};

export default UploadBtn;
