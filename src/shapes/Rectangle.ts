import { Shape, type IShape } from "./Shape";
import type { ShapeOptions } from "./types";

export default class Rectangle extends Shape implements IShape {

    readonly width: number
    readonly height: number

    getPixelShape() {
        const outlineDefinition = []
        for (let y = 1; y <= this.height; y++) {
            for (let x = 1; x <= this.width; x++) {
                if (x === 1 || x === this.width || y === 1 || y === this.height)
                    outlineDefinition.push({ x: x + this.options.originX, y: y + this.options.originY, color: this.options.color })
            }
        }

        return outlineDefinition
    }

    copy(): IShape {
        return new Rectangle(this.width, this.height, { ...this.options })
    }

    constructor(width: number, height: number, options: ShapeOptions) {
        super('rectangle', options);
        this.width = width;
        this.height = height;
    }
}