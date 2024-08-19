import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function Counsellor() {
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([]);
    const [generatingAnswer, setGeneratingAnswer] = useState(false);
    const [conversationStarted, setConversationStarted] = useState(false); // Track if conversation has started
  
    // Helper function to construct conversation history as a string
    const getConversationHistory = () => {
      return messages
        .map(msg => (msg.sender === 'user' ? `User: ${msg.text}` : `Bot: ${msg.text}`))
        .join('\n');
    };
  
    async function generateAnswer(e) {
      e.preventDefault();
      if (!question.trim()) return;
  
      // Add the user's message to the chat history
      const newMessages = [...messages, { sender: 'user', text: question }];
      setMessages(newMessages);
      setQuestion(''); // Clear the input
  
      setGeneratingAnswer(true);
  
      // Construct the full conversation prompt
      let fullPrompt = getConversationHistory() + '\nUser: ' + question;
  
      // If it's the first message, include the predefined prompt
      if (!conversationStarted) {
        const initialPrompt =
          "You are a career counseling bot for a freelancing platform named Werky. Guide users based on their age and interests, and suggest them latest tools and technologies which are intrend nowadays for making money. Keep track of the conversation context and provide meaningful responses.";
        fullPrompt = `${initialPrompt}\n\n${fullPrompt}`;
        setConversationStarted(true); // Mark the conversation as started
      }
  
      try {
        const response = await axios({
          url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAV4yuWVHXVL-6JSG23G7tWPYPxYuDNx_0',
          method: 'post',
          data: {
            contents: [{ parts: [{ text: fullPrompt }] }],
          },
        });
  
        const botResponse = response.data.candidates[0].content.parts[0].text;
  
        // Add the bot's response to the chat history
        setMessages([...newMessages, { sender: 'bot', text: botResponse }]);
      } catch (error) {
        console.log(error);
        setMessages([...newMessages, { sender: 'bot', text: 'Sorry - Something went wrong. Please try again!' }]);
      }
  
      setGeneratingAnswer(false);
    }
  
    // Handle the "Enter" key press event
    function handleKeyPress(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // Prevent newline on "Enter" press
        generateAnswer(e);
      }
    }

  return (
<div className="flex flex-col justify-between bg-gray-100">
  {/* Chat container */}
  <div className="flex-grow container mx-auto px-4 py-6">
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
      <div className="overflow-auto mb-4">
        {/* Loop through all messages */}
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'flex-row' : 'flex-row-reverse'} items-start`}>
            {/* User or Bot Picture */}
            <img
              src={msg.sender === 'user' ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUFJ4m3HGM8397IWhGhLphaU38QtqrcYQoUg&s' : 'https://www.shutterstock.com/image-vector/3d-vector-robot-chatbot-ai-600nw-2294117979.jpg'}
              alt={msg.sender === 'user' ? 'User' : 'Bot'}
              className=" h-14 rounded-full shadow-md mr-2"
            />

            {/* Message Bubble */}
            <div
              className={`${
                msg.sender === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'
              } rounded-lg px-4 py-2 max-w-lg shadow-md mb-2`}
            >
              {msg.sender === 'bot' ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Input area */}
  <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
    <textarea
      required
      className="flex-grow border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
      onKeyDown={handleKeyPress}
      placeholder="Type your message..."
      rows="1"
    ></textarea>
    <button
      onClick={generateAnswer}
      className={`ml-4 bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 ${
        generatingAnswer ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={generatingAnswer}
    >
      Send
    </button>
  </div>
</div>

  );
}

export default Counsellor;



