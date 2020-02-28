import React, { useEffect } from "react";
import { Widget, addResponseMessage, toggleMsgLoader } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import traveler from "./traveler.svg";
import "./index.css";

const App = () => {
  const fetchServerData = async (message = "hello") => {
    try {
      const response = await fetch(`/handlemessage?message=${message}`);
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    addResponseMessage("Hi, how can I help you?");
  }, []);

  const handleNewUserMessage = question => {
    toggleMsgLoader();
    setTimeout(() => {
      fetchServerData(question).then(({ reply }) => {
        toggleMsgLoader();
        addResponseMessage(reply);
      });
    }, 1500);
  };

  return (
    <div className="App">
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        profileAvatar={traveler}
        title="Supersaver support chat"
        subtitle="Powered by Etraveli"
      />
    </div>
  );
};

export default App;
