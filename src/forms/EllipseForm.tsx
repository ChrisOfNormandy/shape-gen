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

        <div>
            <label>Radius X:</label>
            <input type="number" id="radiusX" name="radiusX" defaultValue={5} />

            <label>Radius Y:</label>
            <input type="number" id="radiusY" name="radiusY" defaultValue={5} />
        </div>

        <label>Buffer:</label>
        <input type="number" id="buffer" name="buffer" defaultValue={0.1} step={0.01} />

        <label>Color:</label>
        <input type="color" id="color" name="color" defaultValue="#ff0000" />

        <label>Layer:</label>
        <input type="number" id="layer" name="layer" defaultValue={0} />

        <button type='submit' disabled={isPending}>Create Ellipse</button>
    </form>
}