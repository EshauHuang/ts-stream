import { useRef, useEffect,forwardRef } from "react";

import
  ScrubberSpot from "@/components/video-player-items/scrubber-spot/scrubber-spot.component"

import {
  StyledTimelineContainer,
  TimelineCursor,
  Timeline,
} from "./timeline-slider.style";

const TimelineSlider = forwardRef(
  (
    {
      isLive,
      isScrubbing,
      handleMouseUp,
      handleUpdateVideoTimeByTimeline,
    }: {
      isLive: boolean;
      isScrubbing: boolean;
      handleMouseUp: () => void;
      handleUpdateVideoTimeByTimeline: (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
      ) => void;
    },
    ref
  ) => {
    const timelineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (ref) {
        if (typeof ref === "function") {
          ref(timelineRef.current);
        } else {
          ref.current = timelineRef.current;
        }
      }
    }, [ref]);

    return (
      <StyledTimelineContainer
        ref={timelineRef}
        isLive={isLive}
        isScrubbing={isScrubbing}
        onClick={(e) => {
          if (isLive) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        onMouseDown={(e) => handleUpdateVideoTimeByTimeline(e)}
        onMouseUp={() => handleMouseUp()}
      >
        <TimelineCursor></TimelineCursor>
        <Timeline></Timeline>
        {!isLive && <ScrubberSpot />}
      </StyledTimelineContainer>
    );
  }
);

export default TimelineSlider
