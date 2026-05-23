import { useRef } from "react";
import mammoth from "mammoth";

function ResumeUpload({ onResumeLoad, resumeText }) {
  const fileRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      onResumeLoad(result.value);
    } else if (file.type === "text/plain") {
      const text = await file.text();
      onResumeLoad(text);
    } else {
      alert("Please upload a DOCX or TXT file for now.");
    }
  };

  return (
    <div className="card">
      <h2>Your Resume</h2>
      {!resumeText ? (
        <div className="upload-area" onClick={() => fileRef.current.click()}>
          <p>Click to upload your resume</p>
          <span>DOCX or TXT supported</span>
          <input
            ref={fileRef}
            type="file"
            accept=".docx,.txt"
            onChange={handleFile}
            style={{ display: "none" }}
          />
        </div>
      ) : (
        <div className="resume-loaded">
          <p>✅ Resume loaded successfully</p>
          <button onClick={() => onResumeLoad("")}>Upload different resume</button>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;