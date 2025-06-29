import { useState, useRef } from "react";
import apiInstance from "../apiInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Upload = () => {
  const [userName, setUserName] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const handleFileChange = (file) => {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }

    setUploadFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName || !uploadFile) {
      toast.error("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("file", uploadFile);

    try {
      setIsUploading(true);
      const response = await apiInstance.post("/upload", formData);

      if (response.status === 201) {
        toast.success("File uploaded successfully!");
        setUserName("");
        setUploadFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        navigate("/");
      } else {
        toast.error("Upload failed!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An error occurred while uploading.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-md p-8">
        <h2 className="text-center text-3xl font-semibold text-blue-600 mb-6">
          Upload to ImageKit
        </h2>

        <form
          onSubmit={handleSubmit}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="space-y-6"
        >
          {/* Username Input */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Your Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Gaurav"
              disabled={isUploading}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400 outline-none transition"
            />
          </div>

          {/* File Input */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Upload File (image/video/pdf)
            </label>
            <div className="border-2 border-dashed border-blue-300 rounded-md p-4 text-center bg-gray-50 hover:bg-blue-50 transition">
              <input
                type="file"
                accept="image/*,video/*,.pdf"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e.target.files[0])}
                disabled={isUploading}
                className="w-full text-sm file:bg-blue-600 file:text-white file:rounded-md file:px-4 file:py-2 file:border-none file:cursor-pointer hover:file:bg-blue-700"
              />
              <p className="text-sm text-gray-500 mt-3">
                Or drag & drop your file here
              </p>

              {/* Preview Info */}
              {uploadFile && (
                <div className="mt-4 text-left">
                  <div className="font-medium text-gray-700">
                    {uploadFile.name}
                  </div>
                  <div className="text-sm text-blue-600 inline-block mt-1 px-2 py-1 rounded-full bg-blue-100">
                    {uploadFile.type}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadFile(null);
                      setPreviewUrl(null);
                      fileInputRef.current.value = "";
                    }}
                    className="ml-2 text-xs text-red-500 hover:underline"
                  >
                    Reset
                  </button>

                  {previewUrl && (
                    <div className="mt-4">
                      {uploadFile.type.startsWith("image/") && (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-48 object-contain rounded-md border"
                        />
                      )}
                      {uploadFile.type.startsWith("video/") && (
                        <video
                          controls
                          src={previewUrl}
                          className="w-full h-48 rounded-md border"
                        />
                      )}
                      {uploadFile.type === "application/pdf" && (
                        <iframe
                          src={previewUrl}
                          title="PDF Preview"
                          className="w-full h-48 rounded-md border"
                        ></iframe>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Upload Button */}
          <button
            type="submit"
            disabled={isUploading}
            className={`w-full flex justify-center items-center gap-2 py-2 px-4 rounded-md text-white font-semibold transition ${
              isUploading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isUploading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
