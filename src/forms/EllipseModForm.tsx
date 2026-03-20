import { useActionState } from "react";
import Ellipse from "../shapes/Ellipse";
import { useShapes } from "../ShapeProvider";

interface EllipseModFormProps {
    ellipse: Ellipse
}

export default function EllipseModForm({ ellipse }: Readonly<EllipseModFormProps>) {

    const { setShapes } = useShapes();

    const [error, submitAction, isPending] = useActionState<Error | null, FormData>(
        (_previousState, formData) => {
            const radiusX = formData.get('radiusX')
            const radiusY = formData.get('radiusY')
            const buffer = formData.get('buffer')
            const layer = formData.get('layer')
            const color = formData.get('color')

            if (typeof radiusX !== 'string' || typeof radiusY !== 'string' || typeof buffer !== 'string' || typeof layer !== 'string' || typeof color !== 'string') {
                return new TypeError('Invalid input')
            }

            const parsedRadiusX = Number.parseInt(radiusX)
            const parsedRadiusY = Number.parseInt(radiusY)
            const parsedBuffer = Number.parseFloat(buffer)
            const parsedLayer = Number.parseInt(layer)

            if (Number.isNaN(parsedRadiusX) || Number.isNaN(parsedRadiusY) || Number.isNaN(parsedBuffer) || Number.isNaN(parsedLayer)) {
                return new TypeError('Invalid input (NaN)')
            }

            const newEllipse = new Ellipse(parsedRadiusX, parsedRadiusY, parsedBuffer, { layer: parsedLayer, color });
            // Delete old ellipse and add new one
            setShapes(prev => [...prev.filter(shape => shape !== ellipse), newEllipse])

            return null;
        }, null
    )

    return <form action={submitAction}>
        {error && <div className="error">{error.message}</div>}

        <div>
            <label>
                Radius X:
                <input type="number" defaultValue={ellipse.radiusX} name='radiusX' />
            </label>
            <label>
                Radius Y:
                <input type="number" defaultValue={ellipse.radiusY} name='radiusY' />
            </label>
        </div>

        <label>
            Buffer:
            <input type="number" defaultValue={ellipse.buffer} name='buffer' step={0.01} />
        </label>

        <label>
            Color:
            <input type="color" defaultValue={ellipse.getOptions().color} name='color' />
        </label>

        <label>
            Layer:
            <input type="number" defaultValue={ellipse.getOptions().layer} name='layer' />
        </label>

        <button type="submit" disabled={isPending}>Save</button>
    </form>
}