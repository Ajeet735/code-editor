import { useContext } from "react";
import { ModalContext } from "../ModalProvider/ModalProvider";
import { CreateFolderModalStyles } from "./CreateFolderModal";
import { PlaygroundContext } from "../PlaygroundProvider/PlaygroundProvider";

export const UpdateFileTitleModal = () => {
  const { closeModal, modalPayload } = useContext(ModalContext)!;
  const { editFileTitle } = useContext(PlaygroundContext)!;

  const onSubmitModal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fileName = form.fileName.value;

    if (!modalPayload || modalPayload.type !== "update-file-title") return;

    editFileTitle(fileName, modalPayload.folderId, modalPayload.fileId);
    closeModal();
  };

  return (
    <div className="modal-container">
      <form className="modal-body" onSubmit={onSubmitModal}>
        <span onClick={closeModal} className="material-icons close">
          close
        </span>
        <h1 style={{ color: 'black' }}>Update Folder Title</h1>

        <div style={CreateFolderModalStyles.inputContainer}>
          <input
            required
            name="fileName"
            style={CreateFolderModalStyles.input}
            placeholder="Enter File Name"
          ></input>
          <button style={CreateFolderModalStyles.btn} type="submit">
            Update Title
          </button>
        </div>
      </form>
    </div>
  );
};
