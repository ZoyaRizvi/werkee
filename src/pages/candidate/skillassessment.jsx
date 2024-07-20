import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function SkillAssessment() {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { skill } = location.state || {};

  useEffect(() => {
    if (skill) {
      generateQuestions(skill);
    }
  }, [skill]);

  async function generateQuestions(skill) {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBK9A3pPDR_lduTqoiBFFn4DUe-P9y8Kk4`,
        {
          contents: [
            {
              parts: [
                { text: `Generate 10 MCQ questions related to ${skill}` },
              ],
            },
          ],
        }
      );

      console.log('API response:', response.data);

      if (response.data && response.data.candidates && response.data.candidates[0]) {
        const contentParts = response.data.candidates[0].content.parts;
        if (contentParts && contentParts[0] && typeof contentParts[0].text === 'string') {
          const questionsText = contentParts[0].text;

          // Split the text into individual questions based on newline characters
          const questionsArray = questionsText.split('\n').filter(q => q.trim() !== '');
          const formattedQuestions = questionsArray.map((q, index) => ({
            id: index,
            text: q,
          }));

          setQuestions(formattedQuestions);
        } else {
          throw new Error('The content parts do not contain a valid string');
        }
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      setError(error.message || "An error occurred while generating questions");
    }

    setLoading(false);
  }

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
