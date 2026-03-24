import type { ComponentType } from "react";
import type { ShapeType } from "../shapes/types";
import type { IShape } from "../shapes/Shape";
import EllipseForm from "./shapes/EllipseForm";
import RectangleForm from "./shapes/RectangleForm";
import LineForm from "./shapes/LineForm";
import ArcForm from "./shapes/ArcForm";

export const shapeOptions = new Map<ShapeType, ComponentType<{ shape?: IShape }>>(
    [
        ['ellipse', EllipseForm],
        ['rectangle', RectangleForm],
        ['line', LineForm],
        ['arc', ArcForm]
    ]
)