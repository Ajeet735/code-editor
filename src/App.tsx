import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { HomeScreen } from "./Components/Screens/HomeScreen/HomeScreen";
import { PlaygroundProvider } from "./Components/PlaygroundProvider/PlaygroundProvider";
import { PlaygroundScreen } from "./Components/Screens/PlaygroundScreen/PlaygroundScreen";
import { Form } from "./Components/Form";
import { ModalProvider } from "./Components/ModalProvider/ModalProvider";

const App = () => {
  return (
    <PlaygroundProvider>
      <ModalProvider>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/playground/:fileId/:folderId" element={<PlaygroundScreen />} />
          <Route path="/form" element={<Form />} />
        </Routes>
      </ModalProvider>
    </PlaygroundProvider>
  );
};

export default App;
