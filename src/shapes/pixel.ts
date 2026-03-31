import type { Pixel } from "./types";

export function pixel(x: number, y: number, color: string, alpha: number): Pixel {
    return { x, y, color, alpha }
}