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

    }

    const onSent = async(prompt) => {

        setResultData("")
        setLoading(true)
        setShowResult(true)
        setRecentPrompt(input)
        const response = await run(input)
        let responseArray = response.split("**");
        let newArray;
        for(let i=0; i<response.length; i++){
            if(i === 0 || i%2!== 1){
                newArray += responseArray[i];
            } else {
                newArray += "<b>"+responseArray[i]+"</b>";
            }
        }
        setResultData(newArray)
        setLoading(false)
        setInput("")
    }

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
        newChat
    }


    return (
        <Context.Provider value = {contextValue}>
            {props.children}
        </Context.Provider>
    )

}

export default ContextProvider