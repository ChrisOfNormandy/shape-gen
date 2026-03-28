import { checkValueIsNumber, checkValueIsString } from "../helpers"
import { IntegerInput } from "@syren-dev-tech/confects/inputs"
import { ThemeOptions } from "@syren-dev-tech/confetti/themes"
import Arc from "../../shapes/Arc"
import type { IShape } from "../../shapes/Shape"
import ShapeOptions from "../../shapes/ShapeOptions"

export function handleArcFormSubmit(formData: FormData): Arc | Error {
    const endpointX = formData.get('endpointX')
    const endpointY = formData.get('endpointY')
    const buffer = formData.get('buffer')
    const layer = formData.get('layer')
    const color = formData.get('color')
    const originX = formData.get('originX')
    const originY = formData.get('originY')
    const controlPointX = formData.get('controlPointX')
    const controlPointY = formData.get('controlPointY')

    const typeError = checkValueIsString(endpointX, endpointY, controlPointX, controlPointY, buffer, layer, color, originX, originY)
    if (typeError) return typeError

    const parsedEndpointX = Number.parseInt(endpointX as string)
    const parsedEndpointY = Number.parseInt(endpointY as string)
    const parsedControlPointX = Number.parseInt(controlPointX as string)
    const parsedControlPointY = Number.parseInt(controlPointY as string)
    const parsedBuffer = Number.parseFloat(buffer as string)
    const parsedLayer = Number.parseInt(layer as string)
    const parsedOriginX = Number.parseInt(originX as string)
    const parsedOriginY = Number.parseInt(originY as string)

    const valueError = checkValueIsNumber(parsedEndpointX, parsedEndpointY, parsedControlPointX, parsedControlPointY, parsedBuffer, parsedLayer, parsedOriginX, parsedOriginY)
    if (valueError) return valueError

    const options = new ShapeOptions()
        .setBuffer(parsedBuffer)
        .setLayer(parsedLayer)
        .setColor(color as string)
        .setOrigin(parsedOriginX, parsedOriginY)

    return new Arc(parsedEndpointX, parsedEndpointY, parsedControlPointX, parsedControlPointY, options)
}

export default function ArcForm({ shape }: Readonly<{ shape?: IShape }>) {

    const arc = shape as Arc | undefined

    return <div className='shape-inputs'>
        <label htmlFor="endpointX">Endpoint X:</label>
        <IntegerInput id="endpointX" name="endpointX" defaultValue={arc ? arc.endpointX : 5} theme={new ThemeOptions({ background: { style: 'main' } })} />

        <label htmlFor="endpointY">Endpoint Y:</label>
        <IntegerInput id="endpointY" name="endpointY" defaultValue={arc ? arc.endpointY : 5} theme={new ThemeOptions({ background: { style: 'main' } })} />

        <label htmlFor="controlPointX">Control Point X:</label>
        <IntegerInput id="controlPointX" name="controlPointX" defaultValue={arc ? arc.controlPointX : 5} theme={new ThemeOptions({ background: { style: 'main' } })} />

        <label htmlFor="controlPointY">Control Point Y:</label>
        <IntegerInput id="controlPointY" name="controlPointY" defaultValue={arc ? arc.controlPointY : 5} theme={new ThemeOptions({ background: { style: 'main' } })} />
    </div>
}