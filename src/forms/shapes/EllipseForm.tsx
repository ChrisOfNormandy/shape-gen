import { IntegerInput } from "@syren-dev-tech/confects/inputs"
import { ThemeOptions } from "@syren-dev-tech/confetti/themes"
import Ellipse from "../../shapes/Ellipse"
import type { IShape } from "../../shapes/Shape"
import { checkValueIsNumber, checkValueIsString } from "../helpers"

export function handleEllipseFormSubmit(formData: FormData): IShape | Error {
    const radiusX = formData.get('radiusX')
    const radiusY = formData.get('radiusY')
    const buffer = formData.get('buffer')
    const layer = formData.get('layer')
    const color = formData.get('color')
    const originX = formData.get('originX')
    const originY = formData.get('originY')

    const typeError = checkValueIsString(radiusX, radiusY, buffer, layer, color, originX, originY)
    if (typeError) return typeError

    const parsedRadiusX = Number.parseInt(radiusX as string)
    const parsedRadiusY = Number.parseInt(radiusY as string)
    const parsedBuffer = Number.parseFloat(buffer as string)
    const parsedLayer = Number.parseInt(layer as string)
    const parsedOriginX = Number.parseInt(originX as string)
    const parsedOriginY = Number.parseInt(originY as string)

    const valueError = checkValueIsNumber(parsedRadiusX, parsedRadiusY, parsedBuffer, parsedLayer, parsedOriginX, parsedOriginY)
    if (valueError) return valueError

    return new Ellipse(parsedRadiusX, parsedRadiusY, { layer: parsedLayer, color: color as string, originX: parsedOriginX, originY: parsedOriginY, buffer: parsedBuffer })
}

interface EllipseFormProps {
    shape?: IShape
}

export default function EllipseForm({ shape }: Readonly<EllipseFormProps>) {

    const ellipse = shape as Ellipse | undefined

    return <div className='shape-inputs'>
        <label htmlFor="radiusX">Radius X:</label>
        <IntegerInput id="radiusX" name="radiusX" defaultValue={ellipse ? ellipse.radiusX : 5} theme={new ThemeOptions({ background: { style: 'main' } })} />

        <label htmlFor="radiusY">Radius Y:</label>
        <IntegerInput id="radiusY" name="radiusY" defaultValue={ellipse ? ellipse.radiusY : 5} theme={new ThemeOptions({ background: { style: 'main' } })} />
    </div>
}