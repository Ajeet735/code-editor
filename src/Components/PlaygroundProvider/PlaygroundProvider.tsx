import { createContext, useState, useEffect, ReactNode } from "react";
import { v4 } from "uuid";

// Type Definitions
type FileType = {
  id: string;
  title: string;
  code: string;
  language: string;
};

type FolderType = {
  id: string;
  title: string;
  files: FileType[];
};

export type PlaygroundContextType = {
  folders: FolderType[];
  createNewPlayground: (args: {folderName: string;fileName: string;language: string; }) => void;
  createNewFolder: (folderName: string) => void;
  DeleteFolder: (id: string) => void;
  editFolderTitle: (newFolderName: string, id: string) => void;
  editFileTitle: (newFileName: string,folderId: string,fileId: string ) => void;
  deleteFile: (folderId: string, fileId: string) => void;
  createPlayground: (folderId: string, file: FileType) => void;
  getDefaultCode: (fileId: string, folderId: string) => string 
  getLanguage: (fileId: string, folderId: string) => string 
  updateLanguage: (fileId: string, folderId: string,language:string) => string 
  updateTitle: (fileId: string, folderId: string) => string 
  saveCode: (fileId: string, folderId: string, newCode:string) => string 
};

// Create Context
export const PlaygroundContext = createContext<
  PlaygroundContextType | undefined
>(undefined);

type PlaygroundProviderProps = {
  children: ReactNode;
};

// Default template codes
export const defaultCodes: { [key: string]: string } = {
  cpp: `#include<iostream>
using namespace std;
int main(){
  cout << "hello world";
  return 0;
}`,
  javascript: `function main() {
  console.log("Hello, javascript!");
}

main();`,
  python: `def main():
    print("Hello, python!")

if __name__ == "__main__":
    main()`,
  java: `class Main {
  public static void main(String[] args) {
    System.out.println("Try programiz.pro");
  }
}`,
};

// Initial data
const initialData: FolderType[] = [
  {
    id: v4(),
    title: "DSA",
    files: [
      {
        id: v4(),
        title: "index",
        code: `#include<iostream>\nusing namespace std;\nint main() {\n  cout << "Hello World";\n  return 0;\n}`,
        language: "cpp",
      },
    ],
  },
];

// Playground Provider
export const PlaygroundProvider = ({ children }: PlaygroundProviderProps) => {
  const [folders, setFolders] = useState<FolderType[]>(() => {
    const localData = localStorage.getItem("data");
    if (localData) {
      return JSON.parse(localData);
    }
    return initialData;
  });

  const createNewPlayground = ({
    folderName,
    fileName,
    language,
  }: {
    folderName: string;
    fileName: string;
    language: string;
  }) => {
    const newFolder: FolderType = {
      id: v4(),
      title: folderName,
      files: [
        {
          id: v4(),
          title: fileName,
          code: defaultCodes[language] || "",
          language,
        },
      ],
    };

    localStorage.setItem("data", JSON.stringify(newFolder));
    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
  };
  const createNewFolder = (folderName: string) => {
    const newFolder: FolderType = {
      id: v4(),
      title: folderName,
      files: [],
    };

    const allFolders: FolderType[] = [...folders, newFolder];
    localStorage.setItem("data", JSON.stringify(allFolders));
    setFolders(allFolders);
  };

  const DeleteFolder = (id: string) => {
    const updatedFolderList = folders.filter((folderItem) => {
      return folderItem.id !== id;
    });

    localStorage.setItem("data", JSON.stringify(updatedFolderList));
    setFolders(updatedFolderList);
  };

  const editFolderTitle = (newFolderName: string, id: string) => {
    const updatedFolderList = folders.map((folderItem) =>
      folderItem.id === id
        ? { ...folderItem, title: newFolderName } // 🔄 Create a new object
        : folderItem
    );
  
    setFolders(updatedFolderList);
    localStorage.setItem("data", JSON.stringify(updatedFolderList));
  };
  

  const editFileTitle = (
    newFileName: string,
    folderId: string,
    fileId: string
  ): string => { // ⬅ return type changed to `string`
    const copiedFolders = [...folders];
    for (let i = 0; i < copiedFolders.length; i++) {
      if (folderId === copiedFolders[i].id) {
        const files = copiedFolders[i].files;
        for (let j = 0; j < files.length; j++) {
          if (files[j].id === fileId) {
            files[j].title = newFileName;
            break;
          }
        }
        break;
      }
    }
  
    localStorage.setItem("data", JSON.stringify(copiedFolders));
    setFolders(copiedFolders);
    return newFileName; // ✅ so the caller can use it
  };
  

  const deleteFile = (folderId: string, fileId: string) => {
    const copiedFolders = [...folders];
    for (let i = 0; i < copiedFolders.length; i++) {
      if (copiedFolders[i].id === folderId) {
        const files = [...copiedFolders[i].files];
        copiedFolders[i].files = files.filter((file) => {
          return file.id !== fileId;
        });
        break;
      }
    }

    localStorage.setItem("data", JSON.stringify(copiedFolders));
    setFolders(copiedFolders);
  };
  const createPlayground = (folderId: string, file: FileType) => {
    const copiedFolders = [...folders];
    for (let i = 0; i < copiedFolders.length; i++) {
      if (copiedFolders[i].id === folderId) {
        copiedFolders[i].files.push(file);
        break;
      }
    }
    localStorage.setItem("data", JSON.stringify(copiedFolders));
    setFolders(copiedFolders);
  };
  const getDefaultCode = (fileId: string, folderId: string): string => {
    for (let i = 0; i < folders.length; i++) {
      if (folders[i].id === folderId) {
        for (let j = 0; j < folders[i].files.length; j++) {
          const currentFile = folders[i].files[j];
          if (fileId === currentFile.id) {
            return currentFile.code;
          }
        }
      }
    }
    return ""; // Fallback: ensure return type is always string
  };
  const getLanguage = (fileId: string, folderId: string): string => {
    for (let i = 0; i < folders.length; i++) {
      if (folders[i].id === folderId) {
        for (let j = 0; j < folders[i].files.length; j++) {
          const currentFile = folders[i].files[j];
          if (fileId === currentFile.id) {
            return currentFile.language;
          }
        }
      }
    }
    return ""; // Fallback: ensure return type is always string
  };
 const updateLanguage = (fileId: string, folderId: string, language: string): string => {
  const newFolders = [...folders];
  for (let i = 0; i < newFolders.length; i++) {
    if (newFolders[i].id === folderId) {
      for (let j = 0; j < newFolders[i].files.length; j++) {
        const currentFile = newFolders[i].files[j];
        if (fileId === currentFile.id) {
          newFolders[i].files[j].language = language;
          newFolders[i].files[j].code = defaultCodes[language] || ""; // ✅ Update code too
        }
      }
    }
  }
  localStorage.setItem("data", JSON.stringify(newFolders));
  setFolders(newFolders);
  return "";
};

  const updateTitle = (fileId: string, folderId: string): string => {
    for (let i = 0; i < folders.length; i++) {
      if (folders[i].id === folderId) {
        for (let j = 0; j < folders[i].files.length; j++) {
          const currentFile = folders[i].files[j];
          if (fileId === currentFile.id) {
            return currentFile.title;
          }
        }
      }
    }
    return "Untitled";
  };
  
  
  const saveCode = (fileId: string, folderId: string, newCode:string): string => {
    const newFolders = [...folders]
    for (let i = 0; i < newFolders.length; i++) {
      if (newFolders[i].id === folderId) {
        for (let j = 0; j < newFolders[i].files.length; j++) {
          const currentFile = newFolders[i].files[j];
          if (fileId === currentFile.id){
            newFolders[i].files[j].code = newCode;
            //newFolders[i].files[j].code = defaultCodes[language]
          }
        }
      }
    }
    localStorage.setItem("data", JSON.stringify(newFolders));
    setFolders(newFolders)
    return ""; // Fallback: ensure return type is always string
  };
  

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(folders));
  }, [folders]);

  const playgroundFeatures: PlaygroundContextType = {
    folders,
    createNewPlayground,
    createNewFolder,
    DeleteFolder,
    editFolderTitle,
    editFileTitle,
    deleteFile,
    createPlayground,
    getDefaultCode,
    getLanguage,
    updateLanguage,
    saveCode,
    updateTitle
  };

  return (
    <PlaygroundContext.Provider value={playgroundFeatures}>
      {children}
    </PlaygroundContext.Provider>
  );
};
