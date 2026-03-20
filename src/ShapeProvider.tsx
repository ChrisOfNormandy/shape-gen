import { createContext, useContext, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import type { IShape } from "./shapes/types";

interface IShapeContext {
    shapes: IShape[]
    setShapes: Dispatch<SetStateAction<IShape[]>>
}

const ShapeContext = createContext<IShapeContext>({
    shapes: [],
    setShapes: () => null
});

export function ShapeProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const [shapes, setShapes] = useState<IShape[]>([])

    const context = useMemo(() => ({ shapes, setShapes }), [shapes])

    return <ShapeContext.Provider value={context}>
        {children}
    </ShapeContext.Provider>
}

export function useShapes() {
    return useContext(ShapeContext);
}