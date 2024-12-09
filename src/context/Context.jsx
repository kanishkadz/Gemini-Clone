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

  const onSent = async () => {
    try {
      setResultData("");
      setLoading(true);
      setShowResult(true);
      setRecentPrompt(input);
      setPrevPrompts(prev=>[...prev, input])

      // Call the run function and ensure the response is handled properly
      const response = await run(input);

      // Handle invalid response scenarios
      if (!response || typeof response !== "string") {
        console.error("Invalid response received from the API.");
        setLoading(false);
        return;
      }

      // Process the response for formatting
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

      // Use delayPara to display the response word by word
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
  };

  return <Context.Provider value={contextValue}>{props.children}</Context.Provider>;
};

export default ContextProvider;
