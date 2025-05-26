//Sender.tsx contains the code for sending the offer to the receiver.
import { useEffect, useState } from "react"

export const Sender = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket1 = new WebSocket('ws://localhost:8080');
        setSocket(socket1);
        socket1.onopen = () => {
            socket1.send(JSON.stringify({
                type: 'sender'
            }));
        }
    }, []);

    const startSendingVideo = async () => {
        const pc = new RTCPeerConnection();
        const offer = await pc.createOffer(); //SDP
        await pc.setLocalDescription(offer); //pc.localDescription will now contain the exact same SDP data stored in offer variable.

        socket?.send(JSON.stringify({ type: 'createOffer', sdp: offer })); //send the offer to the backend signaling server
        //socket?.send(JSON.stringify({type: 'createOffer', sdp: pc.localDescription})); also works

        //whenever we receive a message back from the backend signaling server
        if (!socket) return;
        socket.onmessage = async (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'createAnswer') {
                console.log("Received answer back from the receiver via signaling server");
                pc.setRemoteDescription(data.sdp); //set the remote description to the SDP answer received from the receiver via the backend signaling server.
            }
        }
    }

    return <div>
        Sender
        <button onClick={startSendingVideo}> Send data </button>
    </div>
}