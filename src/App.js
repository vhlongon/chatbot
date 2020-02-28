import React, { useEffect, useState } from "react";
import {
  Widget,
  addResponseMessage,
  toggleMsgLoader,
  addUserMessage,
  toggleInputDisabled,
  renderCustomComponent
} from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import traveler from "./traveler.svg";
import "./index.css";

const QuickReply = ({ choices = [], onClick = () => {} }) => {
  const [replied, setReplied] = useState(false);
  useEffect(() => {
    toggleInputDisabled();
  }, []);

  const sendQuickReply = reply => {
    setReplied(true);
    addUserMessage(reply);
    toggleInputDisabled();
  };

  const handleOnClick = reply => () => {
    sendQuickReply(reply);
    onClick(reply);
  };

  return replied ? null : (
    <div className="message">
      {choices.map(choice => (
        <div className="rcw-response rcw-response--quick" key={choice} onClick={handleOnClick(choice)}>
          {choice}
        </div>
      ))}
    </div>
  );
};
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
        if (Array.isArray(reply)) {
          renderCustomComponent(QuickReply, { choices: reply, onClick: handleNewUserMessage });
        } else {
          addResponseMessage(reply);
        }
      });
    }, 1500);
  };

  return (
    <>
      <div className="content">
        <iframe width="100%" height="100%" frameborder="0" title="SuperSaverTravel" src="https://www.supersavertravel.se/" />
      </div>
      <div className="App">
        <Widget
          handleNewUserMessage={handleNewUserMessage}
          profileAvatar={traveler}
          title="Supersaver support chat"
          subtitle="Powered by Etraveli"
        />
      </div>
    </>
  );
};

export default App;
