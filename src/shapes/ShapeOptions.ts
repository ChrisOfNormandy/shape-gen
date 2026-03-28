import { randomColor } from "../forms/helpers"

export default class ShapeOptions {
    buffer: number
    color: string
    layer: number
    originX: number
    originY: number
    pivotX: number
    pivotY: number
    rotation: number

    setBuffer(buffer: number): this {
        this.buffer = buffer
        return this
    }

    setColor(color: string): this {
        this.color = color
        return this
    }

    setLayer(layer: number): this {
        this.layer = layer
        return this
    }

    setOrigin(originX: number, originY: number): this {
        this.originX = originX
        this.originY = originY
        return this
    }

    setPivot(pivotX: number, pivotY: number): this {
        this.pivotX = pivotX
        this.pivotY = pivotY
        return this
    }

    setRotation(rotation: number): this {
        this.rotation = rotation
        return this
    }

    from(options: ShapeOptions): this {
        this.buffer = options.buffer
        this.color = options.color
        this.layer = options.layer
        this.originX = options.originX
        this.originY = options.originY
        this.pivotX = options.pivotX
        this.pivotY = options.pivotY
        this.rotation = options.rotation
        return this
    }

    constructor() {
        this.buffer = 0
        this.color = randomColor();
        this.layer = 0
        this.originX = 0
        this.originY = 0
        this.pivotX = 0
        this.pivotY = 0
        this.rotation = 0
    }
}