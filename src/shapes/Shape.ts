import type { OutlineDefinition, ShapeOptions, ShapeType } from "./types";

export interface IShape {
    type: ShapeType
    options: ShapeOptions;
    getOptions(): ShapeOptions
    getType(): ShapeType
    getPixelShape(): OutlineDefinition
    copy(): IShape
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