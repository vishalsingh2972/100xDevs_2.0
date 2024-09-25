//Constant exports and imports
export function add(x: number, y: number): number {
  return x + y;
}

export function subtract(x: number, y: number): number {
  return x - y;
}

//Default exports and imports
export default class math {
  add(x: number, y: number): number {
      return x + y;
  }
}