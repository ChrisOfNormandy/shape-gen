import { Button } from "@syren-dev-tech/confects/buttons";
import type { IShape } from "../shapes/Shape";
import { ThemeOptions } from "@syren-dev-tech/confetti/themes";
import { useShapes } from "../ShapeProvider";
import { useActionState } from "react";
import { getClassName } from "@syren-dev-tech/concauses/props";

export default function ShapeDeletionForm({ shape }: Readonly<{ shape: IShape }>) {

    const { setShapes } = useShapes()

    const [error, submitAction, isPending] = useActionState<Error | null, FormData>(
        () => {
            setShapes(prev => prev.filter(s => s !== shape))

            return null
        }, null
    )

    return <form action={submitAction} className='shape-mod-controls-form'>
        {error && <div className={getClassName('error', new ThemeOptions({ background: { style: 'hazard' } }).toClassName())}>{error.message}</div>}

        <Button disabled={isPending} type='submit' theme={new ThemeOptions({ background: { style: 'trinary' }, border: { style: 'trinary' } })}>Delete</Button>
    </form>
}