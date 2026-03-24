import type { IShape } from "../shapes/Shape"
import type { ShapeType } from "../shapes/types"
import { handleArcFormSubmit } from "./shapes/ArcForm"
import { handleEllipseFormSubmit } from "./shapes/EllipseForm"
import { handleLineFormSubmit } from "./shapes/LineForm"
import { handleRectangleFormSubmit } from "./shapes/RectangleForm"

export function checkValueIsString(...values: (FormDataEntryValue | null)[]): Error | null {
    for (const value of values) {
        if (typeof value !== 'string') {
            return new TypeError('Invalid input')
        }
    }

    return null
}

export function checkValueIsNumber(...values: number[]): Error | null {
    for (const value of values) {
        if (typeof value !== 'number' || Number.isNaN(value)) {
            return new TypeError('Invalid input')
        }
    }

    return null
}

export function randomColor() {
    return `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`
}

export function parseFormDataForShape(formData: FormData, shapeType: ShapeType): IShape | Error {
    switch (shapeType) {
        case 'ellipse': return handleEllipseFormSubmit(formData)
        case 'rectangle': return handleRectangleFormSubmit(formData)
        case 'line': return handleLineFormSubmit(formData)
        case 'arc': return handleArcFormSubmit(formData)
        default: return new TypeError('Invalid shape type')
    }
}