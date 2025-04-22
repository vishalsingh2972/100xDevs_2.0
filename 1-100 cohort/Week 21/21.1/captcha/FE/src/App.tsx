import './App.css';
import axios from 'axios';
import { Turnstile } from '@marsidev/react-turnstile';
import { useState } from 'react';

function App() {
  const [token, setToken] = useState<string>("");

  return (
    <>
      <input placeholder='OTP'></input>
      <input placeholder='New Password'></input>

      <Turnstile onSuccess={(token) => {
        setToken(token);
        //{console.log(token)}
      }} siteKey='0x4AAAAAABQ6191LVUeHCwfO' />

      <button onClick={() => {
        axios.post("http://localhost:3000/",{
          email: "vishal@gmail.com",
          otp: "123456",
          token: token
        })
      }}>Update Password</button>
    </>
  )
}

export default App