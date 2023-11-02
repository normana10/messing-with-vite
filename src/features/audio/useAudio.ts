import { useCallback, useEffect, useRef, useState } from "react";

const INTERVAL_TIME = 1000;

const DEFAULT_VOLUME = 1;

const MIN_VOL_CREMENT = 0.01;
const DEFAULT_VOL_CREMENT = 0.1;
const DEFAULT_PLAYBACK_CREMENT = 0.25;

const MAX_VOLUME = 1;
const MIN_VOLUME = 0;

const MIN_PLAYBACK_RATE = DEFAULT_PLAYBACK_CREMENT;
const MAX_PLAYBACK_RATE = 5;

const safeAudioRef = (audioRef: React.RefObject<HTMLAudioElement>, consumer: (audio: HTMLAudioElement) => void) => {
  if (audioRef.current) {
    consumer(audioRef.current);
  }
};

enum CrementType {
  INCREASE,
  DECREASE,
}

const computeRangedValue = (current: number, amount: number, type: CrementType, min: number, max: number) => {
  switch (type) {
    case CrementType.INCREASE:
      return current + amount > max ? max : current + amount;
    case CrementType.DECREASE:
      return current - amount < min ? max : current - amount;
    default:
      return undefined as never;
  }
};

const useAudio = (params?: { volumeIncrement: number; playbackRateIncrement: number; autoPlay: boolean }) => {
  const {
    volumeIncrement = DEFAULT_VOL_CREMENT,
    autoPlay = false,
    playbackRateIncrement = DEFAULT_PLAYBACK_CREMENT,
  } = params ?? {};
  const audioRef = useRef<HTMLAudioElement>(null);

  const [playing, setPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const play = useCallback(() => {
    setPlaying(true);
    audioRef.current?.play();
  }, []);
  const pause = useCallback(() => {
    setPlaying(false);
    audioRef.current?.pause();
  }, []);
  const toggleMute = useCallback(() => setMuted(!muted), [muted]);
  const wrappedSetVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
    safeAudioRef(audioRef, (current) => (current.volume = newVolume));
  }, []);
  const increaseVolume = useCallback(() => {
    const newVolume = computeRangedValue(volume, volumeIncrement, CrementType.INCREASE, MIN_VOLUME, MAX_VOLUME);
    setVolume(newVolume);
    safeAudioRef(audioRef, (current) => (current.volume = newVolume));
  }, [volume, volumeIncrement]);
  const decreaseVolume = useCallback(() => {
    const newVolume = computeRangedValue(volume, volumeIncrement, CrementType.DECREASE, MIN_VOLUME, MAX_VOLUME);
    setVolume(newVolume);
    safeAudioRef(audioRef, (current) => (current.volume = newVolume));
  }, [volume, volumeIncrement]);
  const increasePlaybackRate = useCallback(() => {
    const newPlaybackRate = computeRangedValue(
      playbackRate,
      playbackRateIncrement,
      CrementType.INCREASE,
      MIN_PLAYBACK_RATE,
      MAX_PLAYBACK_RATE
    );
    setPlaybackRate(newPlaybackRate);
    safeAudioRef(audioRef, (current) => (current.playbackRate = newPlaybackRate));
  }, [playbackRate, playbackRateIncrement]);
  const decreasePlaybackRate = useCallback(() => {
    const newPlaybackRate = computeRangedValue(
      playbackRate,
      playbackRateIncrement,
      CrementType.DECREASE,
      MIN_PLAYBACK_RATE,
      MAX_PLAYBACK_RATE
    );
    setPlaybackRate(newPlaybackRate);
    safeAudioRef(audioRef, (current) => (current.playbackRate = newPlaybackRate));
  }, [playbackRate, playbackRateIncrement]);
  const wrappedSetCurrentTime = useCallback((newCurrentTime: number) => {
    setCurrentTime(newCurrentTime);
    safeAudioRef(audioRef, (current) => (current.currentTime = newCurrentTime));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current) {
        console.log(audioRef.current.currentTime);
        if (audioRef.current.currentTime !== currentTime) {
          setCurrentTime(audioRef.current.currentTime);
        }
      }
    }, INTERVAL_TIME);
    return () => clearInterval(interval);
  }, [currentTime]);

  return {
    currentTime,
    setCurrentTime: wrappedSetCurrentTime,
    audioRef,
    play,
    pause,
    isPlaying: playing,
    playbackRate,
    increasePlaybackRate,
    decreasePlaybackRate,
    volume,
    setVolume: wrappedSetVolume,
    toggleMute,
    increaseVolume,
    decreaseVolume,
    minVolume: MIN_VOLUME,
    maxVolume: MAX_VOLUME,
    volumeIncrement: MIN_VOL_CREMENT,
  };
};

export default useAudio;
