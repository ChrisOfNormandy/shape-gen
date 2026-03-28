import './styles/mod-forms.scss';
import { getClassName } from '@syren-dev-tech/concauses/props';
import { Glyph } from "@syren-dev-tech/confects/buttons";
import { ThemeOptions } from '@syren-dev-tech/confetti/themes';
import { uniqueKey } from "@syren-dev-tech/concauses/strings";
import { useShapes } from "./ShapeProvider";
import { useState } from 'react';
import ShapeModForm from "./forms/ShapeModForm";

export default function ModForms({ shownLayer }: Readonly<{ shownLayer: number }>) {
    const { shapes } = useShapes();

    const [open, setOpen] = useState(true);

    const shapesThisLayer = shapes.filter(shape => shape.getOptions().layer === shownLayer);

    return <div className='mod-forms-wrapper'>
        <div className={getClassName('mod-forms', open && 'open')}>
            {shapesThisLayer.map((shape) => <ShapeModForm key={uniqueKey()} shape={shape} />)}
        </div>

        <div className='footer'>
            <Glyph
                className='mod-forms-toggle-btn' icon={open ? 'caret-right' : 'caret-left'}
                onClick={() => {
                    setOpen(!open);
                }}
                theme={new ThemeOptions({ background: { style: 'primary' } })}
            />
        </div>
    </div>
}