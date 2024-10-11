import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display';
import path from 'path';

window.PIXI = PIXI;

//Live2DModel.registerTicker(PIXI.Ticker);

//PIXI.Renderer.registerPlugin("interaction", PIXI.InteractionManager);

const Live2DView = () => {
    const canvasRef = useRef(null);
    const [isIdle, setIsIdle] = useState(false);

    useEffect(() => {
        // PixiJSアプリケーションの作成

        let model;
        let idleTimeout;
        const IDLE_TIME = 3000;

        const app = new PIXI.Application({ 
            view: canvasRef.current,
            width: 1000,
            height: window.innerHeight * 0.95,
            backgroundColor: 0x1099bb,
        });

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


        const Live2DLoader = async () => {
            
            try {
                model = await Live2DModel.from('../../public/model/Kei/kei_basic_free.model3.json');
                console.log("Model loaded", model);
                app.stage.addChild(model);

                // モデルのスケーリングと位置の調整
                model.scale.set(1,1);  // モデルのサイズ調整
                model.anchor.set(0,0);
                //model.position.set(window.innerWidth / 2, window.innerHeight / 2);  // モデルの位置をウィンドウ中央に設定
                model.position.set(0,0);

                resetFocus();

            } catch (error) {
                console.error("Error loading model:", error);
            }

        }

        Live2DLoader();
        // ウィンドウサイズ変更時の処理
        window.addEventListener('resize', () => {
            
            //app.renderer.resize(window.innerWidth * 0.9, window.innerHeight * 0.9);
            model.position.set(0, 0);

        });

        window.addEventListener('mousemove', onMouseMove);

        return () => {
            app.destroy(true);  // アプリケーションの破棄
        };

    }, []);

    return (
        <div>
            <canvas ref={canvasRef} />
        </div>
    );
};

export default Live2DView;
