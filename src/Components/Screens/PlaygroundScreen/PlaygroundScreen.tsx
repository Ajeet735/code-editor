import React, { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import "./PlaygroundScreen.scss";
import { EditorContainer } from "./EditorContainer";
import { makeSubmission } from "./service";
import { Navbar } from "./Navbar";

interface ParamsType {
  fileId?: string;
  folderId?: string;
}

interface RunCodeParams {
  code: string;
  language: "cpp" | "python" | "javascript" | "java";
}

interface CallbackParams {
  apiStatus: "loading" | "success" | "error";
  data?: any;
  message?: string;
}

export const PlaygroundScreen: React.FC = () => {
  const params = useParams<Record<string, string | undefined>>(); 
  const { fileId, folderId }: ParamsType = params;
  const [input, setInput] = useState<string>(''); 
  const [output, setOutput] = useState<string>(''); 
  const [showLoader, setShowLoader] = useState<boolean>(false); 
  const [isFullScreen, ] = useState<boolean>(false);

  const importInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isTextFile = file.type.includes("text");
    if (isTextFile) {
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = function (event) {
        const result = event.target?.result;
        if (typeof result === "string") {
          setInput(result);
        } else {
          alert("Please choose a valid text file.");
        }
      };
    }
  };

  const exportOutput = () => {
    const outputValue = output.trim();
    if (!outputValue) {
      alert("Output is Empty");
      return;
    }

    const codeBlob = new Blob([outputValue], { type: "text/plain" });
    const downloadUrl = URL.createObjectURL(codeBlob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `output.txt`;
    link.click();
  };

  const callback = ({ apiStatus, data, message }: CallbackParams) => {
    if (apiStatus === "loading") {
      setShowLoader(true);
    } else if (apiStatus === "error") {
      setShowLoader(false);
      setOutput("Something went wrong");
    } else {
      setShowLoader(false);
      if (data?.status?.id === 3) {
        setOutput(atob(data.stdout || ""));
      } else {
        setOutput(atob(data.stderr || ""));
      }
    }
  };

  const runCode = useCallback(({ code, language }: RunCodeParams) => {
    makeSubmission({ code, language, stdin: input, callback });
  }, [input]);

  return (
    <div className={`playground-container ${isFullScreen ? "fullscreen" : ""}`}>
      <Navbar isFullScreen={isFullScreen} />
      <div className={`content-container ${isFullScreen ? "fullscreen" : ""}`}>
        {/* Editor Container */}
        <div className="editor-container">
          <EditorContainer
            fileId={fileId}
            folderId={folderId}
            runCode={runCode}
          />
        </div>

        {/* Input Import */}
        <div className="input-output-container">
          <div className="input-header">
            <b>Input:</b>
            <label htmlFor="input" className="icon-container">
              <span className="material-icons">system_update_alt</span>
              <b>Import Input</b>
            </label>
            <input type="file" id="input" style={{ display: "none" }} onChange={importInput} />
          </div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} />
        </div>

        {/* Output Export */}
        <div className="input-output-container">
          <div className="input-header">
            <b>Output:</b>
            <button className="icon-container" onClick={exportOutput}>
              <span className="material-icons">open_in_browser</span>
              <b>Export Output</b>
            </button>
          </div>
          <textarea readOnly value={output} />
        </div>
      </div>

      {/* Loader */}
      {showLoader && (
        <div className="fullPage-loader">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};