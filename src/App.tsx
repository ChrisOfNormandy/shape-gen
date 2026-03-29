import './styles/app.scss';
import { BrandButton, Glyph } from '@syren-dev-tech/confects/buttons';
import { Heading } from '@syren-dev-tech/confects/decorations';
import { IntegerInput } from '@syren-dev-tech/confects/inputs';
import { Page, PageBody, PageFooter, PageHeader, PageMain } from '@syren-dev-tech/confects/containers';
import { ThemeOptions } from '@syren-dev-tech/confetti/themes';
import { useShapes } from './ShapeProvider';
import { useState } from "react"
import Grid from './Grid';
import ModForms from './ModForms';
import ShapeForm from './forms/ShapeForm';
import Instructions from './Instructions';

export default function App() {

    const { shapes, origin, setOrigin } = useShapes();

    const [shownLayer, setShownLayer] = useState(0)

    const shapesThisLayer = shapes.filter(shape => shape.getOptions().layer === shownLayer);

    return <Page theme={new ThemeOptions({ background: { style: 'body' } })}>
        <PageHeader theme={new ThemeOptions({ background: { style: 'primary' } })}>
            <Heading>Minecraft Circle Generator and Pixel Blueprint Tool</Heading>
            <p>Build Minecraft circles, ellipses, arcs, and pixel shape blueprints with live layer controls.</p>

            <div className='header-controls'>
                <div className='origin-controls'>
                    <label htmlFor='originX'>Origin X:</label>
                    <IntegerInput value={origin.x} onChange={(e) => setOrigin(prev => ({ ...prev, x: Number(e.target.value) }))} name='originX' theme={new ThemeOptions({ background: { style: 'main' } })} />

                    <label htmlFor='originY'>Origin Y:</label>
                    <IntegerInput value={origin.y} onChange={(e) => setOrigin(prev => ({ ...prev, y: Number(e.target.value) }))} name='originY' theme={new ThemeOptions({ background: { style: 'main' } })} />
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

                <ModForms shownLayer={shownLayer} />

                <Instructions />
            </PageMain>
        </PageBody>

        <PageFooter>
            <span>Created by ChrisOfNormandy</span>

            <div className='brand-btns'>
                <a href='https://github.com/chrisofnormandy/shape-gen' target='_blank' rel='noopener noreferrer'>
                    <BrandButton brand='github' fill />
                </a>

                <a href='https://modding.syrenproject.com' target='_blank' rel='noopener noreferrer'>
                    <BrandButton brand='discord' fill />
                </a>
            </div>
        </PageFooter>
    </Page>
}