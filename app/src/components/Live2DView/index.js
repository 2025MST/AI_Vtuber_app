import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display-lipsyncpatch';

window.PIXI = PIXI;

const Live2DView = ({socket}) => {

    const canvasRef = useRef(null);
    const [isIdle, setIsIdle] = useState(false);
    const IDLE_TIME = 3000;

    useEffect(() => {

        const app = new PIXI.Application({ 
                        view: canvasRef.current,
                        width: 1000,
                        height: window.innerHeight * 0.95,
                        backgroundColor: 0x1099bb,
                    });
        let model;
        let idleTimeout;

        const resetFocus = () => {
            if (model) {
                model.internalModel.focusController.x = 0;
                model.internalModel.focusController.y = 0;
                model.internalModel.focusController.vx = 0;
                model.internalModel.focusController.vy = 0;
                model.internalModel.focusController.targetX = 0;
                model.internalModel.focusController.targetY = 0;
            }
        };

        const onMouseMove = (event) => {
            if (isIdle) {
                setIsIdle(false);
            }

            if (model && !isIdle) {
                model.focus(event.clientX, event.clientY);
                clearTimeout(idleTimeout);
                idleTimeout = setTimeout(() => {
                    setIsIdle(true);
                    resetFocus();
                },IDLE_TIME);
            }
        }
        
        // Live2Dロード用関数
        const Live2DLoader = async () => {
            try {
                model = await Live2DModel.from('../../public/model/Kei/kei_basic_free.model3.json');
                console.log("Model loaded", model);
                app.stage.addChild(model);
                // モデルのスケーリングと位置の調整
                model.scale.set(1,1);  // モデルのサイズ調整
                model.anchor.set(0,0);
                model.position.set(0,0);

            } catch (error) {
                console.error("Error loading model:", error);
            }
        }

        Live2DLoader();

        // ウィンドウサイズ変更時の処理
        window.addEventListener('resize', () => {
            model.position.set(0, 0);
        });
        window.addEventListener('mousemove', onMouseMove);

        
        socket.on('audio_generated', () => {
            console.log("読み上げ音声を取得しました");

            if (model) {
                model.speak('../../tmp/Vtuber_speech.wav',{
                    onFinish: () => {
                        console.log("音声を読み上げました");
                        const res = window.electronAPI.deleteFile('../../tmp/Vtuber_speech.wav');
                        if (res) {
                            console.log("音声削除完了");
                        } else {
                            console.error("音声削除失敗 ]: ");
                        }
                    }
                });
            }
        });

    },[socket]);


    return (
        <div>
            <canvas ref={canvasRef} />
        </div>
    );
};

export default Live2DView;
