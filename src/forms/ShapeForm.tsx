import './styles/shape-form.scss';
import { Button } from '@syren-dev-tech/confects/buttons';
import { capitalize } from '@syren-dev-tech/concauses/strings';
import { ColorInput, DecimalInput, IntegerInput } from '@syren-dev-tech/confects/inputs';
import { getClassName } from '@syren-dev-tech/concauses/props';
import { parseFormDataForShape, randomColor } from './helpers';
import { Select } from "@syren-dev-tech/confects/selectors"
import { shapeOptions } from './options';
import { ThemeOptions } from '@syren-dev-tech/confetti/themes';
import { useActionState, useState, useRef } from "react"
import { useShapes } from '../ShapeProvider';
import type { ShapeType } from "../shapes/types"

export default function ShapeForm() {

    const { setShapes } = useShapes()

    const [selectedShape, setSelectedShape] = useState<ShapeType>('ellipse')
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const wrapperRef = useRef<HTMLDivElement>(null)

    const isInteractiveElement = (element: HTMLElement) => Boolean(
        element.closest('button, input, select, textarea, label, option, [contenteditable="true"], [role="button"]')
    )

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isInteractiveElement(e.target as HTMLElement))
            return

        setIsDragging(true)
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        })
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

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

    return <div // NOSONAR - Allow draggable element
        ref={wrapperRef}
        className={getClassName('shape-form-wrapper', new ThemeOptions({ background: { style: 'secondary' } }).toClassName())}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            cursor: isDragging ? 'grabbing' : 'grab',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out'
        }}
    >
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
                <Button
                    type='submit'
                    disabled={isPending}
                    theme={new ThemeOptions({ background: { style: 'trinary' }, border: { style: 'trinary' } })}
                >
                    Create Shape
                </Button>
            </div>
        </form>
    </div>
}