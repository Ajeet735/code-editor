type Language = "cpp" | "python" | "javascript" | "java";

interface MakeSubmissionParams {
  code: string;
  language: Language;
  callback: (status: CallbackStatus) => void;
  stdin?: string;
}

interface CallbackStatus {
  apiStatus: "loading" | "success" | "error";
  data?: any;
  message?: string;
}

interface SubmissionResult {
  status: {
    id: number;
    description: string;
  };
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  time: string | null;
  memory: number | null;
  token: string;
}

const languageCodeMap: Record<Language, number> = {
  cpp: 54,
  python: 92,
  javascript: 93,
  java: 91,
};

async function getSubmission(tokenId: string): Promise<SubmissionResult> {
  const url = `https://judge0-ce.p.rapidapi.com/submissions/${tokenId}?base64_encoded=true&wait=false&fields=*`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "b6aaac6b2cmsh77b90d52a9aeeccp1f6373jsn1aa24f54fcee",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Error fetching submission: ${response.statusText}`);
  }
  const result: SubmissionResult = await response.json();
  return result;
}

export async function makeSubmission({ code, language, callback, stdin }: MakeSubmissionParams): Promise<void> {
  const url = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*";
  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": "b6aaac6b2cmsh77b90d52a9aeeccp1f6373jsn1aa24f54fcee",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language_id: languageCodeMap[language],
      source_code: btoa(code),
      stdin: stdin ? btoa(stdin) : "",
    }),
  };

  try {
    callback({ apiStatus: "loading" });

    const response = await fetch(url, options);
    const result = await response.json();
    const tokenId: string = result.token;

    let statusCode = 1;
    let apiSubmissionResult: SubmissionResult | null = null;

    while (statusCode === 1 || statusCode === 2) {
      apiSubmissionResult = await getSubmission(tokenId);
      statusCode = apiSubmissionResult.status.id;
      await new Promise((r) => setTimeout(r, 1000)); // wait 1 second
    }

    if (apiSubmissionResult) {
      if (apiSubmissionResult.compile_output) {
        callback({ apiStatus: "error", message: atob(apiSubmissionResult.compile_output) });
      } else if (apiSubmissionResult.stderr) {
        callback({ apiStatus: "error", message: atob(apiSubmissionResult.stderr) });
      } else {
        callback({
            apiStatus: "success",
            data: apiSubmissionResult, // pass the whole object, not just stdout
          });
      }
    }
  } catch (error: any) {
    callback({ apiStatus: "error", message: error.message || JSON.stringify(error) });
  }
}
