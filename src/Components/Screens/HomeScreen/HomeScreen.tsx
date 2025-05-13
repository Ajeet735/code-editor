import React, { useContext } from "react";
import "./HomeScreen.css";
import { RightContainer } from "./RightContainer";
import logo from "../../../assets/logo.png";
import { Modal } from "../../Modals/Modal";
import { ModalContext, ModalConstants,} from "../../ModalProvider/ModalProvider";
export const HomeScreen = () => {
  const modalFeatures = useContext(ModalContext);
  const openCreatePlaygroundModal = () => {
    modalFeatures?.openModal(ModalConstants.CREATE_PLAYGROUND);
  };
  return (
    <div className="home-container">
      <div className="left-container">
        <div className="items-container">
          <img src={logo} alt="" />
          <h1>Code Camp</h1>
          <h2>Code. Compile. Debug</h2>

          <button onClick={openCreatePlaygroundModal}>
            <span className="material-icons">add</span>
            <span>Create Playground</span>
          </button>
        </div>
      </div>
      <RightContainer></RightContainer>
      <Modal></Modal>
    </div>
  );
};
