// @ts-nocheck
"use client"
import React, { useRef, useState, useEffect, ChangeEvent } from "react";
import ReactAudioPlayer from "react-audio-player";
import WaveSurfer from "wavesurfer.js";
const AudioHandler: React.FC = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer | null>(null);
  const waveformRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (waveformRef.current && !waveSurfer) {
      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "violet",
        progressColor: "purple",
        backend: "MediaElement",
      });
      setWaveSurfer(ws);
    }
  }, [waveformRef, waveSurfer]);

  useEffect(() => {
    if (waveSurfer && audioUrl) {
      waveSurfer.load(audioUrl);
    }
  }, [waveSurfer, audioUrl]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioFile(file);
      setAudioUrl(url);
    }
  };

  const handleCutAudio = () => {
    if (waveSurfer) {
      const start = waveSurfer.getCurrentTime();
      const end = waveSurfer.getDuration();
      waveSurfer.backend.media.currentTime = start;
      waveSurfer.backend.media.play();
      setTimeout(() => {
        waveSurfer.backend.media.pause();
        const audioContext = waveSurfer.backend.ac;
        const source = audioContext.createBufferSource();
        source.buffer = waveSurfer.backend.buffer;
        const offlineContext = new OfflineAudioContext(
          source.buffer.numberOfChannels,
          (end - start) * source.buffer.sampleRate,
          source.buffer.sampleRate
        );
        const offlineSource = offlineContext.createBufferSource();
        offlineSource.buffer = source.buffer;
        offlineSource.connect(offlineContext.destination);
        offlineSource.start(0, start, end - start);
        offlineContext.startRendering().then((renderedBuffer) => {
          renderedBufferToBlob(renderedBuffer).then((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = "cut-audio.wav";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          });
        });
      }, (end - start) * 1000);
    }
  };

  const renderedBufferToBlob = (buffer: AudioBuffer): Promise<Blob> => {
    return new Promise((resolve) => {
      const worker = new Worker("path/to/your/worker.js");
      worker.onmessage = (e) => {
        resolve(new Blob([e.data], { type: "audio/wav" }));
      };
      worker.postMessage(buffer);
    });
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      {audioUrl && (
        <>
          <ReactAudioPlayer src={audioUrl} controls />
          <div ref={waveformRef} style={{ width: "100%", height: "200px" }} />
          <button onClick={handleCutAudio}>Cut and Save Audio</button>
        </>
      )}
    </div>
  );
};

export default AudioHandler;
