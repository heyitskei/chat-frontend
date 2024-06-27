import React, {ChangeEvent, useEffect, useState} from 'react';
import './App.css';
import axios from "axios";

interface Message {
    text: string;
    sender: 'user' | 'bot';
}

const App: React.FC = () => {

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');

    useEffect(() => {
        const getChatResponse = async (message: string) => {
            try {
                const response = await axios.post("http://localhost:3001/chat", {
                    message: message
                }, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (!response.data) {
                    throw new Error('Empty response received from backend');
                }

                console.log('Response from backend:', response.data);
                return response.data;
            }
            catch (error) {
                console.error("Error fetching response from backend:", error);
                throw error;
            }
        };

        if (messages.length > 0 && messages[messages.length - 1].sender === 'user') {
            getChatResponse(messages[messages.length - 1].text).then(response => {
                setMessages(prevMessages => [...prevMessages, { text: response, sender: 'bot' }]);
            });
        }

        console.log(messages);
    }, [messages]);

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const handleSendMessage = () => {
        if (input.trim() !== '') {
            const newMessages: Message[] = [...messages, { text: input, sender: 'user' }];
            setMessages(newMessages);
            setInput('');
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div key={index} className={`chat-message ${message.sender}`}>
                        {message.text}
                    </div>
                ))}
            </div>
            <div className="chat-input-container">
                <textarea
                    placeholder="Type your message..."
                    value={input}
                    onChange={handleInputChange}
                    className="chat-input"
                />
                <button onClick={handleSendMessage} className="chat-send-button">
                    Send
                </button>
            </div>
        </div>
    );
}

export default App;
