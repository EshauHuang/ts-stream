import { Outlet, useParams, useLocation, useMatches } from "react-router-dom";

import { CommentsProvider } from "@/contexts/commentsContext";
import { VideoOptionsProvider } from "@/contexts/videoOptionsContext";

const RoomContextLayout = () => {
  const { pathname } = useLocation();

  const isStream = pathname.search(/^\/stream/) >= 0;

  return (
    <VideoOptionsProvider isStream={isStream}>
      <CommentsProvider>
        <Outlet />
      </CommentsProvider>
    </VideoOptionsProvider>
  );
};

export default RoomContextLayout;
