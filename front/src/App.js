import React, { useState } from 'react';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async (message) => {
    setMessages([...messages, { type: 'user', text: message }]);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages([...messages, { type: 'user', text: message }, { type: 'bot', text: data.message }]);
    } catch (error) {
      console.error('Error sending message:', error.message);
      setMessages([...messages, { type: 'user', text: message }, { type: 'bot', text: 'Error: Unable to contact the server' }]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() !== '') {
      handleSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((message, index) => (
          <p key={index} className={message.type === 'user' ? 'user-message' : 'bot-message'}>
            {message.text}
          </p>
        ))}
      </div>
      <form className="input-container" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default App;
