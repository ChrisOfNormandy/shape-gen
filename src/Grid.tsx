import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { IShape } from "./shapes/Shape";
import type { OutlineDefinition, Pixel } from "./shapes/types";
import './styles/grid.scss';
import { useShapes } from "./ShapeProvider";

interface GridProps {
    shapes: IShape[]
}

const CELL_SIZE = 24;

function merge2dArray(arrays: OutlineDefinition[]): OutlineDefinition {
    if (arrays.length === 0) return []

    const merged = new Map<string, Pixel>();

    for (const array of arrays) {
        for (const pixel of array) {
            const key = `${pixel.x},${pixel.y}`;
            // Keep the last pixel drawn at this coordinate.
            merged.set(key, { ...pixel });
        }
    }

    return Array.from(merged.values())
}

export default function Grid({ shapes }: Readonly<GridProps>) {

    const { origin, setOrigin } = useShapes();
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [hoverCoordinate, setHoverCoordinate] = useState<string | null>(null);
    const [dragStart, setDragStart] = useState<{
        pointerId: number
        pointerX: number
        pointerY: number
        originX: number
        originY: number
    } | null>(null);

    const pixelData = useMemo(() => merge2dArray(shapes.map(shape => shape.getPixelShape())), [shapes]);
    const filledPixels = useMemo(() => {
        return new Set(pixelData.map(pixel => `${pixel.x},${pixel.y}`));
    }, [pixelData]);

    const getGridCoordinateFromCanvas = useCallback((canvasX: number, canvasY: number) => {
        const gridX = Math.floor((canvasX - (canvasSize.width / 2)) / CELL_SIZE + origin.x);
        const gridY = Math.floor((canvasY - (canvasSize.height / 2)) / CELL_SIZE + origin.y);
        return { x: gridX, y: gridY };
    }, [canvasSize.height, canvasSize.width, origin.x, origin.y]);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const resizeObserver = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect;
            setCanvasSize({ width, height });
        });

        resizeObserver.observe(wrapper);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || canvasSize.width <= 0 || canvasSize.height <= 0) {
            return;
        }

        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(canvasSize.width * dpr);
        canvas.height = Math.floor(canvasSize.height * dpr);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

        const startX = ((canvasSize.width / 2 - (origin.x * CELL_SIZE)) % CELL_SIZE + CELL_SIZE) % CELL_SIZE;
        const startY = ((canvasSize.height / 2 - (origin.y * CELL_SIZE)) % CELL_SIZE + CELL_SIZE) % CELL_SIZE;

        ctx.beginPath();
        ctx.strokeStyle = '#d6d6d6';
        ctx.lineWidth = 1;

        for (let x = startX; x <= canvasSize.width; x += CELL_SIZE) {
            ctx.moveTo(Math.round(x) + 0.5, 0);
            ctx.lineTo(Math.round(x) + 0.5, canvasSize.height);
        }

        for (let y = startY; y <= canvasSize.height; y += CELL_SIZE) {
            ctx.moveTo(0, Math.round(y) + 0.5);
            ctx.lineTo(canvasSize.width, Math.round(y) + 0.5);
        }

        ctx.stroke();

        const axisX = canvasSize.width / 2 - (origin.x * CELL_SIZE);
        const axisY = canvasSize.height / 2 - (origin.y * CELL_SIZE);

        ctx.beginPath();
        ctx.strokeStyle = '#999999';
        ctx.lineWidth = 1.5;
        ctx.moveTo(Math.round(axisX) + 0.5, 0);
        ctx.lineTo(Math.round(axisX) + 0.5, canvasSize.height);
        ctx.moveTo(0, Math.round(axisY) + 0.5);
        ctx.lineTo(canvasSize.width, Math.round(axisY) + 0.5);
        ctx.stroke();

        for (const pixel of pixelData) {
            const drawX = (canvasSize.width / 2) + ((pixel.x - origin.x) * CELL_SIZE);
            const drawY = (canvasSize.height / 2) + ((pixel.y - origin.y) * CELL_SIZE);

            if (drawX + CELL_SIZE < 0 || drawX > canvasSize.width || drawY + CELL_SIZE < 0 || drawY > canvasSize.height) {
                continue;
            }

            ctx.fillStyle = pixel.color;
            ctx.fillRect(drawX + 1, drawY + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        }
    }, [canvasSize.height, canvasSize.width, origin.x, origin.y, pixelData]);

    const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        setDragStart({
            pointerId: event.pointerId,
            pointerX: event.clientX,
            pointerY: event.clientY,
            originX: origin.x,
            originY: origin.y,
        });
    };

    const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const canvasX = event.clientX - rect.left;
        const canvasY = event.clientY - rect.top;

        if (dragStart?.pointerId === event.pointerId) {
            const deltaX = event.clientX - dragStart.pointerX;
            const deltaY = event.clientY - dragStart.pointerY;
            const translatedOriginX = dragStart.originX - Math.round(deltaX / CELL_SIZE);
            const translatedOriginY = dragStart.originY - Math.round(deltaY / CELL_SIZE);

            setOrigin({ x: translatedOriginX, y: translatedOriginY });
            return;
        }

        const coordinate = getGridCoordinateFromCanvas(canvasX, canvasY);
        const key = `${coordinate.x},${coordinate.y}`;
        setHoverCoordinate(filledPixels.has(key) ? `(${coordinate.x}, ${coordinate.y})` : null);
    };

    const onPointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
        if (dragStart?.pointerId === event.pointerId) {
            event.currentTarget.releasePointerCapture(event.pointerId);
            setDragStart(null);
        }
    };

    return <div className='grid'>
        <div className='grid-internal' ref={wrapperRef}>
            <canvas
                className='grid-canvas'
                ref={canvasRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onPointerLeave={() => setHoverCoordinate(null)}
            />
            <div className='grid-hover-coordinate'>
                {hoverCoordinate ? `Filled: ${hoverCoordinate}` : 'Hover over a filled square'}
            </div>
        </div>
    </div>
}