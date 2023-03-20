import { createContext, useState } from "react";
import _ from "lodash-es";

export interface IVideoOptions {
  isSourceLoaded: boolean;
  isLive: boolean;
  videoId?: string | number;
  src?: string;
  volume: number;
  isScrubbing: boolean;
  isTheater: boolean;
  isMuted: boolean;
  isPlay: boolean;
  isPlaying: boolean;
  isMini: boolean;
  isFull: boolean;
  setTime: undefined | number;
  currentTime: number;
  duration: number;
  startTime?: number;
}

interface VideoOptionsContextProps {
  videoOptions: IVideoOptions;
  setVideoOptions: React.Dispatch<React.SetStateAction<IVideoOptions>>;
}

interface VideoOptionsProviderProps {
  children?: React.ReactNode;
  isLive?: boolean;
}

export const VideoOptionsContext = createContext(
  {} as VideoOptionsContextProps
);

export const VideoOptionsProvider: React.FC<VideoOptionsProviderProps> = ({
  children,
  isLive,
}) => {
  const [videoOptions, setVideoOptions] = useState<IVideoOptions>({
    isSourceLoaded: false,
    isLive: isLive ? true : false,
    videoId: "",
    src: "",
    volume: 0.5,
    isScrubbing: false,
    isTheater: false,
    isMuted: true,
    isPlay: false,
    isPlaying: false,
    isMini: false,
    isFull: false,
    setTime: undefined,
    currentTime: 0,
    duration: 0,
  });

  const value = {
    videoOptions,
    setVideoOptions,
  };

  return (
    <VideoOptionsContext.Provider value={value}>
      {children}
    </VideoOptionsContext.Provider>
  );
};
