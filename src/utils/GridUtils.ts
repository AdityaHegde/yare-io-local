import {ACTION_DISTANCE_SQUARED} from "../constants";
import {Intractable, Position} from "../globals/gameTypes";

export function getDistance(lhs: Intractable, rhs: Intractable) {
  return getDistanceBetweenPos(lhs.position, rhs.position);
}

export function getDistanceBetweenPos(sourcePos: Position, targetPos: Position) {
  const [lx, ly] = sourcePos;
  const [rx, ry] = targetPos;
  return Math.pow(lx - rx, 2) + Math.pow(ly - ry, 2);
}

export function isWithinRange(lhs: Intractable, rhs: Intractable, dist = ACTION_DISTANCE_SQUARED) {
  return getDistance(lhs, rhs) <= dist;
}

export function moveToPoint(sourcePos: Position, targetPos: Position, distance: number): Position {
  // return target if it is closed than "distance"
  const existingDistance = getDistanceBetweenPos(sourcePos, targetPos);
  if (existingDistance < distance * distance) {
    return targetPos;
  }

  const angle = Math.atan2(targetPos[1] - sourcePos[1], targetPos[0] - sourcePos[0]);
  return [
    sourcePos[0] + Math.round(Math.cos(angle) * distance),
    sourcePos[1] + Math.round(Math.sin(angle) * distance),
  ];
}

export function atPosition(entity: Intractable, pos: Position) {
  return entity.position[0] === pos[0] && entity.position[1] === pos[1];
}
