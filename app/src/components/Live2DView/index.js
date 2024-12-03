import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display-lipsyncpatch';

window.PIXI = PIXI;

const Live2DView = ({ socket }) => {
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
        let animationFrame;

        // ドラッグ状態を管理
        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        let modelStartX = 0;
        let modelStartY = 0;

        const smoothResetFocus = () => {
            if (model) {
                const focusController = model.internalModel.focusController;

                const resetStep = () => {
                    const currentX = focusController.targetX || 0;
                    const currentY = focusController.targetY || 0;
                    const dx = -currentX;
                    const dy = -currentY;
                    const speed = 0.05;

                    const newX = currentX + dx * speed;
                    const newY = currentY + dy * speed;

                    focusController.targetX = newX;
                    focusController.targetY = newY;

                    if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
                        cancelAnimationFrame(animationFrame);
                        focusController.targetX = 0;
                        focusController.targetY = 0;
                        return;
                    }

                    animationFrame = requestAnimationFrame(resetStep);
                };

                resetStep();
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
                    smoothResetFocus();
                }, IDLE_TIME);
            }

            // ドラッグ中の場合、モデルを移動
            if (isDragging && model) {
                const dx = event.clientX - dragStartX;
                const dy = event.clientY - dragStartY;
                model.position.set(modelStartX + dx, modelStartY + dy);
            }
        };

        const onMouseDown = (event) => {
            if (model) {
                isDragging = true;
                dragStartX = event.clientX;
                dragStartY = event.clientY;
                modelStartX = model.position.x;
                modelStartY = model.position.y;
            }
        };

        const onMouseUp = () => {
            isDragging = false;
        };

        const onMouseOut = () => {
            isDragging = false; // ウィンドウ外でドラッグ状態を解除
        };

        const onWheel = (event) => {
            if (model) {
                const scaleFactor = 0.1; // 1回のホイール操作での拡大縮小率
                const delta = event.deltaY > 0 ? -scaleFactor : scaleFactor; // スクロール方向で拡大・縮小
                const newScaleX = Math.min(Math.max(model.scale.x + delta, 0.5), 2); // 最小0.5倍、最大2倍
                const newScaleY = Math.min(Math.max(model.scale.y + delta, 0.5), 2);

                model.scale.set(newScaleX, newScaleY);
            }
        };

        const Live2DLoader = async () => {
            try {
                model = await Live2DModel.from('../../public/model/Kei/kei_basic_free.model3.json');
                console.log('Model loaded', model);
                app.stage.addChild(model);

                model.scale.set(1, 1);
                model.anchor.set(0, 0);
                model.position.set(0, 0);
            } catch (error) {
                console.error('Error loading model:', error);
            }
        };

        Live2DLoader();

        window.addEventListener('resize', () => {
            if (model) model.position.set(0, 0);
        });
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mouseout', onMouseOut);
        window.addEventListener('wheel', onWheel); // ホイールイベントを追加

        socket.on('audio_generated', () => {
            console.log('読み上げ音声を取得しました');

            if (model) {
                model.speak('../../tmp/Vtuber_speech.wav', {
                    onFinish: () => {
                        const res = window.electronAPI.deleteFile('../../tmp/Vtuber_speech.wav');
                    },
                });
            }
        });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mouseout', onMouseOut);
            window.removeEventListener('wheel', onWheel);
            cancelAnimationFrame(animationFrame);
        };
    }, [socket]);

    return (
        <div>
            <canvas ref={canvasRef} />
        </div>
    );
};

export default Live2DView;
