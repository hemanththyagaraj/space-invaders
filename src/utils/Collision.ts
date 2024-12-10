export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Checks if two rectangles are overlapping over each other
 * @param {Rect} rect1 - The first rectangle to check for collision
 * @param {Rect} rect2 - The second rectangle to check for collision
 * @returns {boolean} - Returns `true` if one of the rectangle collides/overlaps over the other else returns `false`
 */
export const isColliding = (rect1: Rect, rect2: Rect): boolean => {
  return (
    rect1.x + rect1.width > rect2.x &&
    rect1.y + rect1.height > rect2.y &&
    rect1.x < rect2.x + rect2.width &&
    rect1.y < rect2.y + rect2.height
  );
};
