import React, { useContext } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';

const Main = () => {
  const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);


  const handleSend = () => {
    if (!input.trim()) return;
    onSent(input).catch((err) => {
      console.error("API Error:", err);
    });
  };

  return (
    <div className="main">
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon} alt="User Icon" />
      </div>

      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p><span>Hello, Kanishka.</span></p>
              <p>How can I help you today?</p>
            </div>

            <div className="cards">
              {[
                { text: "Suggest beautiful places to see on an upcoming road trip", icon: assets.compass_icon },
                { text: "Briefly summarize this concept: urban planning", icon: assets.bulb_icon },
                { text: "Brainstorm team bonding activities for our work retreat", icon: assets.message_icon },
                { text: "Improve the reliability of the following code", icon: assets.code_icon },
              ].map((card, index) => (
                <div className="card" key={index} onClick={() => setInput(card.text)}>
                  <p>{card.text}</p>
                  <img src={card.icon} alt="Icon" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={assets.user_icon} alt="User Icon" />
              <p>{recentPrompt}</p>
            </div>

            <div className="result-data">
              <img src={assets.gemini_icon} alt="Gemini Icon" />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : resultData ? (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              ) : (
                <p>No data available. Try a different prompt.</p>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter a prompt here"
            />
            <div>
              <img src={assets.gallery_icon} alt="Gallery Icon" />
              <img src={assets.mic_icon} alt="Mic Icon" />
              {input.trim() && <img onClick={handleSend} src={assets.send_icon} alt="Send Icon" />}
            </div>
          </div>
          <p className="bottom-info">Gemini may display inaccurate info, so double-check its responses.</p>
        </div>
      </div>
    </div>
  );
};

export default Main;
