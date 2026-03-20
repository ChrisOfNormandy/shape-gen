import { useActionState } from "react";
import { useShapes } from "../ShapeProvider";
import Rectangle from "../shapes/Rectangle";

interface RectangleModFormProps {
    rectangle: Rectangle
}

export default function RectangleModForm({ rectangle }: Readonly<RectangleModFormProps>) {

    const { setShapes } = useShapes();

    const [error, submitAction, isPending] = useActionState<Error | null, FormData>(
        (_previousState, formData) => {
            const width = formData.get('width')
            const height = formData.get('height')
            const buffer = formData.get('buffer')
            const layer = formData.get('layer')
            const color = formData.get('color')

            if (typeof width !== 'string' || typeof height !== 'string' || typeof buffer !== 'string' || typeof layer !== 'string' || typeof color !== 'string') {
                return new TypeError('Invalid input')
            }

            const parsedWidth = Number.parseInt(width)
            const parsedHeight = Number.parseInt(height)
            const parsedBuffer = Number.parseFloat(buffer)
            const parsedLayer = Number.parseInt(layer)

            if (Number.isNaN(parsedWidth) || Number.isNaN(parsedHeight) || Number.isNaN(parsedBuffer) || Number.isNaN(parsedLayer)) {
                return new TypeError('Invalid input (NaN)')
            }

            const newRectangle = new Rectangle(parsedWidth, parsedHeight, parsedBuffer, { layer: parsedLayer, color });
            // Delete old rectangle and add new one
            setShapes(prev => [...prev.filter(shape => shape !== rectangle), newRectangle])

            return null;
        }, null
    )

    return <form action={submitAction}>
        {error && <div className="error">{error.message}</div>}

        <div>
            <label>Width:</label>
            <input type="number" defaultValue={rectangle.width} name='width' />

            <label>Height:</label>
            <input type="number" defaultValue={rectangle.height} name='height' />

        </div>

        <label>Buffer:</label>
        <input type="number" defaultValue={rectangle.buffer} name='buffer' step={0.01} />


        <label>Color:</label>
        <input type="color" defaultValue={rectangle.getOptions().color} name='color' />


        <label>Layer:</label>
        <input type="number" defaultValue={rectangle.getOptions().layer} name='layer' />

        <button type='submit' disabled={isPending}>Modify Rectangle</button>
    </form>
}