import { useEffect, useState } from 'react';
import { CLIENT_API } from '../../utilities/axios/Axios';
import { ICourse } from '../../types/ICourse';
import { motion } from 'framer-motion';

const Content = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    CLIENT_API.get("/user/allCourses")
      .then((response) => {
        setCourses(response.data.data);
      })
      .catch((error) => {
        console.error("API error", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y:60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12
      }
    }
  };

  return (
    <section className="bg-gradient-to-b from-white to-green-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-center text-green-900 mb-2">Explore Our Design Courses</h2>
          <p className="text-center text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
            Discover our carefully crafted courses designed to elevate your skills and unlock your creative potential.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-900"></div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {courses.length === 0 ? (
              <p className="text-center text-gray-500 text-xl col-span-3">No courses found</p>
            ) : (
              courses.map((course) => (
                <motion.div
                  key={course._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:shadow-2xl hover:scale-105"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative">
                    <img 
                      className="h-48 w-full object-cover" 
                      src={course.thumbnail} 
                      alt={course.title} 
                    />
               
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-green-900 mb-2">{course.title}</h3>
                    {course.rating && course.rating > 0 ? (
                      <div className="flex items-center mb-3">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            className={`text-yellow-500 text-lg ${i < (course.rating || 0) ? 'opacity-100' : 'opacity-30'}`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="ml-2 text-gray-600 text-sm">({course.rating.toFixed(1)})</span>
                      </div>
                    ) : ''}
                    <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <a 
                        href={`/courseDetail/${course._id}`} 
                        className="inline-block bg-green-100 hover:bg-green-700 text-green-800 hover:text-white font-medium px-4 py-2 rounded-lg transition-colors duration-300"
                      >
                        View Details
                      </a>
                     
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Content;