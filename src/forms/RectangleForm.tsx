import { useActionState } from "react";
import { useShapes } from "../ShapeProvider";
import Rectangle from "../shapes/Rectangle";

export default function RectangleForm() {

    const { setShapes } = useShapes()

    const [error, submitAction, isPending] = useActionState<Error | null, FormData>(
        (_previousState, formData) => {
            const width = formData.get('width')
            const height = formData.get('height')
            const buffer = formData.get('buffer')
            const layer = formData.get('layer')
            const color = formData.get('color')

            if (typeof width !== 'string' || typeof height !== 'string' || typeof buffer !== 'string' || typeof layer !== 'string' || typeof color !== 'string') {
                throw new TypeError('Invalid input')
            }

            const parsedWidth = Number.parseInt(width)
            const parsedHeight = Number.parseInt(height)
            const parsedBuffer = Number.parseFloat(buffer)
            const parsedLayer = Number.parseInt(layer)

            if (Number.isNaN(parsedWidth) || Number.isNaN(parsedHeight) || Number.isNaN(parsedBuffer) || Number.isNaN(parsedLayer)) {
                throw new TypeError('Invalid input')
            }

            const newRectangle = new Rectangle(parsedWidth, parsedHeight, parsedBuffer, { layer: parsedLayer, color })
            setShapes(prev => [...prev, newRectangle])

            return null;
        }, null
    )

    return <form action={submitAction}>
        {error && <div className="error">{error.message}</div>}

        <div>
            <label>Width:</label>
            <input type="number" id="width" name="width" defaultValue={5} />

            <label>Height:</label>
            <input type="number" id="height" name="height" defaultValue={5} />
        </div>

        <label>Buffer:</label>
        <input type="number" id="buffer" name="buffer" defaultValue={0.1} step={0.01} />

        <label>Color:</label>
        <input type="color" id="color" name="color" defaultValue="#ff0000" />

        <label>Layer:</label>
        <input type="number" id="layer" name="layer" defaultValue={0} />

        <button type='submit' disabled={isPending}>Create Rectangle</button>
    </form>
}