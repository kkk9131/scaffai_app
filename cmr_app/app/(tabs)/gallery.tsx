import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Share2, Trash2 } from 'lucide-react-native';

// This would be populated from the actual saved images
const mockGalleryItems = [
  { id: '1', imageUrl: 'https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg', promptText: '夢の中の風景' },
  { id: '2', imageUrl: 'https://images.pexels.com/photos/2510067/pexels-photo-2510067.jpeg', promptText: 'サイバーパンクの街並み' },
  { id: '3', imageUrl: 'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg', promptText: '未来的な宇宙船' },
];

export default function GalleryScreen() {
  const { colors } = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const handleImagePress = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };
  
  const closePreview = () => {
    setSelectedImage(null);
  };
  
  const shareImage = () => {
    // In a real app, this would share the image
    console.log('Sharing image:', selectedImage);
  };
  
  const deleteImage = () => {
    // In a real app, this would delete the image
    console.log('Deleting image:', selectedImage);
    setSelectedImage(null);
  };

  const renderGalleryItem = ({ item }: { item: typeof mockGalleryItems[0] }) => (
    <TouchableOpacity 
      style={styles.galleryItem} 
      onPress={() => handleImagePress(item.imageUrl)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.galleryImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.promptOverlay}
      >
        <Text style={styles.promptText}>{item.promptText}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>ギャラリー</Text>
        </View>
        
        {selectedImage ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            <View style={styles.previewActions}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.accent }]} 
                onPress={shareImage}
              >
                <Share2 size={22} color="#fff" />
                <Text style={styles.actionText}>シェア</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.error }]} 
                onPress={deleteImage}
              >
                <Trash2 size={22} color="#fff" />
                <Text style={styles.actionText}>削除</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={closePreview}
            >
              <Text style={styles.closeText}>閉じる</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={mockGalleryItems}
            renderItem={renderGalleryItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.galleryList}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    fontFamily: 'NotoSansJP-Bold',
    fontSize: 22,
  },
  galleryList: {
    padding: 10,
  },
  galleryItem: {
    flex: 1,
    margin: 5,
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  promptOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  promptText: {
    color: '#fff',
    fontFamily: 'NotoSansJP-Regular',
    fontSize: 14,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  previewImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'contain',
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  actionText: {
    color: '#fff',
    fontFamily: 'NotoSansJP-Regular',
    fontSize: 14,
    marginLeft: 5,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeText: {
    color: '#fff',
    fontFamily: 'NotoSansJP-Regular',
    fontSize: 16,
  },
});