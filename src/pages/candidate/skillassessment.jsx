import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../../firebase/firebase";

function SkillAssessment({ skill }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Generate and store quiz data in Firestore
        const response = await axios.post('https://werky-backend.onrender.com/api/assessment', { skill });
        const { id } = response.data;

        // Fetch the quiz data from Firestore
        const docRef = doc(db, 'assessment', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const quizData = docSnap.data().quizData.map((q, index) => ({
            id: index,
            text: q.question,
            options: q.options,
          }));
          setQuestions(quizData);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [skill]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Skill Assessment for <span className="text-blue-600">{skill}</span>
      </h1>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {questions.length > 0 ? (
            questions.map((question) => (
              <div key={question.id} className="mb-4">
                <p className="font-medium">{question.text}</p>
                {question.options.map((option, index) => (
                  <p key={index} className="ml-4">{option}</p>
                ))}
              </div>
            ))
          ) : (
            <p>No questions available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SkillAssessment;
