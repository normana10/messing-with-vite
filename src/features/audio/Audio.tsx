import { FastForward, FastRewind, VolumeDown, VolumeOff, VolumeUp } from "@mui/icons-material";
import Forward10Icon from "@mui/icons-material/Forward10";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Replay10Icon from "@mui/icons-material/Replay10";
import useHelp from "../tips/useHelp";
import useAudio from "./useAudio";

const secondsToHourMinSec = (originalSeconds?: number) => {
  if (originalSeconds === undefined) {
    return "0";
  }
  const hours = Math.floor(originalSeconds / 3600);
  const minutes = Math.floor((originalSeconds - hours * 3600) / 60);
  const seconds = Math.floor(originalSeconds - hours * 3600 - minutes * 60);

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  if (minutes > 0) {
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${seconds}`.padStart(2, "0");
};

const horizontalGap = "10px";
const vericalGap = "2px";

const pointerStyle = { cursor: "pointer" };

const Audio = () => {
  const {
    audioRef,
    currentTime,
    setCurrentTime,
    play,
    pause,
    isPlaying,
    playbackRate,
    volume,
    setVolume,
    toggleMute,
    increaseVolume,
    decreaseVolume,
    increasePlaybackRate,
    decreasePlaybackRate,
    minVolume,
    maxVolume,
    volumeIncrement,
  } = useAudio();

  useHelp("#SPEED_CONTROLS", "These are the speed controls");
  useHelp("#PLAY_PAUSE_SKIP", "This is play/pause/skip");
  useHelp("#VOLUME_CONTROLS", "Here be the volume controls");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: vericalGap,
      }}
    >
      {/* Play/Pause/Skip */}
      <div id="PLAY_PAUSE_SKIP" style={{ display: "flex", gap: horizontalGap }}>
        <Replay10Icon style={pointerStyle} onClick={() => setCurrentTime(currentTime - 10)} />
        <div onClick={() => (isPlaying ? pause() : play())}>
          {isPlaying ? <PauseIcon style={pointerStyle} /> : <PlayArrowIcon style={pointerStyle} />}
        </div>
        <Forward10Icon style={pointerStyle} onClick={() => setCurrentTime(currentTime + 10)} />
      </div>
      {/* Speed Controls */}
      <div id="SPEED_CONTROLS" style={{ display: "flex", gap: horizontalGap, alignItems: "center" }}>
        <FastRewind style={pointerStyle} onClick={decreasePlaybackRate} />
        <p style={{ width: "60px" }}>{playbackRate}x</p>
        <FastForward style={pointerStyle} onClick={increasePlaybackRate} />
      </div>
      {/* Volume Control */}
      <div id="VOLUME_CONTROLS" style={{ display: "flex", alignItems: "center", gap: horizontalGap }}>
        <VolumeOff onClick={() => toggleMute()} style={pointerStyle} />
        <VolumeDown onClick={() => decreaseVolume()} style={pointerStyle} />
        <VolumeUp onClick={() => increaseVolume()} style={pointerStyle} />
        <input
          type="range"
          min={minVolume}
          max={maxVolume}
          step={volumeIncrement}
          value={volume}
          onChange={(event) => setVolume(parseFloat(event.target.value))}
        />
        <p style={{ width: "60px" }}>{Math.round(volume * 100)}%</p>
      </div>
      <input
        type="range"
        min={0}
        max={audioRef.current?.duration}
        value={currentTime}
        onChange={(event) => {
          setCurrentTime(parseInt(event.target.value));
        }}
        step={0.00001}
        style={{ width: "300px" }}
      />
      <p>
        {secondsToHourMinSec(currentTime)}/{secondsToHourMinSec(audioRef.current?.duration)}
      </p>
      <audio ref={audioRef} src="https://upload.wikimedia.org/wikipedia/commons/7/7b/FurElise.ogg" />
    </div>
  );
};

export default Audio;
