import { checkValueIsNumber, checkValueIsString } from "../helpers";
import { IntegerInput } from "@syren-dev-tech/confects/inputs";
import Rectangle from "../../shapes/Rectangle";
import type { IShape } from "../../shapes/Shape";
import { ThemeOptions } from "@syren-dev-tech/confetti/themes";

export function handleRectangleFormSubmit(formData: FormData): IShape | Error {
    const width = formData.get('width')
    const height = formData.get('height')
    const buffer = formData.get('buffer')
    const layer = formData.get('layer')
    const color = formData.get('color')
    const originX = formData.get('originX')
    const originY = formData.get('originY')

    const typeError = checkValueIsString(width, height, buffer, layer, color, originX, originY)
    if (typeError) return typeError

    const parsedWidth = Number.parseInt(width as string)
    const parsedHeight = Number.parseInt(height as string)
    const parsedBuffer = Number.parseFloat(buffer as string)
    const parsedLayer = Number.parseInt(layer as string)
    const parsedOriginX = Number.parseInt(originX as string)
    const parsedOriginY = Number.parseInt(originY as string)

    const valueError = checkValueIsNumber(parsedWidth, parsedHeight, parsedBuffer, parsedLayer, parsedOriginX, parsedOriginY)
    if (valueError) return valueError

    return new Rectangle(parsedWidth, parsedHeight, { layer: parsedLayer, color: color as string, originX: parsedOriginX, originY: parsedOriginY, buffer: parsedBuffer })
}

interface RectangleFormProps {
    shape?: IShape
}

export default function RectangleForm({ shape }: Readonly<RectangleFormProps>) {

    const rect = shape as Rectangle | undefined

    return <div className='shape-inputs'>
        <label htmlFor="width">Width:</label>
        <IntegerInput type="number" id="width" name="width" defaultValue={rect ? rect.width : 5} theme={new ThemeOptions({ background: { style: 'main' } })} />

        <label htmlFor="height">Height:</label>
        <IntegerInput type="number" id="height" name="height" defaultValue={rect ? rect.height : 5} theme={new ThemeOptions({ background: { style: 'main' } })} />
    </div>
}