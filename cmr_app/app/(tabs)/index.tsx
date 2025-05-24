import { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { CameraView } from '@/components/CameraView';
import { PromptInput } from '@/components/PromptInput';
import { CaptureButton } from '@/components/CaptureButton';
import { generateImage } from '@/services/openaiService';
import { StatusBar } from 'expo-status-bar';
import { Camera as CameraIcon, FlipCameraIcon, Zap } from 'lucide-react-native';
import { Prompt } from '@/types/types';
import { LinearGradient } from 'expo-linear-gradient';

export default function CameraScreen() {
  const { colors } = useTheme();
  const [cameraType, setCameraType] = useState<'front' | 'back'>('back');
  const [showPrompt, setShowPrompt] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const promptAnimation = useRef(new Animated.Value(1)).current;

  const toggleCameraType = () => {
    setCameraType(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleCaptureImage = async (imageUri: string) => {
    setCapturedImage(imageUri);
    setIsCapturing(true);
    
    if (selectedPrompt) {
      setIsGenerating(true);
      try {
        // In a real app, this would call the OpenAI API
        const generatedImageUrl = await generateImage(selectedPrompt.text);
        setGeneratedImage(generatedImageUrl);
      } catch (error) {
        console.error('Failed to generate image:', error);
      } finally {
        setIsGenerating(false);
      }
    }
    
    setIsCapturing(false);
  };

  const togglePromptInput = () => {
    Animated.timing(promptAnimation, {
      toValue: showPrompt ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setShowPrompt(!showPrompt);
  };

  const handleSelectPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    togglePromptInput();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent']}
            style={styles.headerGradient}
          >
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              AIカメラ
            </Text>
            <TouchableOpacity 
              style={styles.promptButton}
              onPress={togglePromptInput}
            >
              <Zap size={20} color={colors.accent} />
              <Text style={[styles.promptButtonText, { color: colors.accent }]}>
                {selectedPrompt ? selectedPrompt.label : 'プロンプト選択'}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <CameraView
          cameraType={cameraType}
          onCapture={handleCaptureImage}
          generatedImage={generatedImage}
          isGenerating={isGenerating}
        />

        <Animated.View 
          style={[
            styles.promptContainer,
            { 
              transform: [{ 
                translateY: promptAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [500, 0]
                })
              }],
              opacity: promptAnimation
            }
          ]}
        >
          {showPrompt && (
            <PromptInput
              onSelectPrompt={handleSelectPrompt}
              selectedPrompt={selectedPrompt}
            />
          )}
        </Animated.View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.flipButton}
            onPress={toggleCameraType}
          >
            <FlipCameraIcon size={28} color={colors.text} />
          </TouchableOpacity>
          
          <CaptureButton 
            onPress={() => {}} 
            isCapturing={isCapturing}
          />
          
          <TouchableOpacity style={styles.emptySpace}>
            {/* Empty space for balance */}
          </TouchableOpacity>
        </View>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'NotoSansJP-Bold',
    fontSize: 22,
  },
  promptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  promptButtonText: {
    fontFamily: 'NotoSansJP-Regular',
    fontSize: 14,
    marginLeft: 6,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySpace: {
    width: 50,
  },
  promptContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 20,
  },
});