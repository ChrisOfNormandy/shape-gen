import { createContext, useContext, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { initializeDatabase, loadOriginFromDatabase, loadShapesFromDatabase, saveOriginToDatabase, saveShapesToDatabase } from "./database";
import type { IShape } from "./shapes/Shape";

interface IShapeContext {
    shapes: IShape[]
    setShapes: Dispatch<SetStateAction<IShape[]>>,
    origin: { x: number, y: number }
    setOrigin: Dispatch<SetStateAction<{ x: number, y: number }>>
}

const ShapeContext = createContext<IShapeContext>({
    origin: { x: 0, y: 0 },
    setOrigin: () => null,
    setShapes: () => null,
    shapes: [],
});

export function ShapeProvider({ children }: Readonly<{ children: React.ReactNode }>) {

    const [loaded, setLoaded] = useState(false);
    const [shapes, setShapes] = useState<IShape[]>([]);
    const [origin, setOrigin] = useState({ x: 0, y: 0 });

    useEffect(() => {
        (async () => {
            await initializeDatabase();
            const loadedShapes = await loadShapesFromDatabase();
            const loadedOrigin = await loadOriginFromDatabase();
            setShapes(loadedShapes);
            setOrigin(loadedOrigin);
        })();
    }, [])

    useEffect(() => {
        if (loaded)
            saveShapesToDatabase(shapes).catch(console.error);
        else
            setLoaded(true);
    }, [shapes])

    useEffect(() => {
        if (loaded)
            saveOriginToDatabase(origin).catch(console.error);
    }, [origin])

    const context = useMemo(() => ({ shapes, setShapes, origin, setOrigin }), [shapes, origin])

    return <ShapeContext.Provider value={context}>
        {children}
    </ShapeContext.Provider>
}

export function useShapes() {
    return useContext(ShapeContext);
}