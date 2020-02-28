import React, { useEffect } from "react";
import { Widget, addResponseMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import logo from "./logo.svg";

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
    fetchServerData().then(({ reply }) => addResponseMessage(reply));
  }, []);

  const handleNewUserMessage = question => {
    fetchServerData(question).then(({ reply }) =>
      addResponseMessage(reply)
    );
  };

  return (
    <div className="App">
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        profileAvatar={logo}
        title="The support chat awesome sauce"
        subtitle="Powered eti dev brainz"
      />
    </div>
  );
};

export default App;
