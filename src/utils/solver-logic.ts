// Map UI color names to the character format required by the Kociemba algorithm
export const COLOR_MAP: Record<string, string> = {
  white: 'U',
  red: 'R',
  green: 'F',
  yellow: 'D',
  orange: 'L',
  blue: 'B'
};

/**
 * Validates if the scanned cube has exactly 9 stickers of each color
 */
export const validateCubeState = (state: string): boolean => {
  const counts: Record<string, number> = {};
  for (const char of state) {
    counts[char] = (counts[char] || 0) + 1;
  }
  return Object.values(counts).every(count => count === 9);
};