import './styles/shape-mod-form.scss';
import { Button } from '@syren-dev-tech/confects/buttons';
import { ColorInput, DecimalInput, IntegerInput } from '@syren-dev-tech/confects/inputs';
import { getClassName } from '@syren-dev-tech/concauses/props';
import { parseFormDataForShape } from './helpers';
import { shapeOptions } from './options';
import { ThemeOptions } from '@syren-dev-tech/confetti/themes';
import { useActionState } from "react"
import { useShapes } from '../ShapeProvider';
import type { IShape } from '../shapes/Shape';
import ShapeDeletionForm from './ShapeDeletionForm';
import ShapeCopyForm from './ShapeCopyForm';

interface ShapeModFormProps {
    shape: IShape
}

export default function ShapeModForm({ shape }: Readonly<ShapeModFormProps>) {

    const { setShapes } = useShapes()

    const shapeType = shape.getType();

    const [error, submitAction, isPending] = useActionState<Error | null, FormData>(
        (_previousState, formData) => {
            const replacement = parseFormDataForShape(formData, shapeType)

            if (replacement instanceof Error)
                return replacement

            setShapes(prev => [...prev.filter(s => s !== shape), replacement])

            return null
        }, null
    )

    const shapeInputs = Array.from(shapeOptions.entries()).map(([key, Component]) => shapeType === key ? <Component key={key} shape={shape} /> : null)

    return <div className={getClassName('shape-mod-form-wrapper', new ThemeOptions({ background: { style: 'secondary' } }).toClassName())}>
        {error && <div className={getClassName('error', new ThemeOptions({ background: { style: 'hazard' } }).toClassName())}>{error.message}</div>}

        <form action={submitAction} className={getClassName('shape-form', new ThemeOptions({ background: { style: 'secondary-compliment' } }).toClassName())}>
            {shapeInputs}

            <div className='common-inputs'>
                <label htmlFor="buffer">Buffer:</label>
                <DecimalInput id="buffer" name="buffer" defaultValue={shape.getOptions().buffer} step={0.01} theme={new ThemeOptions({ background: { style: 'main' } })} />

                <label htmlFor="color">Color:</label>
                <ColorInput id="color" name="color" defaultValue={shape.getOptions().color} theme={new ThemeOptions({ background: { style: 'main' } })} />

                <label htmlFor="layer">Layer:</label>
                <IntegerInput id="layer" name="layer" defaultValue={shape.getOptions().layer} theme={new ThemeOptions({ background: { style: 'main' } })} />
            </div>

            <div className='origin-inputs'>
                <label htmlFor="originX">Origin X:</label>
                <IntegerInput id="originX" name="originX" defaultValue={shape.getOptions().originX} theme={new ThemeOptions({ background: { style: 'main' } })} />

                <label htmlFor="originY">Origin Y:</label>
                <IntegerInput id="originY" name="originY" defaultValue={shape.getOptions().originY} theme={new ThemeOptions({ background: { style: 'main' } })} />
            </div>

            <div className='controls'>
                <Button
                    type='submit'
                    disabled={isPending}
                    theme={new ThemeOptions({ background: { style: 'trinary' }, border: { style: 'trinary' } })}
                >
                    Update
                </Button>
            </div>
        </form>

        <div className='mod-actions'>
            <ShapeDeletionForm shape={shape} />

            <ShapeCopyForm shape={shape} />
        </div>
    </div>
}