const categories = [
  { title: "Web Development", image: "\ud83d\udcbb" },
  { title: "Mobile Development", image: "\ud83d\udcf2" },
  { title: "Cyber Security", image: "\ud83d\udc68\u200d\ud83d\udd27" },
  { title: "Songs", image: "\ud83c\udfb5" },
  { title: "Figma Training", image: "\ud83d\udd8c\ufe0f" },
];

const CardGrid = () => {
  return (
    <div>
      <div className="flex py-10 justify-end px-10 ">
         <a href='/admin/dashboard/categories/add'><button className="border bg-green-700 p-4 rounded-lg text-white font-semibold"> Create Category</button></a>
       </div>
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 p-8">
      
      {categories.map((category, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center p-6 bg-white shadow-lg rounded-2xl hover:shadow-xl transition duration-300"
        >
          <div className="text-5xl mb-4">{category.image}</div>
          <button className="border-2 border-green-500 text-green-500 px-4 py-2 rounded-lg hover:bg-green-500 hover:text-white transition duration-300">
            {category.title}
          </button>
        </div>
      ))}
    </div>
    </div>
  );
};

export default CardGrid;
