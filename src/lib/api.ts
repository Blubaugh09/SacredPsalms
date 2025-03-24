// ESV API implementation
import { Scripture } from '../types';

// ESV API configuration
const ESV_API_KEY = 'c3be9ae20e39bd6637c709cd2e94fd42135764d1';
const ESV_API_URL = 'https://api.esv.org/v3/passage/text/';

// API.Bible configuration for KJV
const API_BIBLE_KEY = 'e3b141d22842507c3f59d785f800e982';
const API_BIBLE_URL = 'https://api.scripture.api.bible/v1';
const KJV_BIBLE_ID = 'de4e12af7f28f599-02'; // KJV Bible ID in API.Bible

// Interface for translation options
export type TranslationType = 'ESV' | 'KJV';

// Fetches a specific Psalm from the ESV API
async function fetchESVPsalm(psalmNumber: number): Promise<Scripture> {
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
    console.error('Error fetching ESV Psalm:', error);
    throw error;
  }
}

// Fetches a specific Psalm from the KJV via API.Bible
async function fetchKJVPsalm(psalmNumber: number): Promise<Scripture> {
  try {
    // Validate psalm number (Psalms 1-150)
    if (psalmNumber < 1 || psalmNumber > 150) {
      throw new Error('Invalid Psalm number. Must be between 1 and 150.');
    }
    
    // API.Bible uses "PSA" as the book ID for Psalms
    const psalmId = `PSA.${psalmNumber}`;
    
    // First get the chapter info
    const chapterUrl = `${API_BIBLE_URL}/bibles/${KJV_BIBLE_ID}/chapters/${psalmId}`;
    console.log('Fetching chapter info from:', chapterUrl);
    
    const chapterResponse = await fetch(chapterUrl, {
      headers: {
        'api-key': API_BIBLE_KEY
      }
    });

    if (!chapterResponse.ok) {
      const errorText = await chapterResponse.text();
      throw new Error(`Failed to fetch chapter info from API.Bible: ${chapterResponse.status} - ${errorText}`);
    }

    const chapterData = await chapterResponse.json();
    
    // Now get the content - using a simpler approach
    const contentUrl = `${API_BIBLE_URL}/bibles/${KJV_BIBLE_ID}/chapters/${psalmId}?content-type=text&include-notes=false&include-titles=false`;
    console.log('Fetching content from:', contentUrl);
    
    const contentResponse = await fetch(contentUrl, {
      headers: {
        'api-key': API_BIBLE_KEY
      }
    });

    if (!contentResponse.ok) {
      const errorText = await contentResponse.text();
      throw new Error(`Failed to fetch content from API.Bible: ${contentResponse.status} - ${errorText}`);
    }

    const contentData = await contentResponse.json();
    
    // Log to debug
    console.log('KJV content received:', contentData);
    
    return {
      reference: `Psalm ${psalmNumber}`,
      text: contentData.data.content.trim(),
      translation: 'KJV'
    };
  } catch (error) {
    console.error('Error fetching KJV Psalm:', error);
    throw error;
  }
}

// Main function to fetch a Psalm in the selected translation
export async function fetchPsalm(psalmNumber: number, translation: TranslationType = 'ESV'): Promise<Scripture> {
  try {
    if (translation === 'KJV') {
      return await fetchKJVPsalm(psalmNumber);
    } else {
      return await fetchESVPsalm(psalmNumber);
    }
  } catch (error) {
    console.error('Error fetching Psalm:', error);
    // Return a fallback in case of error, but use the requested psalm number
    if (psalmNumber === 23) {
      // If Psalm 23 was actually requested, use our hardcoded fallback
      return {
        reference: 'Psalm 23:1-6',
        text: 'The LORD is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul. He leads me in paths of righteousness for his name\'s sake. Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me; your rod and your staff, they comfort me. You prepare a table before me in the presence of my enemies; you anoint my head with oil; my cup overflows. Surely goodness and mercy shall follow me all the days of my life, and I shall dwell in the house of the LORD forever.',
        translation: translation
      };
    } else {
      // For any other psalm, try the request again with Psalm 23
      try {
        // Attempt to fetch Psalm 23 as a reliable fallback
        const fallbackPsalm = translation === 'KJV' 
          ? await fetchKJVPsalm(23) 
          : await fetchESVPsalm(23);
        
        // Return with modified reference to show the original request
        return {
          ...fallbackPsalm,
          reference: `Psalm ${psalmNumber} (unavailable - showing Psalm 23)`,
        };
      } catch {
        // If even fetching Psalm 23 fails, use hardcoded fallback
        return {
          reference: `Psalm ${psalmNumber} (unavailable - showing fallback)`,
          text: 'The LORD is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul. He leads me in paths of righteousness for his name\'s sake. Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me; your rod and your staff, they comfort me. You prepare a table before me in the presence of my enemies; you anoint my head with oil; my cup overflows. Surely goodness and mercy shall follow me all the days of my life, and I shall dwell in the house of the LORD forever.',
          translation: translation
        };
      }
    }
  }
}

// Get a random Psalm
export async function getRandomPsalm(translation: TranslationType = 'ESV'): Promise<Scripture> {
  const randomPsalmNumber = Math.floor(Math.random() * 150) + 1;
  return fetchPsalm(randomPsalmNumber, translation);
} 