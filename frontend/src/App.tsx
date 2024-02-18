import { Routes, Route } from "react-router-dom";

import Home from "@/routes/home/home.component";
import SignInForm from "@/components/sign-in-form/sign-in-form.component";
import SignUpForm from "@/components/sign-up-form/sign-up-form.component";
import Stream from "@/routes/stream/stream.component";
import Video from "@/routes/video/video.component";
import Setting from "@/routes/setting/setting.component";
import Navbar from "@/components/navbar/navbar.component";
import RoomContextLayout from "@/routes/room-context-layout/room-context-layout.component";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path=":username/setting" element={<Setting />} />
          <Route path="sign-up" element={<SignUpForm />} />
          <Route path="sign-in" element={<SignInForm />} />
          <Route element={<RoomContextLayout />}>
            <Route path="stream/:username" element={<Stream />} />
            <Route path="video/:videoId" element={<Video />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
