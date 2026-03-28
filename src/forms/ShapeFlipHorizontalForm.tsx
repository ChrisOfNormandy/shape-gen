import { Button } from "@syren-dev-tech/confects/buttons";
import { getClassName } from "@syren-dev-tech/concauses/props";
import { ThemeOptions } from "@syren-dev-tech/confetti/themes";
import { useActionState } from "react";
import { useShapes } from "../ShapeProvider";
import type { IShape } from "../shapes/Shape";

export default function ShapeFlipHorizontalForm({ shape }: Readonly<{ shape: IShape }>) {

    const { setShapes } = useShapes();

    const [error, submitAction, isPending] = useActionState<Error | null, FormData>(
        () => {
            const copy = shape.flipHorizontal();

            setShapes(prev => [...prev.filter(s => s !== shape), copy])

            return null
        }, null
    )

    return <form action={submitAction} className='shape-mod-controls-form'>
        {error && <div className={getClassName('error', new ThemeOptions({ background: { style: 'hazard' } }).toClassName())}>{error.message}</div>}

        <Button type='submit' disabled={isPending} theme={new ThemeOptions({ background: { style: 'trinary' }, border: { style: 'trinary' } })}>Flip Horizontal</Button>
    </form>
}