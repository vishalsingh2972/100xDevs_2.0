//Receiver.tsx contains the code for sending the answer to the sender.
import { useEffect } from "react"

export const Receiver = () => {

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = () => {
            socket.send(JSON.stringify({
                type: 'receiver'
            }));
        }
    }, []);

    return <div>
        Receiver
    </div>
}