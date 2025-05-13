import React, { useContext } from "react";
import { ModalContext } from "../ModalProvider/ModalProvider";
import "./CreatePlaygroundModal.scss";
import {
  defaultCodes,
  PlaygroundContext,
} from "../PlaygroundProvider/PlaygroundProvider";
import { v4 } from "uuid";
export const CreateCardModal = () => {
  const { closeModal, modalPayload } = useContext(ModalContext)!;
  const { createPlayground } = useContext(PlaygroundContext)!;

  const onSubmitModal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const fileName = form.fileName.value;
    const language = form.language.value;

    const file = {
      id: v4(),
      title: fileName,
      language,
      code: defaultCodes[language],
    };

    if (!modalPayload || modalPayload.type !== "create-playground") return;

    createPlayground(modalPayload.folderId, file);
    closeModal();
  };

  return (
    <div className="modal-container">
      <form className="modal-body" onSubmit={onSubmitModal}>
        <span onClick={closeModal} className="material-icons close">
          close
        </span>
        <h1>Create New Playground</h1>

        <div className="item">
          <p>Enter Card Name</p>
          <input name="fileName" placeholder="Enter Card Title" required />
        </div>
        <div className="item">
          <select name="language" required>
            <option value="cpp">Cpp</option>
            <option value="java">Java</option>
            <option value="javascript">Javascript</option>
            <option value="python">Python</option> 
          </select>
          <button type="submit">Create Playground</button>
        </div>
      </form>
    </div>
  );
};
