import './styles/shape-form.scss';
import { getClassName } from '@syren-dev-tech/concauses/props';
import { Select } from "@syren-dev-tech/confects/selectors"
import { useState } from "react"
import EllipseForm from "./EllipseForm"
import RectangleForm from "./RectangleForm"
import type { ShapeType } from "../shapes/types"
import { ThemeOptions } from '@syren-dev-tech/confetti/themes';

export default function ShapeForm() {

    const [selectedShape, setSelectedShape] = useState<ShapeType>('ellipse')

    return <div className={getClassName('shape-form-wrapper', new ThemeOptions({ background: { style: 'secondary' } }).toClassName())}>
        <Select
            value={selectedShape}
            onChange={e => setSelectedShape(e.target.value as ShapeType)}
            options={[
                { value: 'ellipse', label: 'Ellipse' },
                { value: 'rectangle', label: 'Rectangle' },
                { value: 'triangle', label: 'Triangle' }
            ]}
            className={new ThemeOptions({ background: { style: 'main' } }).toClassName()}
        />

        {selectedShape === 'ellipse' && <EllipseForm />}
        {selectedShape === 'rectangle' && <RectangleForm />}
        {selectedShape === 'triangle' && <div>Triangle form</div>}
    </div>
}