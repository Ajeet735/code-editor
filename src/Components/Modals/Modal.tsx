import { useContext } from "react";
import { ModalConstants, ModalContext } from "../ModalProvider/ModalProvider";

import { CreatePlaygroundModal } from "./CreatePlaygroundModal";
import { CreateFolderModal } from "./CreateFolderModal";
import { UpdateFolderTitleModal } from "./UpdateFolderTitleModal";
import { UpdateFileTitleModal } from "./UpdateFileTitleModal";
import { CreateCardModal } from "./CreateCardModal";

export const Modal = () => {
  const modalFeatures = useContext(ModalContext);

  if (!modalFeatures) return null;
  const { activeModal, modalPayload } = modalFeatures;
  console.log("Modal Rendered");
  console.log("Active Modal:", activeModal);
  console.log("Modal Payload:", modalPayload);
  return (
    <>
      {activeModal === ModalConstants.CREATE_PLAYGROUND && <CreatePlaygroundModal />}
      {activeModal === ModalConstants.CREATE_FOLDER && <CreateFolderModal />}
      {activeModal === ModalConstants.UPDATE_FOLDER_TITLE && <UpdateFolderTitleModal />}
      {activeModal === ModalConstants.UPDATE_FILE_TITLE && modalPayload?.type === "update-file-title" && (<UpdateFileTitleModal />)}
      {activeModal === ModalConstants.CREATE_CARD && <CreateCardModal />}
    </>
  );
};
