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
    toggleMsgLoader();
    setTimeout(() => {
      fetchServerData().then(({ reply }) => {
        toggleMsgLoader();
        addResponseMessage(reply);
      });
    }, 1500);
  }, []);

  const handleNewUserMessage = question => {
    fetchServerData(question).then(({ reply }) => addResponseMessage(reply));
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
