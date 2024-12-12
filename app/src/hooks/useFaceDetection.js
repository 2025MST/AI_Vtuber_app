import { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";

const useFaceDetection = () => {
    const videoRef = useRef(document.createElement("video"));
    const canvasRef = useRef(document.createElement("canvas"));
    const [forwardTimes, setForwardTimes] = useState([]);
    const [avgTime, setAvgTime] = useState(0);
    const [fps, setFps] = useState(0);
    const [coordinates, setCoordinates] = useState(null);

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = "../../public/face_model";
            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        };

        loadModels();
    }, []);

    useEffect(() => {
        const startVideo = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        };

        startVideo();
    }, []);

    const updateTimeStats = (timeInMs) => {
        const updatedForwardTimes = [timeInMs, ...forwardTimes].slice(0, 30);
        const avgTimeInMs =
            updatedForwardTimes.reduce((total, t) => total + t, 0) /
            updatedForwardTimes.length;

        setForwardTimes(updatedForwardTimes);
        setAvgTime(Math.round(avgTimeInMs));
        setFps(Math.round(1000 / avgTimeInMs));
    };

    const onPlay = async () => {
        const videoEl = videoRef.current;

        if (
            !videoEl ||
            videoEl.paused ||
            videoEl.ended ||
            !faceapi.nets.tinyFaceDetector.isLoaded
        ) {
            setTimeout(onPlay, 100);
            return;
        }

        const options = new faceapi.TinyFaceDetectorOptions({
            inputSize: 128,
            scoreThreshold: 0.5,
        });

        const ts = Date.now();
        const detections = await faceapi.detectAllFaces(videoEl, options);
        updateTimeStats(Date.now() - ts);

        const canvas = canvasRef.current;
        const dims = faceapi.matchDimensions(canvas, videoEl, true);
        const resizedDetections = faceapi.resizeResults(detections, dims);

        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (resizedDetections.length > 0) {
            const largestFace = resizedDetections.reduce((largest, current) =>
            current.box.area > largest.box.area ? current : largest
            );

            faceapi.draw.drawDetections(canvas, [largestFace]);	
            const focusX = -((Math.round(largestFace.box.x) / videoEl.videoWidth ) * 2 - 1);
            const focusY = -((Math.round(largestFace.box.y) / videoEl.videoHeight) * 2 - 1);
        
            // 顔の座標を設定
            setCoordinates({
                x: Math.round(largestFace.box.x),
                y: Math.round(largestFace.box.y),
                focusX,
                focusY,
                width: Math.round(largestFace.box.width),
                height: Math.round(largestFace.box.height),
            });

        } else {
            setCoordinates(null);
        }

        setTimeout(onPlay, 100);
        };

        useEffect(() => {
        const videoEl = videoRef.current;
        
        videoEl?.addEventListener("play", onPlay);

        return () => {
            videoEl?.removeEventListener("play", onPlay);
        };
    }, [forwardTimes]);

    return {
    videoRef,
    canvasRef,
    avgTime,
    fps,
    coordinates,
    };
};

export default useFaceDetection;
