import React, { createContext, useState, ReactNode } from "react";
type ModalPayload =
  | { type: "create-playground"; folderId: string }
  | { type: "edit-file"; folderId: string; fileId: string }
  | { type: "update-folder-title"; folderId: string }
  | { type: "update-file-title"; folderId: string; fileId: string }
  | { type: "update-code-title"; folderId: string; fileId: string }
  | null;

interface ModalContextType {
  openModal: (type: ModalType) => void;
  closeModal: () => void;
  activeModal: ModalType | null;
  modalPayload: ModalPayload;
  setModalPayload: (payload: ModalPayload) => void;
}

type ModalType = string | null;


type ModalProviderProps = {
  children: ReactNode;
};

export const ModalConstants = {
  CREATE_PLAYGROUND: "CREATE_PLAYGROUND",
  CREATE_FOLDER: "CREATE_FOLDER",
  UPDATE_FOLDER_TITLE: "UPDATE_FOLDER_TITLE",
  UPDATE_FILE_TITLE: "UPDATE_FILE_TITLE",
  UPDATE_CODE_TITLE: "UPDATE_CODE_TITLE",
  CREATE_CARD: "CREATE_CARD",
};
export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);
export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalPayload, setModalPayload] = useState<ModalPayload>(null);

  const closeModal = () => {
    setModalType(null);
    setModalPayload(null);
  };

  const modalFeatures: ModalContextType = {
    openModal: setModalType,
    closeModal,
    activeModal: modalType,
    modalPayload,
    setModalPayload,
  };

  return (
    <ModalContext.Provider value={modalFeatures}>
      {children}
    </ModalContext.Provider>
  );
};
