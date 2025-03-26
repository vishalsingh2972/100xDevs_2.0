import axios from "axios";
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config";

export const User = () => {
    const [userData, setUserData] = useState();

    useEffect(() => {
        axios.get(`${BACKEND_URL}/user`, {
            withCredentials: true,
          })
            .then(res => {
                setUserData(res.data);
            })
    }, []);

    return <div>
        You're id is {userData?.userId}
        <br /><br />
        <button onClick={() => {
            axios.post(`${BACKEND_URL}/logout`, {}, {
                withCredentials: true,
            })
        }}>Logout</button>
    </div>
}