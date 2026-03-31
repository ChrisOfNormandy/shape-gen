import { pixel } from "./pixel";
import { Shape, type IShape } from "./Shape";
import type ShapeOptions from "./ShapeOptions";
import type { OutlineDefinition } from "./types";

interface Point {
    x: number
    y: number
}

export default class Arc extends Shape implements IShape {

    readonly endpointX: number
    readonly endpointY: number
    readonly controlPointX: number
    readonly controlPointY: number

    private quadraticBezier(t: number, p0: Point, p1: Point, p2: Point): Point {
        // Ensure t is within the valid range [0, 1] for typical use cases
        // t = Math.max(0, Math.min(1, t)); 

        const oneMinusT = 1 - t;
        const oneMinusTsq = oneMinusT * oneMinusT;
        const tSq = t * t;

        const x = oneMinusTsq * p0.x + 2 * oneMinusT * t * p1.x + tSq * p2.x;
        const y = oneMinusTsq * p0.y + 2 * oneMinusT * t * p1.y + tSq * p2.y;

        return { x, y };
    }

    getPixelShape(): OutlineDefinition {
        const points: Point[] = []
        const p0 = { x: this.options.originX, y: this.options.originY }
        const p1 = { x: this.controlPointX, y: this.controlPointY }
        const p2 = { x: this.endpointX, y: this.endpointY }

        const step = 1 / (Math.max(Math.abs(this.endpointX - this.options.originX), Math.abs(this.endpointY - this.options.originY)) * 2)

        for (let t = 0; t <= 1; t += step) {
            points.push(this.quadraticBezier(t, p0, p1, p2))
        }

        return points.map(p => pixel(Math.round(p.x), Math.round(p.y), this.options.color, this.options.alpha));
    }

    copy(): IShape {
        return new Arc(this.endpointX, this.endpointY, this.controlPointX, this.controlPointY, this.options)
    }

    flipHorizontal(): IShape {
        const newOriginX = -this.options.originX;
        const newControlPointX = -this.controlPointX;
        const newEndpointX = -this.endpointX;

        return new Arc(newEndpointX, this.endpointY, newControlPointX, this.controlPointY, this.options.setOrigin(newOriginX, this.options.originY))
    }

    flipVertical(): IShape {
        const newOriginY = -this.options.originY;
        const newControlPointY = -this.controlPointY;
        const newEndpointY = -this.endpointY;

        return new Arc(this.endpointX, newEndpointY, this.controlPointX, newControlPointY, this.options.setOrigin(this.options.originX, newOriginY))
    }

    constructor(endpointX: number, endpointY: number, controlPointX: number, controlPointY: number, options: ShapeOptions) {
        super('arc', options);
        this.endpointX = endpointX
        this.endpointY = endpointY
        this.controlPointX = controlPointX
        this.controlPointY = controlPointY
    }
}
