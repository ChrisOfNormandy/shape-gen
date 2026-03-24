import './styles/shape-form.scss';
import { Button } from '@syren-dev-tech/confects/buttons';
import { capitalize } from '@syren-dev-tech/concauses/strings';
import { ColorInput, DecimalInput, IntegerInput } from '@syren-dev-tech/confects/inputs';
import { getClassName } from '@syren-dev-tech/concauses/props';
import { Select } from "@syren-dev-tech/confects/selectors"
import { ThemeOptions } from '@syren-dev-tech/confetti/themes';
import { useActionState, useState } from "react"
import { useShapes } from '../ShapeProvider';
import type { ShapeType } from "../shapes/types"
import { shapeOptions } from './options';
import { parseFormDataForShape, randomColor } from './helpers';

export default function ShapeForm() {

    const { setShapes } = useShapes()

    const [selectedShape, setSelectedShape] = useState<ShapeType>('ellipse')

    const [error, submitAction, isPending] = useActionState<Error | null, FormData>(
        (_previousState, formData) => {
            const result = parseFormDataForShape(formData, selectedShape)

            if (result instanceof Error)
                return result

            setShapes(prev => [...prev, result])

            return null
        }, null
    )

    const options = Array.from(shapeOptions.keys()).map(key => ({ value: key, label: capitalize(key) }));
    const shapeInputs = Array.from(shapeOptions.entries()).map(([key, Component]) => selectedShape === key ? <Component key={key} /> : null)

    const color = randomColor();

    return <div className={getClassName('shape-form-wrapper', new ThemeOptions({ background: { style: 'secondary' } }).toClassName())}>
        <Select
            value={selectedShape}
            onChange={e => setSelectedShape(e.target.value as ShapeType)}
            options={options}
            className={new ThemeOptions({ background: { style: 'main' } }).toClassName()}
        />

        {error && <div className={getClassName('error', new ThemeOptions({ background: { style: 'hazard' } }).toClassName())}>{error.message}</div>}

        <form action={submitAction} className={getClassName('shape-form', new ThemeOptions({ background: { style: 'secondary-compliment' } }).toClassName())}>
            <div className='shape-inputs'>
                {shapeInputs}
            </div>

            <div className='common-inputs'>
                <label htmlFor="buffer">Buffer:</label>
                <DecimalInput id="buffer" name="buffer" defaultValue={0.1} step={0.01} theme={new ThemeOptions({ background: { style: 'main' } })} />

                <label htmlFor="color">Color:</label>
                <ColorInput id="color" name="color" defaultValue={color} theme={new ThemeOptions({ background: { style: 'main' } })} />

                <label htmlFor="layer">Layer:</label>
                <IntegerInput id="layer" name="layer" defaultValue={0} theme={new ThemeOptions({ background: { style: 'main' } })} />
            </div>

            <div className='origin-inputs'>
                <label htmlFor="originX">Origin X:</label>
                <IntegerInput id="originX" name="originX" defaultValue={0} theme={new ThemeOptions({ background: { style: 'main' } })} />

                <label htmlFor="originY">Origin Y:</label>
                <IntegerInput id="originY" name="originY" defaultValue={0} theme={new ThemeOptions({ background: { style: 'main' } })} />
            </div>

            <div className='controls'>
                <Button type='submit' disabled={isPending} theme={new ThemeOptions({ background: { style: 'success' } })}>
                    Create Shape
                </Button>
            </div>
        </form>
    </div>
}