export type ShapeType = 'ellipse' | 'rectangle' | 'line' | 'arc'
export type OutlineDefinition = Pixel[];

export interface Pixel {
    x: number
    y: number
    color: string
}

export interface ShapeOptions {
    layer: number
    color: string
    originX: number
    originY: number
    buffer: number
}