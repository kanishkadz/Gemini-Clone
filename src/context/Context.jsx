import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompt, setPrevPrompt] = useState([]);
    const [showResult, setShowResult] = useState(false);


    const onSent = async(prompt) => {
        await run(prompt)
    }



    const contextValue = {

    }


    return (
        <Context.Provider value = {contextValue}>
            {props.children}
        </Context.Provider>
    )

}

export default ContextProvider