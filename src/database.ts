import Arc from "./shapes/Arc";
import Ellipse from "./shapes/Ellipse";
import Line from "./shapes/Line";
import Rectangle from "./shapes/Rectangle";
import type { IShape } from "./shapes/Shape";
import { openDB } from "idb";

const DB_VERSION = 1;

interface ShapeSchema extends IShape {
    db_id: number; // Unique identifier for the shape in the database
}

export async function saveShapesToDatabase(shapes: IShape[]): Promise<void> {
    const db = await openDB("ShapeDatabase", DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains("shapes")) {
                db.createObjectStore("shapes", { keyPath: "db_id", autoIncrement: true });
            }
        },
    });

    const tx = db.transaction("shapes", "readwrite");
    const store = tx.objectStore("shapes");

    // Clear existing shapes before saving new ones
    await store.clear();

    for (const shape of shapes) {
        await store.add(shape);
    }

    await tx.done;
}

export async function loadShapesFromDatabase(): Promise<IShape[]> {
    const db = await openDB("ShapeDatabase", DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains("shapes")) {
                db.createObjectStore("shapes", { keyPath: "db_id", autoIncrement: true });
            }
        },
    });

    const tx = db.transaction("shapes", "readonly");
    const store = tx.objectStore("shapes");
    const allShapes: ShapeSchema[] = await store.getAll();

    // Remove the db_id before returning the shapes
    return allShapes.map(({ db_id, ...shape }) => {
        switch (shape.type) {
            case 'ellipse': {
                const data = shape as unknown as Ellipse;
                return new Ellipse(data.radiusX, data.radiusY, data.options);
            }
            case 'rectangle': {
                const data = shape as unknown as Rectangle;
                return new Rectangle(data.width, data.height, data.options);
            }
            case 'line': {
                const data = shape as unknown as Line;
                return new Line(data.endpointX, data.endpointY, data.options);
            }
            case 'arc': {
                const data = shape as unknown as Arc;
                return new Arc(data.endpointX, data.endpointY, data.controlPointX, data.controlPointY, data.options);
            }
        }
    });
}
