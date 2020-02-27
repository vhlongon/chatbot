import React, { useEffect } from "react";
import { Widget, addResponseMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import logo from "./logo.svg";

const App = () => {
  useEffect(() => {
    addResponseMessage("I welcome here!");
  }, []);
  const handleNewUserMessage = newMessage => {
    console.log(`New message incoming! ${newMessage}`);
    // Now send the message throught the backend API
    // addResponseMessage(response);
  };

  return (
    <div className="App">
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        profileAvatar={logo}
        title="My awesome chatbot"
        subtitle="V & S limited"
      />
    </div>
  );
};

export default App;
