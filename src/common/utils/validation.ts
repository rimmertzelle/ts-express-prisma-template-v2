/**
 * Validates if a string is a valid MongoDB ObjectId.
 * MongoDB ObjectIds are 24-character hexadecimal strings.
 * @param id The string to validate
 * @returns true if the string is a valid ObjectId format, false otherwise
 */
export function isValidObjectId(id: string): boolean {
  // MongoDB ObjectId must be exactly 24 hexadecimal characters
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
}
