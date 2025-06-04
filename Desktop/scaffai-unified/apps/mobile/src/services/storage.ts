import { getSupabase } from '@scaffai/database';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';

export interface UploadResult {
  url?: string;
  error?: string;
}

class StorageService {
  private supabase = getSupabase();

  async uploadAvatar(userId: string): Promise<UploadResult> {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        return { error: '写真ライブラリへのアクセス許可が必要です' };
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled) {
        return { error: '画像の選択がキャンセルされました' };
      }

      const image = result.assets[0];
      if (!image.base64) {
        return { error: '画像の読み込みに失敗しました' };
      }

      // Generate unique filename
      const fileExtension = image.uri.split('.').pop() || 'jpg';
      const fileName = `${userId}-${Date.now()}.${fileExtension}`;
      const filePath = `avatars/${fileName}`;

      // Convert base64 to ArrayBuffer
      const arrayBuffer = decode(image.base64);

      // Upload to Supabase Storage
      const { data, error } = await this.supabase.storage
        .from('avatars')
        .upload(filePath, arrayBuffer, {
          contentType: `image/${fileExtension}`,
          upsert: true,
        });

      if (error) {
        console.error('Upload error:', error);
        return { error: 'アップロードに失敗しました' };
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return { url: urlData.publicUrl };
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      return { error: 'アップロード中にエラーが発生しました' };
    }
  }

  async deleteAvatar(filePath: string): Promise<{ error?: string }> {
    try {
      const { error } = await this.supabase.storage
        .from('avatars')
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        return { error: '削除に失敗しました' };
      }

      return {};
    } catch (error: any) {
      console.error('Avatar delete error:', error);
      return { error: '削除中にエラーが発生しました' };
    }
  }

  getAvatarUrl(filePath: string): string {
    const { data } = this.supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  }
}

export const storageService = new StorageService();