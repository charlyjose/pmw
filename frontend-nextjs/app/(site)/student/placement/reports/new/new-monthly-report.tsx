"use client";

import React from "react";
import { Provider as StyletronProvider } from "styletron-react";
import { LightTheme, BaseProvider } from "baseui";
import { styletron } from "./utilities/styletron";

import { FileUploader } from "baseui/file-uploader";

import axios from "axios";
import { toast } from "@/registry/new-york/ui/use-toast";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function NewMonthlyReport() {
  const { data: session } = useSession();
  const router = useRouter();

  const [isUploading, setIsUploading] = React.useState(false);
  const timeoutId = React.useRef<any>();

  // Validating client-side session
  if (!session) {
    router.push("/signin");
  }

  function reset() {
    setIsUploading(false);
    clearTimeout(timeoutId.current);
  }

  function startProgress() {
    setIsUploading(true);
    timeoutId.current = setTimeout(reset, 4000);
  }

  function handleFileUpload(files: File[]) {
    const formData = new FormData();
    formData.append("file", files[0]);

    function formatBytes(size) {
      var units = ["B", "KB", "MB", "GB", "TB"],
        bytes = size,
        i;

      for (i = 0; bytes >= 1024 && i < 4; i++) {
        bytes /= 1024;
      }
      return bytes.toFixed(2) + units[i];
    }

    var file_details = {
      name: files[0].name,
      size: `${formatBytes(files[0].size)}`,
      type: files[0].type,
    };

    const API_URI = "http://localhost:8000";
    axios
      .post(`${API_URI}/api/placement/reports/new/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        toast({
          title: "File uploaded successfully",
          description: (
            <>
              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <code className="text-white">
                  {JSON.stringify(file_details, null, 2)}
                </code>
              </pre>
            </>
          ),
        });
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong. File upload failed",
          description: (
            <>
              <pre className="mt-2 w-[340px] rounded-md bg-white p-4">
                <code className="text-black">
                  {JSON.stringify(file_details, null, 2)}
                </code>
              </pre>
              <pre className="mt-2 w-[340px] rounded-md bg-white p-4">
                <code className="text-black">
                  {JSON.stringify(error.message, null, 2)}
                </code>
              </pre>
            </>
          ),
        });
      });
  }

  return (
    <>
      <StyletronProvider value={styletron}>
        <BaseProvider theme={LightTheme}>
          <FileUploader
            onCancel={reset}
            onDrop={(acceptedFiles, rejectedFiles) => {
              handleFileUpload(acceptedFiles);
              startProgress();
            }}
            progressMessage={isUploading ? `Uploading...` : ""}
          />
        </BaseProvider>
      </StyletronProvider>
    </>
  );
}
