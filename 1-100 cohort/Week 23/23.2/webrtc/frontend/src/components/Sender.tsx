//Sender.tsx contains the code for sending the offer to the receiver.
import { useEffect, useState, useRef } from "react"

export const Sender = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const videoRef1 = useRef<HTMLVideoElement>(null);

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

        //whenever a change happens (like video/audio gets added), the SDP changes, thus we need to keep sending the updated SDP to the receiver.
        pc.onnegotiationneeded = async () => {
            console.log('onnegotiationneeded triggered');
            const offer = await pc.createOffer(); //SDP
            await pc.setLocalDescription(offer); //pc.localDescription will now contain the exact same SDP data stored in offer variable.

            socket?.send(JSON.stringify({ type: 'createOffer', sdp: offer })); //send the offer to the backend signaling server
            //socket?.send(JSON.stringify({type: 'createOffer', sdp: pc.localDescription})); also works
        }

        //whenever we receive a message back from the backend signaling server
        if (!socket) return;
        socket.onmessage = async (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'createAnswer') {
                console.log("Received answer back from the receiver via signaling server");
                pc.setRemoteDescription(data.sdp); //set the remote description to the SDP answer received from the receiver via the backend signaling server.
            }

            //catch the incoming ICE candidates from the backend signaling server
            else if (data.type === 'iceCandidate') {
                console.log("Received ICE 2 from the backend signaling server");
                if (data.candidate) {
                    await pc.addIceCandidate(data.candidate);
                }
            }
        }

        //gets triggered any time a new ICE candidate is added to this browser
        //will only get triggered once you start sending video/audio data
        pc.onicecandidate = (event) => {
            console.log(event);
            if (event.candidate) {
                //console.log("Sending ICE 1 to the backend signaling server");
                socket?.send(JSON.stringify({ type: 'iceCandidate', candidate: event.candidate }));
            }
        }

        //send video data to the other peer (receiver)
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        pc.addTrack(stream.getVideoTracks()[0]);//This allows the video to be sent to the other peer (receiver) through the WebRTC connection.
        //pc.addTrack(stream.getAudioTracks()[0]);

        //show video data in the video element
        if (videoRef1.current) {
            videoRef1.current.srcObject = stream;
            videoRef1.current.play();
        }

        //screenshare
        // const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
        // pc.addTrack(screenStream.getVideoTracks()[0]);
    }

    return <div>
        Sender
        <button onClick={startSendingVideo}> Send data </button>
        <video ref={videoRef1} autoPlay muted></video>
    </div>
}