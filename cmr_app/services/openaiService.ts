import * as FileSystem from 'expo-file-system';

// OpenAI APIキーをここに設定
const OPENAI_API_KEY = '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';

export async function generateImage(prompt: string): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        n: 1,
        size: '512x512',
        response_format: 'url',
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data[0].url;
  } catch (error) {
    console.error('Error generating image:', error);
    // エラー時はデフォルト画像を返す
    return 'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg';
  }
}

// Save generated image to device (would be used in a real implementation)
export async function saveGeneratedImage(imageUri: string, filename: string): Promise<string> {
  try {
    const directory = FileSystem.documentDirectory + 'ai-images/';
    const dirInfo = await FileSystem.getInfoAsync(directory);
    
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
    }
    
    const newUri = directory + filename + '.jpg';
    await FileSystem.copyAsync({
      from: imageUri,
      to: newUri
    });
    
    return newUri;
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
}