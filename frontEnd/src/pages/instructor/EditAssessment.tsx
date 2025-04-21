import { useState, useEffect } from "react";
import { IAssessment } from "../../types/ICourse";
import { CLIENT_API } from "../../utilities/axios/Axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function EditAssessment() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<IAssessment[]>([]);

  useEffect(() => {
    if (lessonId) {
      CLIENT_API.get(`/instructor/lesson/${lessonId}`)
        .then((response) => {
          const lesson = response.data.data;
          if (lesson.assessment && lesson.assessment.length > 0) {
            setQuestions(lesson.assessment);
          } else {
            toast.error("No assessment found for this lesson");
            navigate(`/instructor/dashboard/addAssessment/${lessonId}`);
          }
        })
        .catch((error) => {
          console.error("Error fetching assessment:", error);
          toast.error("Failed to load assessment");
        });
    }
  }, [lessonId, navigate]);

  const handleQuestionChange = (qIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].question = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    if (!updatedQuestions[qIndex].options) updatedQuestions[qIndex].options = []; 
    updatedQuestions[qIndex].options[oIndex].text = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswer = (qIndex: number, oIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options = updatedQuestions[qIndex].options?.map((opt, i) => ({
        ...opt,
        isCorrect: i === oIndex, 
      }));;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    if (questions.length < 5) {
      setQuestions([
        ...questions,
        {
          question: "",
          options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        },
      ]);
    }
  };

  const saveAssessment = async () => {
    if (questions.length === 0) {
      toast.error("Please add at least one question before saving.");
      return;
    }
    const isValid = questions.every((q) =>{
    //   q.question?.trim() !== "" && q.options?.some((opt) => opt.text.trim() !== "")
    const hasQuestionText = q.question?.trim() !== "";
      const hasValidOption = q.options?.some((opt) => opt.text.trim() !== "");
      const hasCorrectAnswer = q.options?.some((opt) => opt.isCorrect === true);
      return hasQuestionText && hasValidOption && hasCorrectAnswer;
  });

    if (!isValid) {
      toast.error("Each question must have text and at least one valid option.");
      return;
    }

    try {
      const response = await CLIENT_API.post(`/instructor/lesson/${lessonId}/assessment`, { questions });
      toast.success(response.data.message);
      navigate("/instructor/dashboard/courses");
    } catch (error) {
      console.error("Error updating assessment:", error);
      toast.error("Failed to update assessment");
    }
  };


   // Delete a question
   const deleteQuestion = (qIndex: number) => {
    if (questions.length === 1) {
      toast.error("At least one question is required.");
      return;
    }
    const updatedQuestions = questions.filter((_, index) => index !== qIndex);
    setQuestions(updatedQuestions);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-700 text-center mb-4">Edit Assessment</h2>

        {questions.map((question, qIndex) => (
          <div key={qIndex} className="mb-6">
            <div className="flex justify-between items-center">
            <label className="block text-green-700 font-semibold mb-1">
              Question {qIndex + 1}
            </label>
            {questions.length > 1 && (
                <button
                  className="text-red-600 hover:text-red-800 font-semibold"
                  onClick={() => deleteQuestion(qIndex)}
                >
                  Delete
                </button>
              )}
            </div>
            <textarea
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={question.question}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
            />
            <div className="mt-4">
              <label className="block text-green-700 font-semibold mb-1">Options</label>
              {question?.options?.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder={`Option ${oIndex + 1}`}
                    value={option.text}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                  />
                  <input
                    type="radio"
                    name={`correctAnswer-${qIndex}`}
                    checked={option.isCorrect}
                    onChange={() => handleCorrectAnswer(qIndex, oIndex)}
                    className="h-5 w-5 text-green-500"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {questions.length < 5 && (
          <button
            className="w-full mt-2 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={addQuestion}
          >
            + Add Question
          </button>
        )}

        <button
          className="w-full mt-6 bg-green-700 text-white font-bold py-2 rounded-lg hover:bg-green-800 transition"
          onClick={saveAssessment}
        >
          Update Assessment
        </button>
      </div>
    </div>
  );
}