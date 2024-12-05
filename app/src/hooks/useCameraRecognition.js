import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const useCameraRecognition = () => {
  const videoEl = useRef(null); // Video要素の参照
  const canvasEl = useRef(null); // Canvas要素の参照

  const [faceX, setFaceX] = useState(null); // 顔のX座標
  const [faceY, setFaceY] = useState(null); // 顔のY座標

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "../../public/face_model"; // モデルファイルのURL
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    };

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        if (videoEl.current) {
          videoEl.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing the camera: ", error);
      }
    };

    const detectFaces = async () => {
      const video = videoEl.current;

      if (!video || video.paused || video.ended) {
        setTimeout(detectFaces, 100);
        return;
      }

      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 128,
        scoreThreshold: 0.5,
      });

      const detections = await faceapi.detectAllFaces(video, options);

      const canvas = canvasEl.current;

      if (canvas) {
        const dims = faceapi.matchDimensions(canvas, video, true);
        const context = canvas.getContext("2d");

        context.clearRect(0, 0, canvas.width, canvas.height);

        if (detections.length > 0) {
          const resizedDetections = faceapi.resizeResults(detections, dims);

          // 最も大きい顔を取得
          const largestFace = resizedDetections.reduce((largest, current) =>
            current.box.area > largest.box.area ? current : largest
          );

          faceapi.draw.drawDetections(canvas, [largestFace]);

          // 顔の中心座標を計算して状態を更新
          setFaceX(Math.round(largestFace.box.x + largestFace.box.width / 2));
          setFaceY(Math.round(largestFace.box.y + largestFace.box.height / 2));
        } else {
          setFaceX(null);
          setFaceY(null);
        }
      }

      setTimeout(detectFaces, 100);
    };

    const initialize = async () => {
      await loadModels();
      await startCamera();

      const video = videoEl.current;
      video?.addEventListener("play", detectFaces);

      return () => {
        video?.removeEventListener("play", detectFaces);
      };
    };

    initialize();
  }, []);

  return { faceX, faceY, videoEl, canvasEl };
};

export default useCameraRecognition;
