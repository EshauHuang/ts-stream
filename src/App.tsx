import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import styled from "styled-components";

import Home from "@/routes/home/home.component";
import SignInForm from "@/components/sign-in-form/sign-in-form.component";
import SignUpForm from "@/components/sign-up-form/sign-up-form.component";
import Live from "@/routes/live/live.component";
import Video from "@/routes/video/video.component"
import Setting from "@/routes/setting/setting.component";
import Navbar from "@/components/navbar/navbar.component";

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
        </Route>
      </Routes>
    </>
  );
};

export default App;
