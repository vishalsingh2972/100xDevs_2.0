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

        //whenever we receive a message from the backend signaling server
        socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);

            if (message.type === 'createOffer') {
                console.log("Received offer from sender via signaling server");
                const pc = new RTCPeerConnection();
                pc.setRemoteDescription(message.sdp);

                //create an answer and send it back to the sender via signaling server
                const answer = await pc.createAnswer(); //SDP of browser2
                await pc.setLocalDescription(answer);

                socket?.send(JSON.stringify({ type: 'createAnswer', sdp: answer })); //send the answer back to the backend signaling server
                //socket?.send(JSON.stringify({ type: 'createAnswer', sdp: pc.localDescription })); also works
            }
        }
    }, []);

    return <div>
        Receiver
    </div>
}