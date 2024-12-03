import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display-lipsyncpatch';

window.PIXI = PIXI;

const Live2DView = React.memo(({ voicevox }) => {
    const canvasRef = useRef(null);
    const appRef = useRef(null); // PIXI.Applicationのインスタンスを保持
    const modelRef = useRef(null); // Live2Dモデルを保持
    const idleTimeoutRef = useRef(null); // idleタイムアウトを保持
    const animationFrameRef = useRef(null); // アニメーションフレームを保持
    const isDraggingRef = useRef(false); // ドラッグ状態を保持
    const dragStartRef = useRef({ x: 0, y: 0 }); // ドラッグ開始位置を保持
    const modelStartRef = useRef({ x: 0, y: 0 }); // モデルの開始位置を保持
    const scaleRef = useRef(1); // スケールを保持

    const [isIdle, setIsIdle] = useState(false);
    const IDLE_TIME = 3000;

    useEffect(() => {
        const app = new PIXI.Application({
            view: canvasRef.current,
            width: 1000,
            height: window.innerHeight * 0.95,
            backgroundColor: 0x1099bb,
        });
        appRef.current = app;

        const smoothResetFocus = () => {
            if (modelRef.current) {
                const focusController = modelRef.current.internalModel.focusController;

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
                        cancelAnimationFrame(animationFrameRef.current);
                        focusController.targetX = 0;
                        focusController.targetY = 0;
                        return;
                    }

                    animationFrameRef.current = requestAnimationFrame(resetStep);
                };

                resetStep();
            }
        };

        const onMouseMove = (event) => {
            if (isIdle) setIsIdle(false);

            if (modelRef.current && !isIdle) {
                modelRef.current.focus(event.clientX, event.clientY);
                clearTimeout(idleTimeoutRef.current);
                idleTimeoutRef.current = setTimeout(() => {
                    setIsIdle(true);
                    smoothResetFocus();
                }, IDLE_TIME);
            }

            // ドラッグ中の場合、モデルを移動
            if (isDraggingRef.current && modelRef.current) {
                const dx = event.clientX - dragStartRef.current.x;
                const dy = event.clientY - dragStartRef.current.y;
                modelRef.current.position.set(
                    modelStartRef.current.x + dx,
                    modelStartRef.current.y + dy
                );
            }
        };

        const onMouseDown = (event) => {
            if (modelRef.current) {
                isDraggingRef.current = true;
                dragStartRef.current = { x: event.clientX, y: event.clientY };
                modelStartRef.current = {
                    x: modelRef.current.position.x,
                    y: modelRef.current.position.y,
                };
            }
        };

        const onMouseUp = () => {
            isDraggingRef.current = false;
        };

        const onMouseOut = () => {
            isDraggingRef.current = false; // ウィンドウ外でドラッグ状態を解除
        };

        const onWheel = (event) => {
            if (modelRef.current) {
                const scaleFactor = 0.1; // 1回のホイール操作での拡大縮小率
                const delta = event.deltaY > 0 ? -scaleFactor : scaleFactor; // スクロール方向で拡大・縮小
                const newScale = Math.min(Math.max(scaleRef.current + delta, 0.5), 2); // 最小0.5倍、最大2倍
                scaleRef.current = newScale;
                modelRef.current.scale.set(newScale, newScale);
            }
        };

        const Live2DLoader = async () => {
            try {
                const model = await Live2DModel.from('../../public/model/Kei/kei_basic_free.model3.json');
                modelRef.current = model;
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
            if (modelRef.current) modelRef.current.position.set(0, 0);
        });
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mouseout', onMouseOut);
        window.addEventListener('wheel', onWheel);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mouseout', onMouseOut);
            window.removeEventListener('wheel', onWheel);
            cancelAnimationFrame(animationFrameRef.current);
            if (modelRef.current) {
                modelRef.current.destroy();
            }
        };
    }, []);

    useEffect(() => {
        if (voicevox.isSpeech && modelRef.current) {
            const audioBlob = new Blob([voicevox.audioData], { type: 'audio/wav' });
            const audioURL = URL.createObjectURL(audioBlob);

            modelRef.current.speak(audioURL,{
                onFinish: () => {
                    voicevox.setSpeech(false);
                }
            });
        }
    },[voicevox]);

    return <canvas ref={canvasRef} />;
});

export default Live2DView;
