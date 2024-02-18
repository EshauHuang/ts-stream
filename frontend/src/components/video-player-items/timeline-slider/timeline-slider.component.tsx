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
      isStream,
      isScrubbing,
      handleMouseUp,
      handleUpdateVideoTimeByTimeline,
    }: {
      isStream: boolean;
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
        isStream={isStream}
        isScrubbing={isScrubbing}
        onClick={(e) => {
          if (isStream) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        onMouseDown={(e) => handleUpdateVideoTimeByTimeline(e)}
        onMouseUp={() => handleMouseUp()}
      >
        <TimelineCursor></TimelineCursor>
        <Timeline></Timeline>
        {!isStream && <ScrubberSpot />}
      </StyledTimelineContainer>
    );
  }
);

export default TimelineSlider
