// ESV API implementation
import { Scripture } from '../types';

const ESV_API_KEY = 'c3be9ae20e39bd6637c709cd2e94fd42135764d1';
const ESV_API_URL = 'https://api.esv.org/v3/passage/text/';

// Fetches a specific Psalm from the ESV API
export async function fetchPsalm(psalmNumber: number): Promise<Scripture> {
  try {
    // Validate psalm number (Psalms 1-150)
    if (psalmNumber < 1 || psalmNumber > 150) {
      throw new Error('Invalid Psalm number. Must be between 1 and 150.');
    }

    const reference = `Psalm ${psalmNumber}`;
    
    const params = new URLSearchParams({
      'q': reference,
      'include-headings': 'false',
      'include-footnotes': 'false',
      'include-verse-numbers': 'false',
      'include-short-copyright': 'false',
      'include-passage-references': 'false'
    });

    const response = await fetch(`${ESV_API_URL}?${params.toString()}`, {
      headers: {
        'Authorization': `Token ${ESV_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from ESV API: ${response.status}`);
    }

    const data = await response.json();
    
    // Format the scripture object
    return {
      reference: `${reference}:1-${data.passage_meta[0].verse_count}`,
      text: data.passages[0].trim(),
      translation: 'ESV'
    };
  } catch (error) {
    console.error('Error fetching Psalm:', error);
    // Return a fallback in case of error
    return {
      reference: 'Psalm 23:1-6',
      text: 'The LORD is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul. He leads me in paths of righteousness for his name\'s sake. Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me; your rod and your staff, they comfort me. You prepare a table before me in the presence of my enemies; you anoint my head with oil; my cup overflows. Surely goodness and mercy shall follow me all the days of my life, and I shall dwell in the house of the LORD forever.',
      translation: 'ESV'
    };
  }
}

// Get a random Psalm
export async function getRandomPsalm(): Promise<Scripture> {
  const randomPsalmNumber = Math.floor(Math.random() * 150) + 1;
  return fetchPsalm(randomPsalmNumber);
} 