import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import this to get the current user
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Add icons for pass/fail

function SkillAssessment() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScoreDialog, setShowScoreDialog] = useState(false);
  const [passStatus, setPassStatus] = useState(''); // Pass/Fail status
  const location = useLocation();
  const navigate = useNavigate();
  const { skill } = location.state || {};
  const hasGeneratedQuestions = useRef(false);
  const [assessmentId, setAssessmentId] = useState(null);

  useEffect(() => {
    if (skill && !hasGeneratedQuestions.current) {
      handleGenerateQuestions(skill);
      hasGeneratedQuestions.current = true;
    }
  }, [skill]);

  async function handleGenerateQuestions(skill) {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://werky-backend.onrender.com/api/assessment', { skill });
      const quizData = response.data;
      setQuestions(quizData.questions);
      setAnswers({});
      setAssessmentId(quizData.id);
    } catch (error) {
      setError("An error occurred while generating questions");
    }

    setLoading(false);
  }

  function handleAnswerChange(questionIndex, option) {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: option
    }));
  }

  function isAllAnswered() {
    return questions.length > 0 && questions.length === Object.keys(answers).length;
  }

  function calculateScore() {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount += 1;
      }
    });
    return correctCount;
  }

  async function handleSubmit() {
    if (assessmentId) {
      try {
        const userScore = calculateScore();
        await updateDoc(doc(db, 'assessment', assessmentId), {
          response: answers,
          score: userScore
        });

        // Determine pass/fail based on the score
        const status = userScore >= 8 ? 'Passed' : 'Failed';
        setPassStatus(status);

        // Update user document if passed
        if (status === 'Passed') {
          const auth = getAuth(); // Get authentication instance
          const user = auth.currentUser; // Get current user

          if (user) {
            const userDocRef = doc(db, 'users', user.uid); // Get user document reference

            // Fetch the existing user document
            const userDoc = await getDoc(userDocRef);
            const userData = userDoc.data();

            // Append the new badge to the existing badges field
            const existingBadges = userData.badges ? userData.badges.split(',') : [];
            if (!existingBadges.includes(skill)) {
              existingBadges.push(skill);
              await updateDoc(userDocRef, {
                badges: existingBadges.join(',')
              });
            }
          }
        }

        setScore(userScore);
        setShowScoreDialog(true);
      } catch (error) {
        console.error("Error saving responses and score:", error);
      }
    }
  }

  function handleDialogClose() {
    navigate('/dashboard/profile');
  }

  const dialogStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
  };

  const passStyle = {
    color: 'green',
    fontSize: '2rem',
  };

  const failStyle = {
    color: 'red',
    fontSize: '2rem',
  };

  const progressBarStyle = {
    height: '10px',
    borderRadius: '5px',
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
    margin: '1rem 0',
  };

  const progressStyle = {
    height: '100%',
    width: `${(score / questions.length) * 100}%`,
    backgroundColor: score >= 8 ? 'green' : 'red',
    transition: 'width 0.3s ease',
  };

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
              {questions.map((question, index) => (
                <div key={index} className="mb-4">
                  <p className="text-md font-medium">{question.question}</p>
                  {question.options.map((option, idx) => (
                    <div key={idx} className="ml-4">
                      <input 
                        type="radio" 
                        id={`q${index}_o${idx}`} 
                        name={`question${index}`} 
                        value={option} 
                        checked={answers[index] === option}
                        onChange={() => handleAnswerChange(index, option)}
                      />
                      <label htmlFor={`q${index}_o${idx}`} className="ml-2">{option}</label>
                    </div>
                  ))}
                </div>
              ))}
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={handleSubmit} 
                  disabled={!isAllAnswered()}
                  className={`py-2 px-4 rounded-lg font-semibold text-white ${isAllAnswered() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                >
                  Submit
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {showScoreDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div style={dialogStyle}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: passStatus === 'Passed' ? 'green' : 'red' }}>
              <span className="mr-2">
                {passStatus === 'Passed' ? <FaCheckCircle style={passStyle} /> : <FaTimesCircle style={failStyle} />}
              </span>
              {passStatus === 'Passed' ? 'Congratulations!' : 'Sorry!'}
            </h2>
            <p className="text-xl mb-4">You scored <span className="font-bold">{score}</span> out of <span className="font-bold">{questions.length}</span></p>
            <div style={progressBarStyle}>
              <div style={progressStyle}></div>
            </div>
            <button 
              onClick={handleDialogClose} 
              className="py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SkillAssessment;
