import { useEffect, useState } from "react";
import { CLIENT_API } from "../../utilities/axios/Axios";
import { CategoryEntity } from "../../types/ICategories";
import { Link } from "react-router-dom";

const Categories = () => {
  const [category, setCategory] = useState<CategoryEntity[]>([]);
  useEffect(() => {
    CLIENT_API.get("/admin/categories")
      .then((response) => {
        console.log("response", response);
        setCategory(response.data.data);
      })
      .catch((error) => {
        console.log("api error", error);
      });
  }, []);

  return (
    <div>
      <div className="flex py-10 justify-end px-10 ">
        <a href="/admin/dashboard/category/add">
          <button className="border bg-green-700 p-4 rounded-lg text-white font-semibold">
            {" "}
            Create Category
          </button>
        </a>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 p-8">
        {category.map((category, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-6 bg-white shadow-lg rounded-2xl hover:shadow-xl transition duration-300"
          >
            <img
              src={category.imageUrl}
              alt={category.categoryName}
              className="w-32 h-32 object-cover rounded-lg mb-4"
            />
            <p>{category.description}</p>
            <Link to={`/admin/dashboard/category/edit/${category._id}`} className="border-2 border-green-500 text-green-500 px-4 py-2 rounded-lg hover:bg-green-500 hover:text-white transition duration-300">
              {category.categoryName}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
