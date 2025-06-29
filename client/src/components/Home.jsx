import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiInstance from "../apiInstance";
import moment from "moment";
import { toast } from "react-toastify";

const Home = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null); // 🆕
  const navigate = useNavigate();

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const getUserData = async () => {
    try {
      const response = await apiInstance.get("/getUserData", config);
      setUserData(response.data.foundUser);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    setDeletingId(id);
    try {
      const response = await apiInstance.delete(`/delete/${id}`, config);
      if (response.data.deletedUser) {
        toast.success("User deleted successfully");
        getUserData();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const SkeletonCard = () => (
    <div className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
      <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-gray-300 rounded w-24"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Uploaded Files</h1>
          <button
            onClick={() => navigate("/upload")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm md:text-base font-medium shadow transition"
          >
            + Add New
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : userData.length > 0 ? (
            userData.map(
              ({
                username,
                _id,
                fileUrl,
                fileType,
                uploadDate,
                originalName,
              }) => (
                <div
                  key={_id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-200"
                >
                  {fileType === "image" && (
                    <img
                      src={fileUrl}
                      alt={originalName}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  {fileType === "video" && (
                    <video
                      controls
                      src={fileUrl}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  {fileType === "pdf" && (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-semibold underline"
                      >
                        View PDF
                      </a>
                    </div>
                  )}
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {username}
                    </h2>
                    <p className="text-sm text-gray-500 mb-3">
                      Uploaded on: {moment(uploadDate).format("LL")}
                    </p>
                    <button
                      onClick={() => handleDeleteUser(_id)}
                      className={`flex items-center justify-center gap-2 text-white cursor-pointer ${
                        deletingId === _id
                          ? "bg-red-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      } px-4 py-2 text-sm rounded-md font-medium transition `}
                      disabled={deletingId === _id}
                    >
                      {deletingId === _id ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 text-white"
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
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </div>
              )
            )
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No uploaded files found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
