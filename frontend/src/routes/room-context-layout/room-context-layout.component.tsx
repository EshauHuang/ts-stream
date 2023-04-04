import { Outlet, useParams, useLocation, useMatches } from "react-router-dom";

import { CommentsProvider } from "@/contexts/commentsContext";
import { VideoOptionsProvider } from "@/contexts/videoOptionsContext";

const RoomContextLayout = () => {
  const {pathname} = useLocation();

  const isLive = pathname.search(/^\/live/) >= 0;

  return (
    <VideoOptionsProvider isLive={isLive}>
      <CommentsProvider>
        <Outlet />
      </CommentsProvider>
    </VideoOptionsProvider>
  );
};

export default RoomContextLayout;
