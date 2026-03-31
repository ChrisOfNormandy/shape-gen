import type ShapeOptions from "./ShapeOptions";
import type { OutlineDefinition, ShapeType } from "./types";

export interface IShape {
    options: ShapeOptions;
    type: ShapeType
    copy(): IShape
    flipHorizontal(): IShape
    flipVertical(): IShape
    getOptions(): ShapeOptions
    getPixelShape(): OutlineDefinition
    getType(): ShapeType
}

export class Shape {

    readonly type: ShapeType
    readonly options: ShapeOptions;

    getType(): ShapeType {
        return this.type;
    }

    getOptions() {
        return this.options;
    }

    constructor(type: ShapeType, options: ShapeOptions) {
        this.type = type;
        this.options = options;
    }
}