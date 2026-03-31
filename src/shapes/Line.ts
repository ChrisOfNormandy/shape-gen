import { pixel } from "./pixel";
import { Shape, type IShape } from "./Shape";
import type ShapeOptions from "./ShapeOptions";

export default class Line extends Shape implements IShape {
    readonly endpointX: number
    readonly endpointY: number

    getPixelShape() {
        const pixels = [];
        let x1 = this.options.originX;
        let y1 = this.options.originY;
        const x2 = this.endpointX;
        const y2 = this.endpointY;

        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const sx = (x1 < x2) ? 1 : -1;
        const sy = (y1 < y2) ? 1 : -1;
        let err = dx - dy;

        while (true) {
            pixels.push(pixel(x1, y1, this.options.color, this.options.alpha));
            if (x1 === x2 && y1 === y2) break;
            const err2 = err * 2;
            if (err2 > -dy) {
                err -= dy;
                x1 += sx;
            }
            if (err2 < dx) {
                err += dx;
                y1 += sy;
            }
        }

        return pixels;
    }

    copy(): IShape {
        return new Line(this.endpointX, this.endpointY, this.options)
    }

    flipHorizontal(): IShape {
        const newOriginX = -this.options.originX;
        const newEndpointX = -this.endpointX;

        return new Line(newEndpointX, this.endpointY, this.options.setOrigin(newOriginX, this.options.originY))
    }

    flipVertical(): IShape {
        const newOriginY = -this.options.originY;
        const newEndpointY = -this.endpointY;

        return new Line(this.endpointX, newEndpointY, this.options.setOrigin(this.options.originX, newOriginY))
    }

    constructor(endpointX: number, endpointY: number, options: ShapeOptions) {
        super('line', options);
        this.endpointX = endpointX
        this.endpointY = endpointY
    }
}