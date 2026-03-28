export type ShapeType = 'ellipse' | 'rectangle' | 'line' | 'arc'
export type OutlineDefinition = Pixel[];

export interface Pixel {
    color: string
    x: number
    y: number
}