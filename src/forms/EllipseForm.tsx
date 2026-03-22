import { Button } from "@syren-dev-tech/confects/buttons"
import { ColorInput, DecimalInput, IntegerInput } from "@syren-dev-tech/confects/inputs"
import { ThemeOptions } from "@syren-dev-tech/confetti/themes"
import { useActionState } from "react"
import { useShapes } from "../ShapeProvider"
import Ellipse from "../shapes/Ellipse"

export default function EllipseForm() {

    const { setShapes } = useShapes()

    const [error, submitAction, isPending] = useActionState<Error | null, FormData>(
        (_previousState, formData) => {
            const radiusX = formData.get('radiusX')
            const radiusY = formData.get('radiusY')
            const buffer = formData.get('buffer')
            const layer = formData.get('layer')
            const color = formData.get('color')

            if (typeof radiusX !== 'string' || typeof radiusY !== 'string' || typeof buffer !== 'string' || typeof layer !== 'string' || typeof color !== 'string') {
                throw new TypeError('Invalid input')
            }

            const parsedRadiusX = Number.parseInt(radiusX)
            const parsedRadiusY = Number.parseInt(radiusY)
            const parsedBuffer = Number.parseFloat(buffer)
            const parsedLayer = Number.parseInt(layer)

            if (Number.isNaN(parsedRadiusX) || Number.isNaN(parsedRadiusY) || Number.isNaN(parsedBuffer) || Number.isNaN(parsedLayer)) {
                throw new TypeError('Invalid input')
            }

            const newEllipse = new Ellipse(parsedRadiusX, parsedRadiusY, parsedBuffer, { layer: parsedLayer, color })
            setShapes(prev => [...prev, newEllipse])

            return null;
        }, null
    )

    return <form action={submitAction}>
        {error && <div className="error">{error.message}</div>}

        <div className='radius-inputs'>
            <label htmlFor="radiusX">Radius X:</label>
            <IntegerInput id="radiusX" name="radiusX" defaultValue={5} theme={new ThemeOptions({ background: { style: 'main' } })} />

            <label htmlFor="radiusY">Radius Y:</label>
            <IntegerInput id="radiusY" name="radiusY" defaultValue={5} theme={new ThemeOptions({ background: { style: 'main' } })} />
        </div>

        <label htmlFor="buffer">Buffer:</label>
        <DecimalInput id="buffer" name="buffer" defaultValue={0.1} step={0.01} theme={new ThemeOptions({ background: { style: 'main' } })} />

        <label htmlFor="color">Color:</label>
        <ColorInput id="color" name="color" defaultValue="#ff0000" theme={new ThemeOptions({ background: { style: 'main' } })} />

        <label htmlFor="layer">Layer:</label>
        <IntegerInput id="layer" name="layer" defaultValue={0} theme={new ThemeOptions({ background: { style: 'main' } })} />

        <Button type='submit' disabled={isPending} theme={new ThemeOptions({ background: { style: 'success' } })}>Create Ellipse</Button>
    </form>
}