import './styles.scss';
import { Glyph } from '@syren-dev-tech/confects/buttons';
import { Heading } from '@syren-dev-tech/confects/decorations';
import { IntegerInput } from '@syren-dev-tech/confects/inputs';
import { Page, PageBody, PageHeader, PageMain } from '@syren-dev-tech/confects/containers';
import { ThemeOptions } from '@syren-dev-tech/confetti/themes';
import { uniqueKey } from '@syren-dev-tech/concauses/strings';
import { useShapes } from './ShapeProvider';
import { useState } from "react"
import Grid from './Grid';
import ShapeForm from './forms/ShapeForm';
import ShapeModForm from './forms/ShapeModForm';

export default function App() {

    const { shapes } = useShapes();

    const [originX, setOriginX] = useState(0)
    const [originY, setOriginY] = useState(0)
    const [shownLayer, setShownLayer] = useState(0)

    const shapesThisLayer = shapes.filter(shape => shape.getOptions().layer === shownLayer);

    return <Page theme={new ThemeOptions({ background: { style: 'body' } })}>
        <PageHeader theme={new ThemeOptions({ background: { style: 'primary' } })}>
            <Heading>Pixel Blueprint Generator</Heading>

            <div className='header-controls'>
                <div className='origin-controls'>
                    <label htmlFor='originX'>Origin X:</label>
                    <IntegerInput value={originX} onChange={(e) => setOriginX(Number(e.target.value))} name='originX' theme={new ThemeOptions({ background: { style: 'main' } })} />

                    <label htmlFor='originY'>Origin Y:</label>
                    <IntegerInput value={originY} onChange={(e) => setOriginY(Number(e.target.value))} name='originY' theme={new ThemeOptions({ background: { style: 'main' } })} />
                </div>

                <div className='layer-controls'>
                    <Glyph icon='dash-lg' onClick={() => setShownLayer(prev => prev - 1)} theme={new ThemeOptions({ background: { style: 'trinary' } })} />
                    <span>Layer: {shownLayer}</span>
                    <Glyph icon='plus-lg' onClick={() => setShownLayer(prev => prev + 1)} theme={new ThemeOptions({ background: { style: 'trinary' } })} />
                </div>
            </div>
        </PageHeader>

        <PageBody>
            <PageMain>
                <ShapeForm />

                <Grid shapes={shapesThisLayer} />

                <div className='mod-forms'>
                    {shapesThisLayer.map((shape) => <ShapeModForm key={uniqueKey()} shape={shape} />)}
                </div>
            </PageMain>
        </PageBody>
    </Page>
}