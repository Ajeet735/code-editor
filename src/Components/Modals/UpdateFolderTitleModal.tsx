import { ModalContext } from "../ModalProvider/ModalProvider";
import { PlaygroundContext } from "../PlaygroundProvider/PlaygroundProvider";
import "./CreatePlaygroundModal.scss";
import { CreateFolderModalStyles } from "./CreateFolderModal";
import { useContext } from "react";
export const UpdateFolderTitleModal = () => {
  const { closeModal, modalPayload } = useContext(ModalContext)!;
  const { editFolderTitle } = useContext(PlaygroundContext)!;
  const onSubmitModal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const folderName = form.folderName.value;
    if (!modalPayload || modalPayload.type !== "update-folder-title") return;
editFolderTitle(folderName, modalPayload.folderId);


    closeModal();
  };
  return (
    <div className="modal-container">
      <form className="modal-body" onSubmit={onSubmitModal}>
        <span onClick={closeModal} className="material-icons close">
          close
        </span>
        <h1>Update Folder Title</h1>
        <div style={CreateFolderModalStyles.inputContainer}>
          <input
            name="folderName"
            style={CreateFolderModalStyles.input}
            placeholder="Enter Folder Name"
          />
          <button style={CreateFolderModalStyles.btn} type="submit">
            Create Folder
          </button>
        </div>
      </form>
    </div>
  );
};
