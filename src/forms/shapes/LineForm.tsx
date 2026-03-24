import { IntegerInput } from "@syren-dev-tech/confects/inputs"
import { ThemeOptions } from "@syren-dev-tech/confetti/themes"
import type { IShape } from "../../shapes/Shape"
import Line from "../../shapes/Line"
import { checkValueIsNumber, checkValueIsString } from "../helpers"

export function handleLineFormSubmit(formData: FormData): IShape | Error {
    const endpointX = formData.get('endpointX')
    const endpointY = formData.get('endpointY')
    const buffer = formData.get('buffer')
    const layer = formData.get('layer')
    const color = formData.get('color')
    const originX = formData.get('originX')
    const originY = formData.get('originY')

    const typeError = checkValueIsString(endpointX, endpointY, buffer, layer, color, originX, originY)
    if (typeError) return typeError

    const parsedEndpointX = Number.parseInt(endpointX as string)
    const parsedEndpointY = Number.parseInt(endpointY as string)
    const parsedBuffer = Number.parseFloat(buffer as string)
    const parsedLayer = Number.parseInt(layer as string)
    const parsedOriginX = Number.parseInt(originX as string)
    const parsedOriginY = Number.parseInt(originY as string)

    const valueError = checkValueIsNumber(parsedEndpointX, parsedEndpointY, parsedBuffer, parsedLayer, parsedOriginX, parsedOriginY)
    if (valueError) return valueError

    return new Line(parsedEndpointX, parsedEndpointY, { layer: parsedLayer, color: color as string, originX: parsedOriginX, originY: parsedOriginY, buffer: parsedBuffer })
}

export default function LineForm({ shape }: Readonly<{ shape?: IShape }>) {

    const line = shape as Line | undefined

    return <div className='shape-inputs'>
        <label htmlFor="endpointX">Endpoint X:</label>
        <IntegerInput id="endpointX" name="endpointX" defaultValue={line ? line.endpointX : 5} theme={new ThemeOptions({ background: { style: 'main' } })} />

        <label htmlFor="endpointY">Endpoint Y:</label>
        <IntegerInput id="endpointY" name="endpointY" defaultValue={line ? line.endpointY : 5} theme={new ThemeOptions({ background: { style: 'main' } })} />
    </div>
}