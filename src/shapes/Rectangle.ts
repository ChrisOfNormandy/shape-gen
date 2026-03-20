import { Shape, type IShape } from "./Shape";
import type { ShapeOptions } from "./types";

export default class Rectangle extends Shape implements IShape {

    readonly width: number
    readonly height: number

    getPixelShape() {
        const outlineDefinition = []
        for (let y = 0; y <= this.height; y++) {
            for (let x = 0; x <= this.width; x++) {
                if (x === 0 || x === this.width || y === 0 || y === this.height)
                    outlineDefinition.push({ x: x + this.originX, y: y + this.originY, color: this.options.color })
            }
        }

        return outlineDefinition
    }

    constructor(width: number, height: number, buffer: number, options: ShapeOptions) {
        super('rectangle', buffer, options);
        this.width = width;
        this.height = height;
    }
}