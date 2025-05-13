import React, { useContext } from "react";
import { ModalContext } from "../ModalProvider/ModalProvider";
import "./CreatePlaygroundModal.scss";
import { usePlayground } from "../PlaygroundProvider/usePlayground"; // 👈

export const CreatePlaygroundModal = () => {
  const modalFeatures = useContext(ModalContext);
  const playgroundFeatures = usePlayground(); // ✅ safe and typed

  const closeModal = () => {
    modalFeatures?.closeModal();
  };

  const onSubmitModal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const folderName = form.folderName.value;
    const fileName = form.fileName.value;
    const language = form.language.value;

    playgroundFeatures.createNewPlayground({
      folderName,
      fileName,
      language,
    });

    closeModal(); // 👈 optional: close after creating
  };

  return (
    <div className="modal-container">
      <form className="modal-body" onSubmit={onSubmitModal}>
        <span onClick={closeModal} className="material-icons close">
          close
        </span>
        <h1>Create New Playground</h1>
        <div className="item">
          <p>Enter Folder Name</p>
          <input name="folderName" required />
        </div>
        <div className="item">
          <p>Enter Card Name</p>
          <input name="fileName" required />
        </div>
        <div className="item">
          <select name="language" required>
            <option value="cpp">Cpp</option>
            <option value="java">Java</option>
            <option value="javascript">Javascript</option>
            <option value="python">Python</option> {/* fixed typo */}
          </select>
          <button type="submit">Create Playground</button>
        </div>
      </form>
    </div>
  );
};
