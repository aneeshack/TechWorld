import { useLocation } from "react-router-dom";

const InstructorView = () => {
  const location = useLocation();
  const request = location.state?.request;

  if (!request) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        No Data Found
      </div>
    );
  }

  return (
    <div className="my-10 bg-white shadow-xl rounded-lg overflow-hidden max-w-xl w-full">
      {/* Profile Header */}
      <div className="bg-green-800 p-6 text-center">
        <img
          src={request.profile?.avatar || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-md"
        />
        <h2 className="text-xl font-semibold text-white mt-3">
          {request.userName}
        </h2>
        <p className="text-gray-200">{request.email}</p>
      </div>

      {/* Profile Details */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Instructor Information
        </h3>

        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="mb-2">
            <strong className="text-gray-600">Name:</strong> {request.userName}
          </p>
          <p className="mb-2">
            <strong className="text-gray-600">Email:</strong> {request.email}
          </p>
          <p className="mb-2">
            <strong className="text-gray-600">Profile Description:</strong>{" "}
            {request.profile?.profileDescription || "N/A"}
          </p>
          <p className="mb-2">
            <strong className="text-gray-600">CV:</strong>{" "}
            {request.cv ? (
              <a
                href={request.cv}
                // download 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View CV
              </a>
            ) : (
              "N/A"
            )}
          </p>
          <p className="mb-2">
            <strong className="text-gray-600">Address:</strong>
            <ul className="list-none  pl-16">
              <li>{request.contact?.address?.street || "N/A"}</li>
              <li>{request.contact?.address?.city || "N/A"}</li>
              <li>{request.contact?.address?.state || "N/A"}</li>
              <li>{request.contact?.address?.country || "N/A"}</li>
              <li>{request.contact?.address?.pinCode || "N/A"}</li>
            </ul>
          </p>
        </div>

        <button
          onClick={() => window.history.back()}
          className="mt-6 w-full bg-green-800 hover:bg-green-600 text-white font-semibold py-2 rounded-lg shadow-md transition-all"
        >
          Go Back
        </button>
      </div>
    </div>
    // </div>
  );
};

export default InstructorView;
