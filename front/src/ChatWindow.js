import React from 'react';

const ChatWindow = ({ messages }) => {
  return (
    <div className="chat-box" id="chatBox">
      {messages.map((message, index) => (
        <p key={index} className={message.type === 'user' ? 'user-message' : 'bot-message'}>
          {message.text}
        </p>
      ))}
    </div>
  );
};

export default ChatWindow;
