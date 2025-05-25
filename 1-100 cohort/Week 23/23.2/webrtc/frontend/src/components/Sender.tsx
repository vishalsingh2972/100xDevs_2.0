//Sender.tsx contains the code for sending the offer to the receiver.
import { useEffect, useState } from "react"

export const Sender = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        setSocket(socket);
        socket.onopen = () => {
            socket.send(JSON.stringify({
                type: 'sender'
            }));
        }
    }, []);

    const startSendingVideo = async () => {
        const pc = new RTCPeerConnection();
        const offer = await pc.createOffer(); //SDP
        await pc.setLocalDescription(offer); //After this line executes, pc.localDescription will now contain the exact same SDP offer data that is stored in the offer variable.

        socket?.send(JSON.stringify({type: 'createOffer', sdp: offer})); //send the offer to the backend signaling server
        //socket?.send(JSON.stringify({type: 'createOffer', sdp: pc.localDescription})); also works
    }

    return <div>
        Sender
        <button onClick={startSendingVideo}> Send data </button>
    </div>
}