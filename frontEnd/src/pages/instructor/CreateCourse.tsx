

const CreateCourse = () => {
  return (
    <div className="w-5xl lg:w-5/6 mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Create Course</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Course Thumbnail</label>
          <div className="mt-2 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-40">
            <span className="text-gray-400">Upload Thumbnail</span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Course Title</label>
            <input type="text" className="mt-1 w-full p-2 border rounded-lg" placeholder="Enter course title" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea className="mt-1 w-full p-2 border rounded-lg" placeholder="Enter course description" ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input type="text" className="mt-1 w-full p-2 border rounded-lg" placeholder="Enter category" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input type="number" className="mt-1 w-full p-2 border rounded-lg" placeholder="Enter amount" />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex space-x-4">
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg">Save Course</button>
        <button className="px-4 py-2 border border-green-600 text-green-600 rounded-lg">Add Lessons</button>
      </div>
    </div>
  );
};

export default CreateCourse;
