import { AbsoluteCenter, Box, Button, ProgressCircle } from "@chakra-ui/react";
import React, { useState } from "react";

const FileUploadWithProgress = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://vgallery.oss.net.bd/upload/view/jquery-file-upload/server/php/?PHPSESSID=3appp6kt4kkm86adgt7kgdpv1t"
    );

    // const token =
    //   "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJxWkdQdzZBQmV5aUNvTXlXT1pGS3ZKcWdnb21RUEU0SFJlSm9QYURNeDl3In0.eyJleHAiOjE3NDY3MzE5NTksImlhdCI6MTc0NjY4ODc1OSwiYXV0aF90aW1lIjoxNzQ2Njg4NzU2LCJqdGkiOiI5MjczMDFmYS1jZWFhLTQ4NDAtYjhmYS1lZjFiYjM3NGE4ZDIiLCJpc3MiOiJodHRwczovL3VhdC1iZXByYy5vc3MubmV0LmJkL2lkcC9yZWFsbXMvQkVQUkMiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiNTFmMGYzNjUtNzY2ZS00OThmLWFmNWUtZWJkMjhmNTgwMDc5IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYmVwcmMtcHVibGljIiwibm9uY2UiOiIzNGZmOWM0NC1jZGNmLTQ3ZTktOGMzOC01YjIzMTlkOGQ2MDkiLCJzZXNzaW9uX3N0YXRlIjoiZWU1ZTE0MmMtZTM3OS00ZDcwLWFmZWUtYjgzNzEyYWI2MGRhIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIqIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWJlcHJjIiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUiLCJzaWQiOiJlZTVlMTQyYy1lMzc5LTRkNzAtYWZlZS1iODM3MTJhYjYwZGEiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInByZWZlcnJlZF91c2VybmFtZSI6InN1cGVyYWRtaW5AYmVwcmMuY29tIiwiZ2l2ZW5fbmFtZSI6IiIsImZhbWlseV9uYW1lIjoiIn0.BXLtZ953PxqwoRODz_1mNA-t_Ggtb0t7cRMrLz_PlbEVX4oN4K1SdfW2XCLUniRn1hUpJCDTYidLrOXJ__5UTICj5gRiwsVb8h0UVvY-AMRH2hlx2D4OedXwVlRHYRyfhVz95CPWTlR8t8KkplhJn1xIi_rMYKB-dzGO5QY1l7sqHzUX-CaK_s8xQDeP8bdqtYKy4haQZTh8gAJQCOHc7Swh83xlQWu-cByey_CI5eOKV-gqLQAyK8EHUo7miVd3-BjvsEoHNtuzdd7wxMRjm6Ip1DnnCnon2qgG6BluooS8hRpp4osYucZpFyEUrAoaoqt0-N8IS6QiAWfwM1cu8w";
    // xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    // Track upload progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      }
    };

    xhr.onloadstart = () => setIsUploading(true);

    xhr.onloadend = () => {
      setIsUploading(false);
      if (xhr.status === 200) {
        alert("Upload successful");
        setUploadProgress(0);
        setFile(null);
      } else {
        alert("Upload failed");
      }
    };

    xhr.send(formData);
  };

  console.log(uploadProgress);

  return (
    <Box my={12} w={"full"}>
      <Box justifyContent={"center"} alignItems={"center"} flexDir={"column"}>
        <input type="file" onChange={handleFileChange} className="mb-4" />
        {file && (
          <>
            {/* <p className="mb-2">Selected file: {file.name}</p> */}
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </>
        )}
        {isUploading && (
          // <div className="mt-4">
          //   <div className="w-full bg-gray-200 rounded-full h-4">
          //     <div
          //       className="bg-blue-600 h-4 rounded-full transition-all duration-300"
          //       style={{ width: `${uploadProgress}%` }}
          //     />
          //   </div>
          //   <p className="text-sm mt-1 text-center">{uploadProgress}%</p>
          // </div>
          <ProgressCircle.Root size={"lg"} value={uploadProgress}>
            <ProgressCircle.Circle css={{ "--thickness": "5px" }}>
              <ProgressCircle.Track />
              <ProgressCircle.Range />
            </ProgressCircle.Circle>
            <AbsoluteCenter>
              <ProgressCircle.ValueText />
            </AbsoluteCenter>
          </ProgressCircle.Root>
        )}
      </Box>
    </Box>
  );
};

export default FileUploadWithProgress;
// import
