export type ShapeType = 'ellipse' | 'rectangle' | 'triangle' | 'custom'
export type OutlineDefinition = Pixel[];

export interface Pixel {
    x: number
    y: number
    color: string
}

export interface ShapeOptions {
    layer: number
    color: string
}