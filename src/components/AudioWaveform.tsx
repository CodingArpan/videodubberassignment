// @ts-nocheck
"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import { FileContext } from "../context/audioContext";
import wavesurfer from "wavesurfer.js";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { MdOutlineReplay } from "react-icons/md";
import { FaCut } from "react-icons/fa";

const AudioWaveform = () => {
  const wavesurferRef = useRef(null);
  const timelineRef = useRef(null);

  // fetch file url from the context
  const { fileURL } = useContext(FileContext);

  // crate an instance of the wavesurfer
  const [wavesurferObj, setWavesurferObj] = useState();

  const [playing, setPlaying] = useState(true); // to keep track whether audio is currently playing or not
  const [volume, setVolume] = useState(1); // to control volume level of the audio. 0-mute, 1-max
  const [Duration, setDuration] = useState(0); // duration is used to set the default region of selection for trimming the audio

  // create the waveform inside the correct component
  useEffect(() => {
    if (wavesurferRef.current && !wavesurferObj) {
      setWavesurferObj(
        wavesurfer.create({
          container: "#waveform",
          scrollParent: true,
          autoCenter: true,
          cursorColor: "green",
          loopSelection: true,
          waveColor: "#186D2A",
          progressColor: "#26E04E",
          responsive: true,
          plugins: [
            TimelinePlugin.create({
              container: "#wave-timeline",
            }),
            RegionsPlugin.create({}),
          ],
        })
      );
    }
  }, [wavesurferObj]);

  // once the file URL is ready, load the file to produce the waveform
  useEffect(() => {
    if (fileURL && wavesurferObj) {
      wavesurferObj.load(fileURL);
    }
  }, [fileURL, wavesurferObj]);

  useEffect(() => {
    if (wavesurferObj) {
      console.log(wavesurferObj);
      setDuration(Math.floor(wavesurferObj.getDuration())); // set the duration in local state
      let wsRegions = wavesurferObj.registerPlugin(RegionsPlugin.create());

      //   wsRegions.enableDragSelection({ color: "rgb(98, 255, 58,0.1)" });
      // once the waveform is ready, play the audio
      wavesurferObj.on("ready", () => {
        wavesurferObj.play();
        wsRegions.addRegion({
          start: Math.floor(Duration / 2) - Math.floor(Duration) / 5 || 0, // time in seconds
          end: Math.floor(Duration / 2) || 50, // time in seconds
          content: "Resize me",
          color: "rgb(98, 255, 58,0.1)",
          drag: true,
          resize: true,
        });

        // to select the region to be trimmed
      });

      // once audio starts playing, set the state variable to true
      wavesurferObj.on("play", () => {
        setPlaying(true);
      });

      // once audio starts playing, set the state variable to false
      wavesurferObj.on("finish", () => {
        setPlaying(false);
      });

      // if multiple regions are created, then remove all the previous regions so that only 1 is present at any given time
      wsRegions.on("region-updated", (region) => {
        console.log(region);
        setRegionStart(region.start);
        setRegionEnd(region.end);
        
      });
    }
  }, [Duration, wavesurferObj]);

  // set volume of the wavesurfer object, whenever volume variable in state is changed
  useEffect(() => {
    if (wavesurferObj) wavesurferObj.setVolume(volume);
  }, [volume, wavesurferObj]);

  const handlePlayPause = (e) => {
    wavesurferObj.playPause();
    setPlaying(!playing);
  };

  const handleReload = (e) => {
    // stop will return the audio to 0s, then play it again
    wavesurferObj.stop();
    wavesurferObj.play();
    setPlaying(true); // to toggle the play/pause button icon
  };

  const handleVolumeSlider = (e) => {
    setVolume(e.target.value);
  };

  return (
    <section className="waveform-container w-full">
      <div className="" ref={wavesurferRef} id="waveform" />
      <div className="" ref={timelineRef} id="wave-timeline" />

      {/* <div className="controls flex flex-row justify-center items-center gap-5 py-20">
        <div
          title="play/pause"
          className="controls"
          onClick={handlePlayPause}
          className="px-16 py-4 bg-slate-800 rounded-full cursor-pointer"
        >
          <div>
            {!playing ? (
              <FaPlay className="text-center text-gray-300 text-xl" />
            ) : (
              <FaPause className="text-center text-gray-300 text-xl" />
            )}
          </div>
        </div>

        <div
          title="reload"
          className="controls"
          onClick={handleReload}
          className="px-5 py-4  rounded-full cursor-pointer"
        >
          <div>
            <MdOutlineReplay className="text-2xl" />
          </div>
        </div>

        <div className="">
          {volume > 0 ? (
            <p className="material-icons">Volume</p>
          ) : (
            <p className="material-icons">Mute</p>
          )}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeSlider}
            className="slider volume-slider"
          />
        </div>

        <div className="trim px-5 py-4 pt- bg-slate-800 rounded-lg cursor-pointer">
          <div className="flex justify-center items-center gap-2">
            <FaCut className="text-xl" />
            <p className="text-xl">Trim</p>
          </div>
        </div>
      </div> */}
    </section>
  );
};

export default AudioWaveform;
