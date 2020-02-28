import React, { useEffect } from "react";
import {
  Widget,
  addResponseMessage,
  toggleMsgLoader,
  renderCustomComponent
} from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import LoadingDots from "./LoadingDots";
import traveler from "./traveler.svg";
import "./index.css";

const App = () => {
  const fetchServerData = async (name = "") => {
    try {
      const response = await fetch(`/api/greeting?name=${name}`);
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    addResponseMessage("How can I help you?");
  }, []);

  const handleNewUserMessage = question => {
    toggleMsgLoader();

    fetchServerData(question).then(({ greeting }) => {
      setTimeout(() => {
        toggleMsgLoader();
        renderCustomComponent(LoadingDots, { hide: true });
        addResponseMessage(`response ${greeting}`);
      }, 1000);
    });
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
