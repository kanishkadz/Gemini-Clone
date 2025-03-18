import React, { useContext, useState } from 'react';
import './SideBar.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';

const SideBar = () => {
    const [extended, setExtended] = useState(false);
    const { onSent, prevPrompts = [], setRecentPrompt, newChat } = useContext(Context);

    const loadPrompt = async (prompt) => {
        setRecentPrompt(prompt);
        await onSent(prompt);
    };

    return (
        <div className='sidebar'>
            <div className="top">
                <img 
                    onClick={() => setExtended(prev => !prev)} 
                    className='menu' 
                    src={assets.menu_icon} 
                    alt="Menu Icon" 
                />
                <div onClick={newChat} className="new-chat">
                    <img src={assets.plus_icon} alt="New Chat Icon" />
                    {extended && <p> New Chat </p>}
                </div>
                {extended && (
                    <div className="recent">
                        <p className='recent-title'>Recent</p>
                        {prevPrompts?.map((item, index) => (
                            <div 
                                onClick={() => loadPrompt(item)} 
                                className="recent-entry" 
                                key={`${item}-${index}`} 
                            >
                                <img src={assets.message_icon} alt="Message Icon" />
                                <p>{item.slice(0, 18)} ...</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="bottom">
                <div className="bottom-item recent-entry">
                    <img src={assets.question_icon} alt="Help Icon" />
                    {extended && <p>Help</p>}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.history_icon} alt="Activity Icon" />
                    {extended && <p>Activity</p>}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.setting_icon} alt="Settings Icon" />
                    {extended && <p>Settings</p>}
                </div>
            </div>
        </div>
    );
};

export default SideBar;
