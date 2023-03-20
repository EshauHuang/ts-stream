import { Outlet } from "react-router-dom";

import { CommentsProvider } from "@/contexts/commentsContext";
import { VideoOptionsProvider } from "@/contexts/videoOptionsContext";

const RoomContextLayout = () => {
  return (
    <VideoOptionsProvider>
      <CommentsProvider>
        <Outlet />
      </CommentsProvider>
    </VideoOptionsProvider>
  );
};

export default RoomContextLayout;
