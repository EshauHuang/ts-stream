import { Routes, Route } from "react-router-dom";

import Home from "@/routes/home/home.component";
import SignInForm from "@/components/sign-in-form/sign-in-form.component";
import SignUpForm from "@/components/sign-up-form/sign-up-form.component";
import Live from "@/routes/live/live.component";
import Video from "@/routes/video/video.component"
import Setting from "@/routes/setting/setting.component";
import Navbar from "@/components/navbar/navbar.component";
import Test from "./components/test";

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
          <Route path="live/:username" element={<Live />} />
          <Route path="video/:videoId" element={<Video />} />
          <Route path="test" element={<Test />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
