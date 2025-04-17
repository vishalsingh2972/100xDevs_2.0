import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [socket, setSocket] = useState<null | WebSocket>(null);
  const [messages, setMessages] = useState<string[]>([]); //messages is a string array
  const [inputValue, setInputValue] = useState(''); // State for input value

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    socket.onopen = () => {
      console.log('Client connected to Server via WebSockets');
      setSocket(socket);
    }
    socket.onmessage = (message) => {
      console.log('Message recieved from server: ', message.data);
      setMessages((prev) => [...prev, message.data]);
    }

    return () => {  
      console.log('Client got disconnected from Server via WebSockets');
      socket.close();
    }
  }, []);

  if (!socket) {
    return <div> Loading... </div>
  }

  const handleSendMessage = () => {
    if (socket && inputValue.trim() !== '') {
      socket.send(inputValue);
      setInputValue(''); // Clear the input after sending
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <>
      {messages}
      
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Type your message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </>
  )
}

export default App