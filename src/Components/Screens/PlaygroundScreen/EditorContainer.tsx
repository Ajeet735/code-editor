import { useRef, useState, useEffect, useContext } from "react";
import "./EditorContainer.scss";
import { CSSProperties } from "react";
import Editor from "@monaco-editor/react";
import { PlaygroundContext } from "../../PlaygroundProvider/PlaygroundProvider";
import { ModalContext } from "../../ModalProvider/ModalProvider";
import { UpdateCodeTitleModal } from "../../Modals/UpdateCodeTitleModal";
import { ModalConstants } from "../../ModalProvider/ModalProvider";

type Language = "cpp" | "java" | "javascript" | "python";

type EditorContainerProps = {
  fileId?: string;
  folderId?: string;
  runCode: (params: { code: string; language: Language }) => void;
};

const editorOptions = {
  fontSize: 18,
  wordWrap: "on" as const,
};

const fileExtensionMapping: Record<Language, string> = {
  cpp: "cpp",
  java: "java",
  javascript: "js",
  python: "py",
};

const Styles: { fullScreen: CSSProperties } = {
  fullScreen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
};

export const EditorContainer: React.FC<EditorContainerProps> = ({
  fileId,
  folderId,
  runCode,
}) => {
  const { getDefaultCode, getLanguage, updateLanguage, updateTitle, saveCode} =  useContext(PlaygroundContext)!;
  const { openModal, setModalPayload,activeModal, modalPayload } = useContext(ModalContext)!;

  // Call hooks at the top level, unconditionally
  const [code, setCode] = useState<string>(() => {
    if (fileId && folderId) {
      return getDefaultCode(fileId, folderId);
    }
    return "";
  });

  const safeLanguage = (() => {
    if (fileId && folderId) {
      const lang = getLanguage(fileId, folderId);
      if (["cpp", "java", "javascript", "python"].includes(lang)) {
        return lang as Language;
      }
    }
    return "cpp"; // default fallback
  })();

  const [language, setLanguage] = useState<Language>(safeLanguage);
  const [theme, setTheme] = useState("vs-dark");
  const [isFullScreen, setFullScreen] = useState(false);
  const [title, setTitle] = useState(() =>
    fileId && folderId ? updateTitle(fileId, folderId) : "Untitled"
  );

  // References for tracking code and other values
  const codeRef = useRef<string>(code);

  // Log initial values of theme and language
  useEffect(() => {
    console.log({ theme: theme, language: language });
  }, [theme, language]);

  const onChangeCode = (newCode: string | undefined) => {
    if (typeof newCode === "string") {
      setCode(newCode);
      codeRef.current = newCode;
    }
  };

  // Import code handler
  const fileInputRef = useRef<HTMLInputElement>(null); 

  const importCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = function (value) {
      const result = value.target?.result;
      console.log("File content:", result);

      if (typeof result === "string") {
        const importedCode: string = result;
        setCode(importedCode);
        codeRef.current = importedCode;
      } else {
        alert("Please choose a program file");
      }
    };
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // Export code handler
  const exportCode = () => {
    const codeValue = codeRef.current?.trim();
    if (!codeValue) {
      alert("Please type some code before exporting");
    }
    const codeBlob = new Blob([codeValue], { type: "text/plain" });
    const downloadUrl = URL.createObjectURL(codeBlob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${title}.${fileExtensionMapping[language]}`;
    link.click();
  };

  // Language change handler
  const onChangeLanguage = (newLanguage: string) => {
    if (["cpp", "java", "javascript", "python"].includes(newLanguage)) {
      if (fileId && folderId) {
        updateLanguage(fileId, folderId, newLanguage);
        const defaultCode = getDefaultCode(fileId, folderId) || "";
        setCode(defaultCode);
        codeRef.current = defaultCode;

        setTitle(updateTitle(fileId, folderId));
      }
      setLanguage(newLanguage as Language);
    } else {
      console.warn("Invalid language selected:", newLanguage);
    }
  };

  // Theme change handler
  const onChangeTheme = (newTheme: string) => {
    setTheme(newTheme);
  };

  // Save Code Logic
  const onSaveCode = () => {
    if (fileId && folderId) {
      saveCode(fileId, folderId, codeRef.current);
      alert("Code saved successfully");
    } else {
      console.warn("Code not saved successfully");
    }
  };

  // Fullscreen toggle
  const toggleFullScreen = () => {
    setFullScreen(!isFullScreen);
  };

  // Run code logic
  const onRunCode = () => {
    runCode({ code: codeRef.current, language });
  };

  const OnEditTitle = () => {

    openModal(ModalConstants.UPDATE_CODE_TITLE);
    setModalPayload({
      type: "update-code-title",
      folderId: folderId!,
      fileId: fileId!,
    });


  }

  return (
    <div
      className="root-editor-container"
      style={isFullScreen ? Styles.fullScreen : {}}
    >
      <div className="editor-header">
        <div className="editor-left-container">
          <b className="title">{title}</b>
          <button onClick={OnEditTitle}>
            <span className="material-icons">edit</span>
          </button>
          <button onClick={onSaveCode}>Save Code</button>
        </div>
        <div className="editor-right-container">
          <select onChange={(e) => onChangeLanguage(e.target.value)} value={language}>
            <option value="cpp">Cpp</option>
            <option value="java">Java</option>
            <option value="javascript">Javascript</option>
            <option value="python">Python</option>
          </select>
          <select onChange={(e) => onChangeTheme(e.target.value)} value={theme}>
            <option value="vs-dark">vs-dark</option>
            <option value="vs-light">vs-light</option>
          </select>
        </div>
      </div>
  
      <div className="editor-body">
  <Editor
    height={"100%"}
    language={language}
    options={editorOptions}
    theme={theme}
    onChange={onChangeCode}
    value={code}
  />
  {activeModal === ModalConstants.UPDATE_CODE_TITLE && modalPayload?.type === "update-code-title" &&
   (<UpdateCodeTitleModal onUpdateTitle={setTitle} />)}
</div>
  
      <div className="editor-footer">
        <button className="btn" onClick={toggleFullScreen}>
          <span className="material-icons">fullscreen</span>
          <span>{isFullScreen ? "Minimize" : "Full Screen"}</span>
        </button>
  
        <button className="btn" onClick={handleImportClick}>
          <span className="material-icons">system_update_alt</span>
          <span>Import Code</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={importCode}
        />
        <button className="btn" onClick={exportCode}>
          <span className="material-icons">open_in_browser</span>
          <span>Export Code</span>
        </button>
        <button className="btn run-btn" onClick={onRunCode}>
          <span className="material-icons">play_arrow</span>
          <span>Run Code</span>
        </button>
      </div>
  

    </div>
  );
  
};
