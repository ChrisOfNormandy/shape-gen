import { useState } from "react"
import type { ShapeType } from "../shapes/types"
import EllipseForm from "./EllipseForm"
import RectangleForm from "./RectangleForm"

export default function ShapeForm() {

    const [selectedShape, setSelectedShape] = useState<ShapeType>('ellipse')

    return <div>
        <select value={selectedShape} onChange={e => setSelectedShape(e.target.value as ShapeType)}>
            <option value='ellipse'>Ellipse</option>
            <option value='rectangle'>Rectangle</option>
            <option value='triangle'>Triangle</option>
            <option value='custom'>Custom</option>
        </select>

        {selectedShape === 'ellipse' && <EllipseForm />}
        {selectedShape === 'rectangle' && <RectangleForm />}
        {selectedShape === 'triangle' && <div>Triangle form</div>}
        {selectedShape === 'custom' && <div>Custom form</div>}
    </div>
}