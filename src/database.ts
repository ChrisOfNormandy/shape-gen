import Arc from "./shapes/Arc";
import Ellipse from "./shapes/Ellipse";
import Line from "./shapes/Line";
import Rectangle from "./shapes/Rectangle";
import type { IShape } from "./shapes/Shape";
import { openDB } from "idb";

const DB_VERSION = 2;

interface ShapeSchema extends IShape {
    db_id: number; // Unique identifier for the shape in the database
}

export async function initializeDatabase(): Promise<void> {
    const db = await openDB("ShapeDatabase", DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains("shapes")) {
                db.createObjectStore("shapes", { keyPath: "db_id", autoIncrement: true });
            }
            if (!db.objectStoreNames.contains("origin")) {
                db.createObjectStore("origin", { keyPath: "id" });
            }
        },
    });
    db.close();
}

export async function saveShapesToDatabase(shapes: IShape[]): Promise<void> {
    const db = await openDB("ShapeDatabase", DB_VERSION);

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
    const db = await openDB("ShapeDatabase", DB_VERSION);

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

export async function saveOriginToDatabase(origin: { x: number, y: number }): Promise<void> {
    const db = await openDB("ShapeDatabase", DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains("origin")) {
                db.createObjectStore("origin", { keyPath: "id" });
            }
        },
    });

    const tx = db.transaction("origin", "readwrite");
    const store = tx.objectStore("origin");

    // Save the origin with a fixed id of 1
    await store.put({ id: 1, ...origin });

    await tx.done;
}

export async function loadOriginFromDatabase(): Promise<{ x: number, y: number }> {
    const db = await openDB("ShapeDatabase", DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains("origin")) {
                db.createObjectStore("origin", { keyPath: "id" });
            }
        },
    });

    const tx = db.transaction("origin", "readonly");
    const store = tx.objectStore("origin");
    const originData = await store.get(1);

    return originData ? { x: originData.x, y: originData.y } : { x: 0, y: 0 };
}   