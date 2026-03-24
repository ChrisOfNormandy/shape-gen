import { createContext, useContext, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import type { IShape } from "./shapes/Shape";
import { loadShapesFromDatabase, saveShapesToDatabase } from "./database";

interface IShapeContext {
    shapes: IShape[]
    setShapes: Dispatch<SetStateAction<IShape[]>>
}

const ShapeContext = createContext<IShapeContext>({
    shapes: [],
    setShapes: () => null
});

export function ShapeProvider({ children }: Readonly<{ children: React.ReactNode }>) {

    const [loaded, setLoaded] = useState(false);
    const [shapes, setShapes] = useState<IShape[]>([])

    useEffect(() => {
        (async () => {
            const loadedShapes = await loadShapesFromDatabase();
            setShapes(loadedShapes);
        })();
    }, [])

    useEffect(() => {
        if (loaded)
            saveShapesToDatabase(shapes).catch(console.error);
        else
            setLoaded(true);
    }, [shapes])

    const context = useMemo(() => ({ shapes, setShapes }), [shapes])

    return <ShapeContext.Provider value={context}>
        {children}
    </ShapeContext.Provider>
}

export function useShapes() {
    return useContext(ShapeContext);
}