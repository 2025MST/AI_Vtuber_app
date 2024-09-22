// /app/src/Live2DView.js
import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display';
import path from 'path';

window.PIXI = PIXI;

Live2DModel.registerTicker(PIXI.Ticker);

PIXI.Renderer.registerPlugin("interaction", PIXI.InteractionManager);

const Live2DView = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        // PixiJSアプリケーションの作成
        const app = new PIXI.Application({ 
            view: canvasRef.current,
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x1099bb,
        });

        const Live2DLoader = async () => {
            
            try {
                const model = await Live2DModel.from('../../public/runtime/hiyori_free_t08.model3.json');
                console.log("Model loaded", model);
                app.stage.addChild(model);

                // モデルのスケーリングと位置の調整
                model.scale.set(0.1);  // モデルのサイズ調整
                model.position.set(window.innerWidth / 2, window.innerHeight / 2);  // モデルの位置をウィンドウ中央に設定

                // モデルをステージに追加
            } catch (error) {
                console.error("Error loading model:", error);
            }

        }
        
        Live2DLoader();
        // // ウィンドウサイズ変更時の処理
        // window.addEventListener('resize', () => {
        //     app.renderer.resize(window.innerWidth, window.innerHeight);
        // });
        
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
