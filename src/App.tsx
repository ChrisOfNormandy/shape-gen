import './styles.scss';
import { useShapes } from './ShapeProvider';
import { useState } from "react"
import EllipseModForm from './forms/EllipseModForm';
import ErrorBoundary from './ErrorBoundary';
import Grid from './Grid';
import ShapeForm from './forms/ShapeForm';
import type Ellipse from './shapes/Ellipse';
import RectangleModForm from './forms/RectangleModForm';
import type Rectangle from './shapes/Rectangle';

export default function App() {

    const { shapes } = useShapes();

    const [originX, setOriginX] = useState(0)
    const [originY, setOriginY] = useState(0)
    const [originZ, setOriginZ] = useState(0)
    const [shownLayer, setShownLayer] = useState(0)

    const shapesThisLayer = shapes.filter(shape => shape.getOptions().layer === shownLayer)

    return <main>
        <div>
            <div>
                <label>Origin X:</label>
                <input type="number" value={originX} onChange={e => setOriginX(Number.parseInt(e.target.value))} />
            </div>

            <div>
                <label>Origin Y:</label>
                <input type="number" value={originY} onChange={e => setOriginY(Number.parseInt(e.target.value))} />
            </div>

            <div>
                <label>Origin Z:</label>
                <input type="number" value={originZ} onChange={e => setOriginZ(Number.parseInt(e.target.value))} />
            </div>

            <div>
                <button onClick={() => setShownLayer(prev => prev - 1)}>-</button>
                <span>Layer: {shownLayer}</span>
                <button onClick={() => setShownLayer(prev => prev + 1)}>+</button>
            </div>
        </div>

        <ShapeForm />

        <div className='grid-container'>
            <Grid layer={shownLayer} />
        </div>

        <ErrorBoundary>
            <div>
                {
                    shapesThisLayer.map((shape, index) => {
                        switch (shape.getType()) {
                            case 'ellipse':
                                return <EllipseModForm key={index} ellipse={shape as Ellipse} />
                            case 'rectangle':
                                return <RectangleModForm key={index} rectangle={shape as Rectangle} />
                            case 'triangle':
                                return <div key={index}>Triangle</div>
                            case 'custom':
                                return <div key={index}>Custom</div>
                        }
                    })
                }
            </div>
        </ErrorBoundary>
    </main>
}