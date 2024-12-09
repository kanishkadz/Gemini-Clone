import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setResultData("");
    setInput("");
    setRecentPrompt("");
  };

  const onSent = async (prompt) => {
    try {
      setResultData("");
      setLoading(true);
      setShowResult(true);

      const currentPrompt = prompt !== undefined ? prompt : input;

      if (currentPrompt.trim() === "") {
        console.error("Prompt cannot be empty.");
        setLoading(false);
        return;
      }

      setPrevPrompts((prev) => [...prev, currentPrompt]);
      setRecentPrompt(currentPrompt);

      const response = await run(currentPrompt);

      if (!response || typeof response !== "string") {
        console.error("Invalid response received from the API.");
        setLoading(false);
        return;
      }

      const responseArray = response.split("**");
      let formattedResponse = "";

      responseArray.forEach((segment, index) => {
        if (index % 2 === 0) {
          formattedResponse += segment;
        } else {
          formattedResponse += `<b>${segment}</b>`;
        }
      });

      const formattedResponseWithLineBreaks = formattedResponse.split("*").join("<br>");
      const responseWords = formattedResponseWithLineBreaks.split(" ");

      responseWords.forEach((word, index) => {
        delayPara(index, word + " ");
      });

      setLoading(false);
      setInput("");
    } catch (error) {
      console.error("Error while processing the prompt:", error);
      setLoading(false);
    }
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  return <Context.Provider value={contextValue}>{props.children}</Context.Provider>;
};

export default ContextProvider;
