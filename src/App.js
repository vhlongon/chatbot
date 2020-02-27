import React, { useEffect } from "react";
import { Widget, addResponseMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import logo from "./logo.svg";

const App = () => {
  const fetchServerData = async (name = "How can I help you? ") => {
    try {
      const response = await fetch(`/api/greeting?name=${name}`);
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchServerData().then(({ greeting }) => addResponseMessage(greeting));
  }, []);

  const handleNewUserMessage = question => {
    fetchServerData(question).then(({ greeting }) =>
      // TODO: implement the server AI logic to answer to whatever we send here :D
      addResponseMessage(`the response for the ${question}: ${greeting}`)
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
