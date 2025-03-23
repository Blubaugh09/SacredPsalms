/**
 * Splits a text string into an array of words
 * Preserves punctuation attached to words but allows for highlighting individual words
 * 
 * @param text - The text to tokenize
 * @returns An array of words
 */
export const wordTokenizer = (text: string): string[] => {
  // Match words with optional punctuation, whitespace, or just punctuation
  const regex = /[\w']+[.,;:!?]?|\s+|[.,;:!?]/g;
  const matches = text.match(regex) || [];
  
  // Filter out pure whitespace entries for our clickable words
  return matches.filter(word => word.trim() !== '');
}; 