import Hls from "hls.js";
import _ from "lodash-es";
import { useState, useRef, useEffect, useCallback, useContext } from "react"

import { VideoOptionsContext } from "@/contexts/videoOptionsContext";

export interface IVideoControllers {
  handleTogglePlay: () => void;
  handleChangeVolume: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToggleMute: () => void;
  handleToggleTheaterMode: () => void;
  handleToggleMiniMode: () => void;
  handleToggleFullMode: () => void;
  handleUpdateVideoTimeByTimeline: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  handleMouseUp: () => void;
}

export interface IVideoPlayer {
  src?: string;
  isLive?: boolean;
  videoId?: string | number;
}

const useVideoPlayer = ({ isLive, videoId, src }: IVideoPlayer) => {
  const STREAM_SERVER_URL = import.meta.env.VITE_GET_STREAM_URL;
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const tmpTimeRef = useRef<number>(0);
  const [hls, setHls] = useState<Hls | null>(null);
  const { videoOptions, setVideoOptions } = useContext(VideoOptionsContext)

  const {
    isLoaded,
    isScrubbing,
    volume,
    isMuted,
    isPlay,
    isPlaying,
    currentTime,
    duration,
    setTime,
  } = videoOptions;

  const handleTogglePlay = () => {
    if (!isLoaded) return

    let videoTime: number | undefined;

    // When the video was stopped by user, save the current time.
    if (isLive) {
      if (isPlay && isPlaying) {
        tmpTimeRef.current = Date.now();
      } else {
        const time = Date.now();
        const tmpTime = parseFloat(tmpTimeRef.current.toFixed(6));
        videoTime = currentTime + (time - tmpTime) / 1000;
        tmpTimeRef.current = 0;
      }
    }

    setVideoOptions((prev) => ({
      ...prev,
      isPlay: !prev.isPlay,
      setTime: videoTime ? videoTime : undefined,
    }));
  };

  const handleChangeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isLoaded) return

    const { value } = e.target;

    setVideoOptions((prev) => ({
      ...prev,
      volume: Number(value),
      isMuted: false,
    }));
  };

  const handleToggleMute = () => {
    if (!isLoaded) return

    setVideoOptions((prev) => ({
      ...prev,
      isMuted: !prev.isMuted,
    }));
  };

  const handleToggleTheaterMode = () => {
    if (!isLoaded) return

    setVideoOptions((prev) => ({
      ...prev,
      isTheater: !prev.isTheater,
    }));
  };

  const handleToggleMiniMode = () => {
    if (!isLoaded) return

    const video = videoRef.current;

    if (!video) return;
    video.requestPictureInPicture();
  };

  const handleToggleFullMode = () => {
    if (!isLoaded) return

    setVideoOptions((prev) => ({
      ...prev,
      isFull: !prev.isFull,
    }));
  };

  const handleVideoTime = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (!isLoaded) return

    const timeline = timelineRef.current;

    if (!timeline || isScrubbing || !isPlay) return;

    const { currentTime } = e.target as HTMLVideoElement;
    const percent = isLive ? 1 : currentTime / duration;

    timeline.style.setProperty("--progress-position", `${percent}`);

    setVideoOptions((prev) => ({
      ...prev,
      currentTime,
    }));
  };

  const handleVideoLoaded = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (!isLoaded) return

    const { duration } = e.target as HTMLVideoElement;

    setVideoOptions((prev) => ({
      ...prev,
      duration,
    }));
  };

  const handleVideoEnded = () => {
    const video = videoRef.current

    if (!video) return;

    // 只設定 isPlay: false 會使 handleVideoTime() return，導致影片自動停止，故原本設定的停止方式會沒有生效
    setVideoOptions((prev) => ({
      ...prev,
      isPlay: false,
      isPlaying: false
    }));
  }

  // 調整 timeline
  const handleUpdateVideoTimeByTimeline = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!isLoaded) return

    const timeline = timelineRef.current;

    if (!timeline || isLive) return;

    const { clientX } = e;
    const { width, x } = timeline.getBoundingClientRect();

    // 不會少於 0，且不會大於 timeline 的寬
    const percent = Math.min(Math.max(0, clientX - x), width) / width;

    // percent * duration(video total time) = currentTime
    const setTime = duration * percent;
    timeline.style.setProperty("--progress-position", `${percent}`);

    setVideoOptions((prev) => ({
      ...prev,
      isScrubbing: true,
      isPlay: false,
      setTime,
      currentTime: setTime,
    }));
  };

  const handleMouseUp = () => {
    if (!isLoaded) return

    if (isLive) return;

    setVideoOptions((prev) => ({
      ...prev,
      isScrubbing: false,
      isPlay: prev.isPlaying ? true : false,
    }));
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isLoaded) return

    const timeline = timelineRef.current;

    if (!timeline || !isScrubbing || isLive) return;
    const { clientX } = e;
    const { width, x } = timeline.getBoundingClientRect();
    // 不會少於 0，且不會大於 timeline 的寬
    const percent = Math.min(Math.max(0, clientX - x), width) / width;

    // percent * duration(video total time) = currentTime
    const setTime = duration * percent;
    timeline.style.setProperty("--progress-position", `${percent}`);

    setVideoOptions((prev) => ({
      ...prev,
      setTime,
      currentTime: setTime,
    }));
  };

  const throttledHandleMouseMove = _.throttle(handleMouseMove, 60);

  const throttledSetTime = useCallback(
    _.throttle((setTime) => {
      if (!isLoaded) return

      const video = videoRef.current;

      if (!video || setTime === undefined) return;

      video.currentTime = setTime;

      setVideoOptions((prev) => ({
        ...prev,
        setTime: undefined,
      }));
    }, 300),
    [isLoaded]
  );

  // 統一由此依據資料判斷 video 執行的動作
  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    video.volume = volume;
    video.muted = isMuted;

    if (isPlay && video.paused) {
      console.log("play video");
      video.play();

      setVideoOptions((prev) => ({
        ...prev,
        isPlaying: true,
      }));
    } else if (isPlaying && !isPlay && !video.paused) {
      console.log("pause video");
      video.pause();

      !isScrubbing &&
        setVideoOptions((prev) => ({
          ...prev,
          isPlaying: false,
        }));
    }

    if (setTime !== undefined) {
      throttledSetTime(setTime);
    }
  }, [videoOptions]);

  useEffect(() => {
    document.addEventListener("mousemove", throttledHandleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", throttledHandleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isScrubbing]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || (!videoId && !src)) return;
    const config = isLive
      ? {
        initialLiveManifestSize: 3,
      }
      : {
        startPosition: 0,
      };

    if (!hls) {
      setHls(new Hls(config));

      return;
    }

    const playVideo = () => {
      hls.attachMedia(video);

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        const url = isLive
          ? `${STREAM_SERVER_URL}/live/${videoId}.m3u8`
          : `${STREAM_SERVER_URL}/videos/${videoId}/master.m3u8`;
        hls.loadSource(url);
      });

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setVideoOptions((prev) => ({
          ...prev,
          isPlay: true,
          isLoaded: true,
        }));
      });

      hls.on(Hls.Events.FRAG_CHANGED, function () { });

      hls.on(
        Hls.Events.ERROR,
        _.throttle(function (_, data) {
          const errorType = data.type;
          switch (errorType) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.recoverMediaError();
              break;
            case Hls.ErrorDetails.BUFFER_NUDGE_ON_STALL:
              console.log("Hls.ErrorDetails.BUFFER_NUDGE_ON_STALL");
            default:
              break;
          }
        }, 2000)
      );
    };

    try {
      if (Hls.isSupported()) {
        playVideo();
      }
    } catch (err) {
      console.log("error");
    }

    return () => {
      console.log("leave video");

      hls.destroy();
      setHls(null);
    };
  }, [videoId, hls]);

  useEffect(() => {
    if (videoId) {
      setVideoOptions(prev => ({
        ...prev,
        videoId
      }))
    }

  }, [videoId])

  useEffect(() => {
    if (src) {
      setVideoOptions(prev => ({
        ...prev,
        src
      }))
    }
  }, [src])

  return {
    videoRef,
    timelineRef,
    videoOptions,
    videoControllers: {
      handleUpdateVideoTimeByTimeline,
      handleMouseUp,
      handleTogglePlay,
      handleToggleMute,
      handleChangeVolume,
      handleToggleMiniMode,
      handleToggleTheaterMode,
      handleToggleFullMode,
      handleVideoTime,
      handleVideoLoaded,
      handleVideoEnded
    }
  }

}

export default useVideoPlayer