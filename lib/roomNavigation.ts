export interface Point2D {
  x: number; // percentage (0 to 100)
  y: number; // percentage (0 to 100)
}

export interface CollisionBox {
  id: string;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export type InteractableObjectId =
  | 'MUG'
  | 'JOURNAL'
  | 'LAMP'
  | 'FIGURINE'
  | 'CAT'
  | 'PLANT'
  | 'WINDOW'
  | 'CURTAINS'
  | 'DESK';

export interface InteractionAnchor {
  id: InteractableObjectId;
  targetPoint: Point2D; // where Mimi stands on the floor (percentage of room)
  facing: 'LEFT' | 'RIGHT';
  actionType:
    | 'DRINK_TEA'
    | 'INSPECT_JOURNAL'
    | 'TOGGLE_LAMP'
    | 'TAP_FIGURINE'
    | 'PET_CAT'
    | 'WATER_PLANT'
    | 'LOOK_WINDOW'
    | 'PULL_CURTAIN'
    | 'INSPECT_DESK';
  name: string;
  hint: string;
}

// 2.5D Floor coordinate boundaries where Mimi's feet walk:
// Floor strictly extends from y: 80% (in front of desk front apron) to y: 88% (front rug edge)
// This guarantees Mimi stays 100% on the floor and NEVER steps onto or clips through the desk!
export const WALKABLE_BOUNDS = {
  minX: 18,
  maxX: 82,
  minY: 80,
  maxY: 88,
};

// Obstacles on the floor that Mimi cannot walk into:
export const COLLISION_OBSTACLES: CollisionBox[] = [
  // Solid Study Desk volume: completely blocks the entire upper area above y: 80%
  {
    id: 'desk_collision',
    minX: 0,
    maxX: 100,
    minY: 0,
    maxY: 79.5,
  },
  // Cat bed / sleeping cushion solid footprint on lower-left
  {
    id: 'cat_bed_collision',
    minX: 4,
    maxX: 22,
    minY: 83.5,
    maxY: 94,
  },
];

// Defined interaction anchors for objects in the room - ALL on the walkable floor in front of the furniture
export const INTERACTION_ANCHORS: Record<InteractableObjectId, InteractionAnchor> = {
  MUG: {
    id: 'MUG',
    targetPoint: { x: 66, y: 82 }, // stands on floor in front of cute ceramic mug
    facing: 'RIGHT',
    actionType: 'DRINK_TEA',
    name: 'Cute Ceramic Mug',
    hint: 'Sip warm tea from cute mug',
  },
  JOURNAL: {
    id: 'JOURNAL',
    targetPoint: { x: 52, y: 82 }, // stands on floor in front of open journal
    facing: 'RIGHT',
    actionType: 'INSPECT_JOURNAL',
    name: 'Rain Journal',
    hint: 'Open and read memories',
  },
  LAMP: {
    id: 'LAMP',
    targetPoint: { x: 38, y: 81.5 }, // stands on floor in front of cute desk lamp
    facing: 'LEFT',
    actionType: 'TOGGLE_LAMP',
    name: 'Cute Desk Lamp',
    hint: 'Toggle warm desk lamp',
  },
  FIGURINE: {
    id: 'FIGURINE',
    targetPoint: { x: 74, y: 83 }, // stands on floor in front of desk drawer & letter
    facing: 'RIGHT',
    actionType: 'TAP_FIGURINE',
    name: 'Desk Keepsake',
    hint: 'Inspect vintage letter & drawer',
  },
  CAT: {
    id: 'CAT',
    targetPoint: { x: 32, y: 85 }, // stands on floor beside cat cushion
    facing: 'LEFT',
    actionType: 'PET_CAT',
    name: 'Mochi',
    hint: 'Gently pet sleeping cat',
  },
  PLANT: {
    id: 'PLANT',
    targetPoint: { x: 21.5, y: 80.5 }, // stands intimately close beside plum blossom vase to shower blossoms directly
    facing: 'LEFT',
    actionType: 'WATER_PLANT',
    name: 'Plum Blossom Vase',
    hint: 'Shower the pink blossoms',
  },
  WINDOW: {
    id: 'WINDOW',
    targetPoint: { x: 50, y: 81 }, // stands on floor looking up toward rainy window
    facing: 'RIGHT',
    actionType: 'LOOK_WINDOW',
    name: 'Rainy Window',
    hint: 'Look outside at the weather',
  },
  CURTAINS: {
    id: 'CURTAINS',
    targetPoint: { x: 32, y: 81 }, // stands on floor looking toward curtains
    facing: 'LEFT',
    actionType: 'PULL_CURTAIN',
    name: 'Curtain Cord',
    hint: 'Pull string to open/close curtains',
  },
  DESK: {
    id: 'DESK',
    targetPoint: { x: 52, y: 82 }, // stands on floor in front of center desk
    facing: 'RIGHT',
    actionType: 'INSPECT_DESK',
    name: 'Study Desk',
    hint: 'Inspect desk closeup',
  },
};

// Check if a point collides with an obstacle
export function isPointInCollision(point: Point2D): boolean {
  for (const box of COLLISION_OBSTACLES) {
    if (
      point.x >= box.minX &&
      point.x <= box.maxX &&
      point.y >= box.minY &&
      point.y <= box.maxY
    ) {
      return true;
    }
  }
  return false;
}

// Clamp point strictly to the walkable floor boundaries
export function clampToWalkable(point: Point2D): Point2D {
  return {
    x: Math.max(WALKABLE_BOUNDS.minX, Math.min(WALKABLE_BOUNDS.maxX, point.x)),
    y: Math.max(WALKABLE_BOUNDS.minY, Math.min(WALKABLE_BOUNDS.maxY, point.y)),
  };
}

// Find safe walkable point if clicked point is outside bounds or inside an obstacle
export function findNearestWalkablePoint(target: Point2D): Point2D {
  // If tapped above the floor (e.g. on the desk or window), project straight down to front floor
  const clamped = clampToWalkable(target);

  // If inside cat cushion collision box (lower-left: x 4-30, y 82-94)
  if (clamped.x <= 32 && clamped.y >= 82) {
    // Safe standing spot is beside cat
    return { x: 35, y: Math.max(81, clamped.y) };
  }

  return clamped;
}

// Generate smooth collision-avoiding waypoint route across the floor
export function calculateWalkPath(start: Point2D, end: Point2D): Point2D[] {
  const safeEnd = findNearestWalkablePoint(end);

  const dx = safeEnd.x - start.x;
  const dy = safeEnd.y - start.y;
  if (Math.hypot(dx, dy) < 1.2) {
    return [];
  }

  // If path passes through the cat bed corner (e.g. from x < 32 to x > 35 while y >= 82):
  // Route through the upper floor walkway (y: 81) to avoid stepping on Mochi
  const startNearCat = start.x <= 32 && start.y >= 82;
  const endPastCat = safeEnd.x > 32;

  if (startNearCat && endPastCat) {
    return [
      { x: Math.max(34, start.x), y: 81 },
      safeEnd,
    ];
  }

  const startPastCat = start.x > 32;
  const endNearCat = safeEnd.x <= 32 && safeEnd.y >= 82;

  if (startPastCat && endNearCat) {
    return [
      { x: 35, y: 81 },
      safeEnd,
    ];
  }

  return [safeEnd];
}
