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

      if (!currentPrompt.trim()) {
        console.error("Prompt cannot be empty.");
        setLoading(false);
        return;
      }

      setPrevPrompts((prev) => [...prev, currentPrompt]);
      setRecentPrompt(currentPrompt);

      const response = await run(currentPrompt);

      if (!response || response.startsWith("⚠️")) {
        console.error("Invalid response received from the API. No data available.");
        setResultData("⚠️ API Error: No data available. Try a different prompt.");
        setLoading(false);
        return;
      }

      const responseArray = response.split("**");
      let formattedResponse = "";

      responseArray.forEach((segment, index) => {
        formattedResponse += index % 2 === 0 ? segment : `<b>${segment}</b>`;
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
      setResultData("⚠️ An error occurred while processing your request.");
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
