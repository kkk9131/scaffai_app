import { View, StyleSheet, Image, Platform } from 'react-native';
import { CameraView as ExpoCamera, CameraCapturedPicture, CameraType } from 'expo-camera';
import { useRef, useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { LoadingOverlay } from './LoadingOverlay';
import { Platform } from 'react-native';

interface CameraViewProps {
  cameraType: 'front' | 'back';
  onCapture: (imageUri: string) => void;
  generatedImage: string | null;
  isGenerating: boolean;
}

export function CameraView({ cameraType, onCapture, generatedImage, isGenerating }: CameraViewProps) {
  const { colors } = useTheme();
  const cameraRef = useRef<ExpoCamera>(null);
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permission, requestPermission] = Platform.OS === 'web' 
    ? [{ granted: true }, () => {}] 
    : ExpoCamera.useCameraPermissions();

  useEffect(() => {
    if (Platform.OS !== 'web') {
      requestPermission();
    }
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setPhoto(photo);
        onCapture(photo.uri);
      } catch (error) {
        console.error('Failed to take picture:', error);
      }
    }
  };

  if (!permission?.granted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.cameraPlaceholder}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/3844788/pexels-photo-3844788.jpeg' }}
            style={styles.placeholderImage}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ExpoCamera
        ref={cameraRef}
        style={styles.camera}
        type={cameraType}
        onBarcodeScanned={undefined}
      />
      
      {photo && generatedImage && !error && (
        <Image
          source={{ uri: generatedImage }}
          style={styles.overlayImage}
          resizeMode="cover"
          onError={() => setError('画像の生成に失敗しました')}
        />
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {isGenerating && <LoadingOverlay />}
      
      <View style={styles.captureButtonContainer}>
        <View
          style={styles.captureButton}
          onTouchEnd={takePicture}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  captureButtonContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    borderWidth: 5,
    borderColor: 'rgba(0,0,0,0.3)',
  },
  overlayImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.7,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  errorContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: '#ff4d4f',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'NotoSansJP-Regular',
  },
});