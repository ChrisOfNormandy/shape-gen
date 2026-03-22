import { Shape, type IShape } from "./Shape";
import type { OutlineDefinition, ShapeOptions } from "./types";

export default class Ellipse extends Shape implements IShape {

    readonly radiusX: number
    readonly radiusY: number

    private isEllipseOutline(x: number, y: number): boolean {
        const cx = 0
        const cy = 0
        const rx = this.radiusX + this.buffer - 1
        const ry = this.radiusY + this.buffer - 1

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
    getPixelShape() {
        const outlineDefinition: OutlineDefinition = [];

        for (let y = -this.radiusY; y <= this.radiusY; y++) {
            for (let x = -this.radiusX; x <= this.radiusX; x++) {
                if (this.isEllipseOutline(x, y))
                    outlineDefinition.push({ x: x + this.originX, y: y + this.originY, color: this.options.color })
            }
        }

        return outlineDefinition
    }

    constructor(radiusX: number, radiusY: number, buffer: number, options: ShapeOptions) {
        super('ellipse', buffer, options);
        this.radiusX = radiusX
        this.radiusY = radiusY
    }
}