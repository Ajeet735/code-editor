import React, { useContext } from "react";
import "./CreatePlaygroundModal.scss";
import { ModalContext } from "../ModalProvider/ModalProvider";
import { PlaygroundContext } from "../PlaygroundProvider/PlaygroundProvider";
import"./CreateFolderModal.scss";

export const CreateFolderModal = () => {
  const modalFeatures = useContext(ModalContext);
  const { createNewFolder } = useContext(PlaygroundContext)!;

  const closeModal = () => {
    modalFeatures?.closeModal();
  };

  const onSubmitModal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const folderName = form.folderName.value;
    createNewFolder(folderName);
    console.log(folderName);
    closeModal();
  };
  return (
    <div className="modal-container">
      <form className="modal-body" onSubmit={onSubmitModal}>
        <span onClick={closeModal} className="material-icons close">
          close
        </span>
        <h1>Create New Folder</h1>
        <div style={CreateFolderModalStyles.inputContainer}>
          <input
            required
            name="folderName"
            style={CreateFolderModalStyles.input}
            placeholder="Enter Folder Name"
          />
          <button style={CreateFolderModalStyles.btn} type="submit" >
            Create Folder
          </button>
        </div>
      </form>
    </div>
  );
};

export const CreateFolderModalStyles = {
  inputContainer: {
    display: "flex",
    gap: 30,
    justifyContent: "space-between", // or "flex-start", "flex-end", "space-between", etc.
  },
  input: {
    flexGrow: 1,
    padding: 10,
  },
  btn: {
    padding: '10px 20px',
    backgroundColor: 'black',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    boxShadow: '0 0 4px 0px #989898',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)', // scale is done with transform
      boxShadow: '0 0 8px 0px #989898',
    },
  }
  
};
