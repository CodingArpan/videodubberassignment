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
// import ToggleButton from './ToggleButton';

const AudioWaveform = () => {
  const wavesurferRef = useRef(null);
  const timelineRef = useRef(null);

  // fetch file url from the context
  const { fileURL, setFileURL } = useContext(FileContext);

  // crate an instance of the wavesurfer
  const [wavesurferObj, setWavesurferObj] = useState();
  const [RegionStart, setRegionStart] = useState(0);
  const [RegionEnd, setRegionEnd] = useState(50);

  const [playing, setPlaying] = useState(true); // to keep track whether audio is currently playing or not
  const [volume, setVolume] = useState(1); // to control volume level of the audio. 0-mute, 1-max
  const [zoom, setZoom] = useState(1); // to control the zoom level of the waveform
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
  }, [ wavesurferObj]);

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
        // const regions = region.wavesurfer.regions.list;
        // const keys = Object.keys(regions);
        // if (keys.length > 1) {
        //   regions[keys[0]].remove();
        // }
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

//   const handleZoomSlider = (e) => {
//     setZoom(e.target.value);
//   };

//   const handleTrim = (e) => {
//     if (wavesurferObj) {
//       // get start and end points of the selected region

//       console.log(wavesurferObj);

//       const start = RegionStart;
//       const end = RegionEnd;

//       // obtain the original array of the audio
//       const original_buffer = wavesurferObj.renderer.audioData;

//       // create a temporary new buffer array with the same length, sample rate and no of channels as the original audio
//     //   const new_buffer = wavesurferObj.backend.ac.createBuffer(
//     //     original_buffer.numberOfChannels,
//     //     original_buffer.length,
//     //     original_buffer.sampleRate
//     //   );
// 	const audioCtx = new AudioContext();
//   const new_buffer = audioCtx.createBuffer(
// 	original_buffer.numberOfChannels,
//         original_buffer.length,
//         original_buffer.sampleRate
// );

      

//       // create 2 indices:
//       // left & right to the part to be trimmed
//       const first_list_index = start * original_buffer.sampleRate;
//       const second_list_index = end * original_buffer.sampleRate;
//       const second_list_mem_alloc =
//         original_buffer.length - end * original_buffer.sampleRate;

//       // create a new array upto the region to be trimmed
//       const new_list = new Float32Array(parseInt(first_list_index));

//       // create a new array of region after the trimmed region
//       const second_list = new Float32Array(parseInt(second_list_mem_alloc));

//       // create an array to combine the 2 parts
//       const combined = new Float32Array(original_buffer.length);

//       // 2 channels: 1-right, 0-left
//       // copy the buffer values for the 2 regions from the original buffer

//       // for the region to the left of the trimmed section
//       original_buffer.copyFromChannel(new_list, 1);
//       original_buffer.copyFromChannel(new_list, 0);

//       // for the region to the right of the trimmed section
//       original_buffer.copyFromChannel(second_list, 1, second_list_index);
//       original_buffer.copyFromChannel(second_list, 0, second_list_index);

//       // create the combined buffer for the trimmed audio
//       combined.set(new_list);
//       combined.set(second_list, first_list_index);

//       // copy the combined array to the new_buffer
//       new_buffer.copyToChannel(combined, 1);
//       new_buffer.copyToChannel(combined, 0);

//       // load the new_buffer, to restart the wavesurfer's waveform display
//       wavesurferObj.loadDecodedBuffer(new_buffer);
//     }
//   };

  return (
    <section className="waveform-container w-full">
      <div className="" ref={wavesurferRef} id="waveform" />
      <div className="" ref={timelineRef} id="wave-timeline" />

      <div className="controls flex flex-row justify-center items-center gap-5 py-20">
        <div
          title="play/pause"
          className="controls"
          onClick={handlePlayPause}
          className="px-16 py-4 pt- bg-slate-800 rounded-full cursor-pointer"
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

        <div
          className="trim px-5 py-4 pt- bg-slate-800 rounded-lg cursor-pointer"
          
        >
          <div className="flex justify-center items-center gap-2">
            <FaCut className="text-xl" />
            <p className="text-xl">Trim</p>
          </div>
        </div>
      </div>

      <div className="all-controls">
        {/* <div className="left-container"> */}
        {/* <ToggleButton /> */}

        {/* </div> */}
        {/* <div className="right-container"> */}
        {/* <div className="volume-slide-container">
            <p className="material-icons zoom-icon">remove_circle</p>
            <input
              type="range"
              min="1"
              max="1000"
              value={zoom}
              onChange={handleZoomSlider}
              className="slider zoom-slider"
            />
            <p className="material-icons zoom-icon">add_circle</p>
          </div> */}
        {/* <div className="volume-slide-container"> */}
      </div>
      {/* </div> */}
      {/* </div> */}
    </section>
  );
};

export default AudioWaveform;
