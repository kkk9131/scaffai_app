export interface Prompt {
  id: string;
  label: string;
  text: string;
}

export interface GeneratedImage {
  id: string;
  originalImageUri: string;
  generatedImageUri: string;
  prompt: Prompt;
  createdAt: Date;
}