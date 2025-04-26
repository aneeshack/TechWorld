import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CLIENT_API } from "../../utilities/axios/Axios";
import { IAssessment } from "../../types/ICourse";
import { toast } from "react-toastify";

const ConductAssessment = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<IAssessment[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number | null }>({});
  const [score, setScore] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if(!lessonId) return;

    const fetchAssessment = async () => {
      CLIENT_API.get(`/student/lesson/${lessonId}`)
        .then((response) => {
          const lesson = response.data.data;
          if (lesson.assessment && lesson.assessment.length > 0) {
            setQuestions(lesson.assessment);
            setTotalScore(lesson.assessment.length); // Set total possible score based on number of questions
          } else {
            toast.error("No assessment found for this lesson");
            navigate(`/student/dashboard/courses`);
          }
        })
        .catch((error) => {
          console.error("Error fetching assessment:", error);
          toast.error("Failed to load assessment");
        });
    };

    fetchAssessment();
  }, [lessonId, navigate]);

  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmit = async () => {
    let correctAnswers = 0;

    questions.forEach((question, index) => {
      const selectedOptionIndex = selectedAnswers[index];
      if (question.options && selectedOptionIndex !== null && question.options[selectedOptionIndex]?.isCorrect) {
        correctAnswers++;
      }
    });

    setScore(correctAnswers);
    

    setSubmitted(true);

    try {


      toast.success("Assessment submitted successfully!");
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast.error("Failed to submit assessment.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Assessment</h1>

      {!submitted ? (
        <div>
          {questions.map((question, questionIndex) => (
            <div key={questionIndex} className="mb-6 p-4 border rounded-md shadow">
              <p className="font-semibold">{questionIndex + 1}. {question.question}</p>

              <div className="mt-3">
                {question.options?.map((option, optionIndex) => (
                  <label key={optionIndex} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${questionIndex}`}
                      value={optionIndex}
                      checked={selectedAnswers[questionIndex] === optionIndex}
                      onChange={() => handleOptionSelect(questionIndex, optionIndex)}
                      className="form-radio text-blue-600"
                    />
                    <span>{option.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Submit Assessment
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-600">Your Score: {score} out of {totalScore}</h2>
          <p className="mt-2 text-gray-600">
            {score !== null && score >= totalScore * 0.7 ? 
              "Congratulations! You passed the assessment." : 
              "Keep practicing to improve your score."}
          </p>
          <button
            onClick={() => navigate("/student/dashboard/courses")}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
          >
            Back to Courses
          </button>
        </div>
      )}
    </div>
  );
};

export default ConductAssessment;