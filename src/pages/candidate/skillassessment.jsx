import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { LightBulbIcon, FaceSmileIcon, FaceFrownIcon } from '@heroicons/react/24/solid';
import { Dialog as MuiDialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Tooltip, Button } from '@material-tailwind/react';
import './profile.css';

function SkillAssessment() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScoreDialog, setShowScoreDialog] = useState(false);
  const [openSkillTest, setOpenSkillTest] = useState(false);
  const [openLevelDialog, setOpenLevelDialog] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [passStatus, setPassStatus] = useState('');
  const navigate = useNavigate();
  const hasGeneratedQuestions = useRef(false);
  const [assessmentId, setAssessmentId] = useState(null);

  const skills = [
    { name: 'Project Management', description: 'Manage projects effectively.' },
    { name: 'DevOps', description: 'DevOps practices and tools.' },
    { name: 'Content Writing', description: 'Creating and managing content.' },
    { name: 'Video Editing', description: 'Editing video content.' },
    { name: 'Marketing', description: 'Marketing strategies and implementation.' },
    { name: 'Technical Writing', description: 'Writing technical documentation.' },
    { name: 'SQA', description: 'Software Quality Assurance.' },
    { name: 'Graphic Designing', description: 'Knowledge of graphics.' },
  ];

  useEffect(() => {
    if (selectedSkill && !hasGeneratedQuestions.current) {
      handleGenerateQuestions(selectedSkill, selectedLevel);
      hasGeneratedQuestions.current = true;
    }
  }, [selectedSkill, selectedLevel]);

  async function handleGenerateQuestions(skill, level) {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://werkee-backend.onrender.com/api/assessment', { skill, level });
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

  async function handleSubmit() {
    if (assessmentId) {
      try {
        const assessmentDocRef = doc(db, 'assessment', assessmentId);
        const assessmentDoc = await getDoc(assessmentDocRef);
        const assessmentData = assessmentDoc.data();
        const quizData = assessmentData.quizData;

        if (!quizData || !quizData.questions) {
          throw new Error("No quiz data found.");
        }

        const userScore = calculateScore(quizData.questions);
        await updateDoc(assessmentDocRef, {
          response: answers,
          score: userScore
        });

        const status = userScore >= 8 ? 'Passed' : 'Failed';
        setPassStatus(status);

        if (status === 'Passed') {
          const auth = getAuth();
          const user = auth.currentUser;

          if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            const userData = userDoc.data();
            const existingBadges = userData.badges ? userData.badges : [];
            if (!existingBadges.includes(selectedSkill)) {
              existingBadges.push(selectedSkill);
              await updateDoc(userDocRef, {
                badges: existingBadges
              });
            }
          }
        }
        setScore(userScore);
        setShowScoreDialog(true);
      } catch (error) {
        console.error("Error saving responses and score:", error);
        setError("An error occurred while processing your submission.");
      }
    }
  }

  function calculateScore(questions) {
    let correctCount = 0;

    questions.forEach((question, index) => {
      const correctAnswer = question.correctAnswer;
      const userAnswer = answers[index];

      if (userAnswer === correctAnswer) {
        correctCount += 1;
      }
    });

    return correctCount;
  }

  function handleSkillSelect(skill) {
    setSelectedSkill(skill);
    setOpenSkillTest(false);
  }

  function handleLevelSelect(level) {
    setSelectedLevel(level);
    setOpenLevelDialog(false);
    setOpenSkillTest(true);
  }

  function handleDialogClose() {
    if (passStatus === 'Passed') {
      navigate('/dashboard/profile');
    } else {
      setShowScoreDialog(false);
      setOpenLevelDialog(true);
      setSelectedSkill(null);
      setSelectedLevel(null);
      hasGeneratedQuestions.current = false;
    }
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
    color: 'teal',
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
    backgroundColor: score >= 8 ? 'teal' : 'red',
    transition: 'width 0.3s ease',
  };

  return (
    <div className="bg-gradient-to-r from-teal-50 to-gray-100 min-h-screen p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: '#3cacae' }}>
          Skill Assessment for <span style={{ color: '#545454' }}>{selectedSkill}</span>
        </h1>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin border-t-4 border-gray-600 border-solid rounded-full w-16 h-16"></div>
            <p className="ml-4 text-lg text-gray-600">Loading questions...</p>
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
                  className={`py-2 px-4 rounded-lg font-semibold text-white ${isAllAnswered() ? 'bg-gray-600 hover:bg-teal-700' : 'bg-gray-400 cursor-not-allowed'}`}
                >
                  Submit
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* Level Selection Dialog */}
      <MuiDialog open={openLevelDialog}>
        <DialogTitle>Select Your Level</DialogTitle>
        <DialogContent>
          <div className="space-y-4">
            {['Entry', 'Basic', 'Intermediate', 'Advanced'].map((level) => (
              <Button
                key={level}
                onClick={() => handleLevelSelect(level)}
                color="teal"
                fullWidth
              >
                {level}
              </Button>
            ))}
          </div>
        </DialogContent>
      </MuiDialog>

      <MuiDialog open={openSkillTest} onClose={() => setOpenSkillTest(false)} fullWidth maxWidth="sm">
        <DialogTitle className="flex items-center gap-2 text-gray-600">
          <LightBulbIcon className="h-6 w-6" style={{ color: '#3cacae' }} />
          Select a Skill
        </DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-2 gap-4 p-4">
            {skills.map((skill) => (
              <Tooltip key={skill.name} title={skill.description} placement="top">
                <Button
                  variant={selectedSkill === skill.name ? 'filled' : 'outlined'}
                  color={selectedSkill === skill.name ? 'blue' : 'gray'}
                  onClick={() => handleSkillSelect(skill.name)}
                  className={`transition-transform duration-300 transform ${
                    selectedSkill === skill.name ? 'scale-105' : 'scale-100'
                  }`}
                >
                  {skill.name}
                </Button>
              </Tooltip>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate('/dashboard/home')} color="gray">
            Close
          </Button>
        </DialogActions>
      </MuiDialog>

      {showScoreDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div style={dialogStyle}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: passStatus === 'Passed' ? 'teal' : 'red' }}>
              <span className="mr-2">
                {passStatus === 'Passed' ? <FaceSmileIcon className="h-10 w-10 inline" style={passStyle} /> : <FaceFrownIcon className="h-10 w-10 inline" style={failStyle} />}
              </span>
              {passStatus === 'Passed' ? 'Congratulations!' : 'Sorry!'}
            </h2>
            <p className="text-xl mb-4">You scored <span className="font-bold">{score}</span> out of <span className="font-bold">{questions.length}</span></p>
            <div style={progressBarStyle}>
              <div style={progressStyle}></div>
            </div>
            <button 
              onClick={handleDialogClose} 
              className="py-2 px-4 bg-gray-600 text-white rounded-lg font-semibold hover:bg-teal-700"
            >
              {passStatus === 'Passed' ? 'OK' : 'Try Again'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SkillAssessment;
