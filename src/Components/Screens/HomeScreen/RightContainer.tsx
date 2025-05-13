import React, { useContext } from "react";
import "./RightContainer.css";
import logo from "../../../assets/logo.png";
import { PlaygroundContext } from "../../PlaygroundProvider/PlaygroundProvider";
import {
  ModalConstants,
  ModalContext,
} from "../../ModalProvider/ModalProvider";
import { useNavigate } from "react-router-dom";

type Playground = {
  id: string;
  title: string;
  language: string;
};
type FolderProps = {
  folderTitle: string;
  cards: Playground[];
  folderId: string;
};

// Folder Component
const Folder: React.FC<FolderProps> = ({ folderTitle, cards, folderId }) => {
  const { DeleteFolder, deleteFile } = useContext(PlaygroundContext)!;
  const { openModal, setModalPayload } = useContext(ModalContext)!;
  const navigate = useNavigate();

  const oneDeleteFolder = () => {
    DeleteFolder(folderId);
  };
  const onEditFolderTitle = () => {
    setModalPayload({ type: "update-folder-title", folderId });
    openModal(ModalConstants.UPDATE_FOLDER_TITLE);
  };

  const openCreateCardModal = () => {
    setModalPayload({ type: "create-playground", folderId });
    openModal(ModalConstants.CREATE_CARD);
  };

  return (
    <div className="folder-container">
      <div className="folder-header">
        <div className="folder-header-item">
          <span className="material-icons" style={{ color: "#FFCA29" }}>
            folder
          </span>
          <span>{folderTitle}</span>
        </div>
        <div className="folder-header-item">
          <span className="material-icons" onClick={oneDeleteFolder}>
            delete
          </span>
          <span className="material-icons" onClick={onEditFolderTitle}>
            edit
          </span>
          <button className="add-card" onClick={openCreateCardModal}>
            <span className="material-icons add-icons">add</span>
            <span>New Playground</span>
          </button>
        </div>
      </div>

      <div className="cards-container">
        {cards?.map((files: Playground, index: number) => {
          const onEditFileTitle = (e: React.MouseEvent) => {
            e.stopPropagation(); // Prevent navigation when editing file title
            setModalPayload({
              type: "update-file-title",
              folderId,
              fileId: files.id,
            });
            openModal(ModalConstants.UPDATE_FILE_TITLE);
          };
          const onDeleteFile = (e: React.MouseEvent) => {
            e.stopPropagation(); // Prevent navigation when deleting file
            deleteFile(folderId, files.id);
          };

          // Playground navigation
          const navigateToPlaygroundScreen = () => {
            navigate(`/playground/${files.id}/${folderId}`);
          };

          return (
            <div
              className="card"
              key={index}
              onClick={navigateToPlaygroundScreen}
            >
              <img src={logo} alt="" />

              <div className="title-container">
                <span>{files?.title}</span>
                <span>Language: {files?.language}</span>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <span className="material-icons" onClick={onDeleteFile}>
                  delete
                </span>
                <span className="material-icons" onClick={onEditFileTitle}>
                  edit
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// RightContainer Component
export const RightContainer = () => {
  const { folders } = useContext(PlaygroundContext)!;
  const modalFeatures = useContext(ModalContext);

  const openCreateNewFlderModal = () => {
    modalFeatures?.openModal(ModalConstants.CREATE_FOLDER);
  };

  return (
    <div className="right-container">
      <div className="header">
        <div className="title">
          My <span>Playground</span>
        </div>
        <button className="add-folder" onClick={openCreateNewFlderModal}>
          <span className="material-icons add-icons">add</span>
          <span>New Folder</span>
        </button>
      </div>
      {folders?.map(
        (folder: { id: string; title: string; files: Playground[] }, index: number) => {
          return (
            <Folder
              folderTitle={folder?.title}
              cards={folder?.files}
              key={index}
              folderId={folder.id}
            ></Folder>
          );
        }
      )}
    </div>
  );
};
