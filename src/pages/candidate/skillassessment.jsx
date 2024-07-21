import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SkillAssessment({ skill }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching questions for skill:', skill);

        const post = { skill };
        const response = await axios.post('http://localhost:3000/api/assessment', post);

        console.log('Response from API:', response.data);

        const quizData = response.data.quizData.map((q, index) => ({
          id: index,
          text: q.question,
          options: q.options,
        }));

        setQuestions(quizData);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError(error.message || 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [skill]);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Skill Assessment for <span className="text-blue-800">{skill}</span>
        </h1>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin border-t-4 border-blue-600 border-solid rounded-full w-16 h-16"></div>
            <p className="ml-4 text-lg text-blue-600">Loading questions...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-600">
            <p className="text-lg">{error}</p>
          </div>
        ) : (
          questions.length > 0 && (
            <div className="bg-white border border-blue-200 rounded-md p-4 shadow-md">
              <h2 className="text-lg font-semibold mb-4">Questions:</h2>
              {questions.map((question) => (
                <div key={question.id} className="mb-4">
                  <p className="text-md font-medium">{question.text}</p>
                  {question.options && question.options.map((option, index) => (
                    <p key={index} className="text-md ml-4">{option}</p>
                  ))}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default SkillAssessment;
