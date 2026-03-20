import { useMemo, useState } from "react"
import './styles.scss';

function isEllipseOutline(x: number, y: number, cx: number, cy: number, rx: number, ry: number): boolean {
    // Equation of an ellipse: ((x-cx)^2 / rx^2) + ((y-cy)^2 / ry^2) = 1
    const getEllipseValue = (px: number, py: number) => {
        const normX = Math.pow(px - cx, 2) / Math.pow(rx, 2);
        const normY = Math.pow(py - cy, 2) / Math.pow(ry, 2);
        return normX + normY;
    };

    const currentVal = getEllipseValue(x, y);

    // Pixel must be outside or on the ellipse
    if (currentVal <= 1) return false;

    // Check if any neighboring pixel is inside the ellipse
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;
            if (getEllipseValue(x + dx, y + dy) < 1) {
                return true;
            }
        }
    }

    return false;
}

// Generates a 3D boolean array representing an ellipse outline with the given radii
function getPixelEllipse(radiusX: number, radiusY: number, radiusZ: number, buffer: number) {
    const shape: boolean[][][] = []

    const trueZ = radiusZ
    const trueY = radiusY * 2 + 2
    const trueX = radiusX * 2 + 2

    for (let z = 0; z < trueZ; z++) {
        const layer: boolean[][] = []
        for (let y = 0; y <= trueY; y++) {
            const row: boolean[] = []
            for (let x = 0; x <= trueX; x++) {
                const isOutline = isEllipseOutline(x, y, radiusX + 1, radiusY + 1, radiusX - 1 + buffer, radiusY - 1 + buffer)
                row.push(isOutline)
            }
            layer.push(row)
        }
        shape.push(layer)
    }

    return shape
}

export default function App() {

    const [radiusX, setRadiusX] = useState(9)
    const [radiusY, setRadiusY] = useState(9)
    const [radiusZ, setRadiusZ] = useState(1)
    const [buffer, setBuffer] = useState(0.1)
    const [originX, setOriginX] = useState(0)
    const [originY, setOriginY] = useState(0)
    const [originZ, setOriginZ] = useState(0)

    const shape = useMemo(() => getPixelEllipse(radiusX, radiusY, radiusZ, buffer), [radiusX, radiusY, radiusZ, buffer])

    return <main>
        <div>
            <div>
                <label>Radius X:</label>
                <input type="number" value={radiusX} onChange={e => setRadiusX(Number.parseInt(e.target.value))} />
            </div>

            <div>
                <label>Radius Y:</label>
                <input type="number" value={radiusY} onChange={e => setRadiusY(Number.parseInt(e.target.value))} />
            </div>

            <div>
                <label>Radius Z:</label>
                <input type="number" value={radiusZ} onChange={e => setRadiusZ(Number.parseInt(e.target.value))} />
            </div>

            <div>
                <label>Buffer:</label>
                <input type="number" value={buffer} onChange={e => setBuffer(Number.parseFloat(e.target.value))} step={0.01} min={-1} max={1} />
            </div>

            <div>
                <label>Origin X:</label>
                <input type="number" value={originX} onChange={e => setOriginX(Number.parseInt(e.target.value))} />
            </div>

            <div>
                <label>Origin Y:</label>
                <input type="number" value={originY} onChange={e => setOriginY(Number.parseInt(e.target.value))} />
            </div>

            <div>
                <label>Origin Z:</label>
                <input type="number" value={originZ} onChange={e => setOriginZ(Number.parseInt(e.target.value))} />
            </div>
        </div>

        <div className='grid-container'>
            {
                shape.map((layer, z) => <div key={z}>
                    <div>Layer {z}</div>
                    {
                        layer.map((row, y) => <div key={y} className='grid-row'>
                            {
                                row.map((cell, x) => <div key={x} className={`grid-cell ${cell ? 'active' : 'not-active'}`} title={`(${x - radiusX - 1 + originX}, ${y - radiusY - 1 + originY})`} />)
                            }
                        </div>)
                    }
                </div>)
            }
        </div>
    </main>
}