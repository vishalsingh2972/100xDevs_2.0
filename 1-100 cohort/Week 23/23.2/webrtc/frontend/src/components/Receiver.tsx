//Receiver.tsx contains the code for sending the answer to the sender.
import { useEffect, useRef } from "react"

export const Receiver = () => {
    const videoRef2 = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = () => {
            socket.send(JSON.stringify({
                type: 'receiver'
            }));
        }

        const pc = new RTCPeerConnection();

        //whenever we receive a message from the backend signaling server
        socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);

            if (message.type === 'createOffer') {
                console.log("Received offer from the sender via signaling server");
                pc.setRemoteDescription(message.sdp);

                //create an answer and send it back to the sender via signaling server
                const answer = await pc.createAnswer(); //SDP of browser2
                await pc.setLocalDescription(answer);

                socket?.send(JSON.stringify({ type: 'createAnswer', sdp: answer })); //send the answer back to the backend signaling server
                //socket?.send(JSON.stringify({ type: 'createAnswer', sdp: pc.localDescription })); also works

                //gets triggered any time a new ICE candidate is added to this browser
                //will only get triggered once you start sending video/audio data
                pc.onicecandidate = (event) => {
                    console.log(event);
                    if (event.candidate) {
                        //console.log("Sending ICE 2 to the backend signaling server");
                        socket?.send(JSON.stringify({ type: 'iceCandidate', candidate: event.candidate }));
                    }
                }
            }

            //catch the incoming ICE candidates from the backend signaling server
            else if (message.type === 'iceCandidate') {
                console.log("Received ICE 1 from the backend signaling server");
                if (message.type) {
                    await pc.addIceCandidate(message.candidate);
                }
            }
        }

        //receive video data from the other peer (sender)
        pc.ontrack = (event) => {
            console.log(event);

            //show video data in the video element
            if (videoRef2.current) {
                videoRef2.current.srcObject = new MediaStream([event.track]);
                videoRef2.current.play();
            }
        }
    }, []);

    return <div>
        Receiver
        <video ref={videoRef2} autoPlay muted></video>
    </div>
}