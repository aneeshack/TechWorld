
const AddLesson = () => {
  return (
    <div className="w-xl lg:w-5/6 mx-auto p-6">
      <a href="/instructor/dashboard/addLesson" className="flex justify-end">
          <button className="border bg-green-700 p-4 rounded-lg text-white font-semibold">
            Add Assessment
          </button>
        </a>
      <h2 className="text-2xl font-semibold mb-4">Lesson 1 : Cooking Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 md:col-span-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Lesson Title</label>
            <input type="text" className="mt-1 w-full p-2 border rounded-lg" placeholder="Enter lesson title" />
          </div>
        </div>

        {/* Lesson Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Lesson Thumbnail</label>
          <div className="mt-2 flex items-center justify-center border-2 border-dashed border-green-400 rounded-lg h-40">
            <span className="text-green-600">Upload thumbnail</span>
          </div>
        </div>

        {/* Lesson Attachments */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Lesson Attachments</label>
          <input type="text" className="mt-1 w-full p-2 border rounded-lg" placeholder="Enter attachment link" />
          <div className="mt-2 flex items-center justify-center border-2 border-dashed border-green-400 rounded-lg h-20">
            <span className="text-green-600">Upload attachment</span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Lesson Description</label>
        <textarea className="mt-1 w-full p-2 border rounded-lg" placeholder="Enter lesson description" ></textarea>
      </div>

      {/* Lesson Resources */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Lesson Resources</label>
        <div className="mt-2 flex items-center justify-center border-2 border-dashed border-green-400 rounded-lg h-40">
          <span className="text-green-600">Upload content</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex space-x-4">
        <button className="px-4 py-2 border border-green-600 text-green-600 rounded-lg">Cancel</button>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg">Add Lesson</button>
      </div>
    </div>
  );
};

export default AddLesson;
