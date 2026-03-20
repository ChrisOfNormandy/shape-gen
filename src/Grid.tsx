import { useShapes } from "./ShapeProvider";
import type { OutlineDefinition, Pixel } from "./shapes/types";

interface GridProps {
    layer: number
}

function getBoundary(definition: OutlineDefinition) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const pixel of definition) {
        if (pixel.x < minX) minX = pixel.x;
        if (pixel.x > maxX) maxX = pixel.x;
        if (pixel.y < minY) minY = pixel.y;
        if (pixel.y > maxY) maxY = pixel.y;
    }

    // Add border of 1 pixel around the shape
    minX -= 1;
    maxX += 1;
    minY -= 1;
    maxY += 1;

    return { minX, maxX, minY, maxY };
}

function merge2dArray(arrays: OutlineDefinition[]): OutlineDefinition {
    if (arrays.length === 0) return []

    const merged: OutlineDefinition = []
    for (const array of arrays) {
        for (const pixel of array) {
            const existingPixel = merged.find(p => p.x === pixel.x && p.y === pixel.y)
            if (!existingPixel || existingPixel.color < pixel.color) {
                if (existingPixel) {
                    existingPixel.color = pixel.color
                } else {
                    merged.push({ ...pixel })
                }
            }
        }
    }

    return merged
}

export default function Grid({ layer }: Readonly<GridProps>) {
    const { shapes } = useShapes();

    const shapesThisLayer = shapes.filter(shape => shape.getOptions().layer === layer)
    const pixelData = merge2dArray(shapesThisLayer.map(shape => shape.getPixelShape()));
    const boundary = getBoundary(pixelData);

    if (pixelData.length !== 0)
        pixelData.push({ x: 0, y: 0, color: 'black' })

    // Create a grid based on the boundary and pixel data
    const grid: (Pixel | null)[][] = [];

    // If the minX or minY is negative, we need to shift the pixel coordinates to fit into the grid
    if (boundary.minX < 0 || boundary.minY < 0) {
        const shiftX = boundary.minX < 0 ? -boundary.minX : 0;
        const shiftY = boundary.minY < 0 ? -boundary.minY : 0;

        for (const pixel of pixelData) {
            pixel.x += shiftX;
            pixel.y += shiftY;
        }

        boundary.maxX += shiftX;
        boundary.maxY += shiftY;
    }

    for (let y = 0; y <= boundary.maxY; y++) {
        const row: (Pixel | null)[] = [];
        for (let x = 0; x <= boundary.maxX; x++) {
            row.push(null);
        }
        grid.push(row);
    }

    for (const pixel of pixelData) {
        grid[pixel.y][pixel.x] = pixel;
    }

    return <div className='grid-layer'>
        {
            grid.map((row, y) => (
                <div key={y} className='grid-row'>
                    {
                        row.map((pixel, x) => {
                            return <div key={x} className='grid-cell' style={{ backgroundColor: pixel?.color ?? '' }} title={`(${x + boundary.minX}, ${y + boundary.minY})`}></div>
                        })
                    }
                </div>
            ))
        }
    </div>
}