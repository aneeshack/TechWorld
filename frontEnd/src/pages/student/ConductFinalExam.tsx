import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CLIENT_API } from "../../utilities/axios/Axios";
import { IAssessment } from "../../types/ICourse";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const ConductFinalExam = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<IAssessment[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number | null }>({});
  const [score, setScore] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const totalQuestions = questions.length;
  const user = useSelector((state:RootState)=>state.auth.data)
  const [correctAnswer, setCorrectAnswer]= useState<number>(0)
  useEffect(() => {
    if(!courseId) return;

    const fetchAssessment = async () => {
      CLIENT_API.get(`/student/course/${courseId}`)
        .then((response) => {
          const course = response.data.data;
          if (course.finalAssessment && course.finalAssessment.length > 0) {
            setQuestions(course.finalAssessment);
            setTotalScore(course.finalAssessment.length); // Set total possible score based on number of questions
          } else {
            toast.error("No assessment found for this course");
            navigate(`/student/dashboard/courses`);
          }
        })
        .catch((error) => {
          console.error("Error fetching assessment:", error);
          toast.error("Failed to load assessment");
        });
    };

    fetchAssessment();
  }, [courseId, navigate]);

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
    setCorrectAnswer(correctAnswer)

// Calculate score as percentage
const percentageScore = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    setScore(percentageScore);
    

    setSubmitted(true);

    try {
      CLIENT_API.post(`/student/course/finalExam/${courseId}`,{
        userId:user?._id,
        courseId,
        score:percentageScore
      })
      .then((response)=>{
        console.log('response',response.data.data)
      })
      .catch((error)=>{
        console.log('unexpected error',error)
      })

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
          <h2 className="text-2xl font-bold text-blue-600">Your Score: {correctAnswer} out of {totalScore}</h2>
          <h3 className="text-xl text-green-600 mt-2">
            Percentage: {score?.toFixed(0)}%
          </h3>
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

export default ConductFinalExam;