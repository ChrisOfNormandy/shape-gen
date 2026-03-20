import type { OutlineDefinition, ShapeOptions, ShapeType } from "./types";

export interface IShape {
    getOptions(): ShapeOptions
    getType(): ShapeType
    getPixelShape(): OutlineDefinition
}

export class Shape {

    readonly type: ShapeType
    readonly buffer: number
    readonly options: ShapeOptions;
    readonly originX: number
    readonly originY: number

    getType(): ShapeType {
        return this.type;
    }

    getOptions() {
        return this.options;
    }

    constructor(type: ShapeType, buffer: number, options: ShapeOptions, originX = 0, originY = 0) {
        this.type = type;
        this.buffer = buffer;
        this.options = options;
        this.originX = originX;
        this.originY = originY;
    }
}