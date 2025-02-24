import { useState } from "react";

export default function Assessment() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([{ text: "", isCorrect: false }]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleCorrectAnswer = (index) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, { text: "", isCorrect: false }]);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-700 text-center mb-4">
          Add Assessment
        </h2>
        <div>
          <label className="block text-green-700 font-semibold mb-1">
            Question
          </label>
          <textarea
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            rows="3"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <label className="block text-green-700 font-semibold mb-1">
            Options
          </label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={`Option ${index + 1}`}
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
              <input
                type="radio"
                name="correctAnswer"
                checked={option.isCorrect}
                onChange={() => handleCorrectAnswer(index)}
                className="h-5 w-5 text-green-500"
              />
            </div>
          ))}
          {options.length < 4 && (
            <button
              className="w-full mt-2 bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
              onClick={addOption}
            >
              + Add Option
            </button>
          )}
        </div>

        <button
          className="w-full mt-6 bg-green-700 text-white font-bold py-2 rounded-lg hover:bg-green-800 transition"
        >
          Save Assessment
        </button>
      </div>
    </div>
  );
}
