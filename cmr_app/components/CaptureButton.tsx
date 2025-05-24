import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRef, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface CaptureButtonProps {
  onPress: () => void;
  isCapturing: boolean;
}

export function CaptureButton({ onPress, isCapturing }: CaptureButtonProps) {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isCapturing) {
      // Scale down when capturing
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      // Start pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Reset animations
      Animated.timing(scale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      pulseAnimation.setValue(1);
    }
  }, [isCapturing, scale, pulseAnimation]);

  return (
    <View style={styles.container}>
      {isCapturing && (
        <Animated.View
          style={[
            styles.pulseCircle,
            {
              backgroundColor: colors.accent,
              transform: [{ scale: pulseAnimation }],
            },
          ]}
        />
      )}
      
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <Animated.View
          style={[
            styles.button,
            {
              borderColor: isCapturing ? colors.accent : '#fff',
              transform: [{ scale }],
            },
          ]}
        >
          <View
            style={[
              styles.innerCircle,
              { backgroundColor: isCapturing ? colors.accent : '#fff' },
            ]}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  pulseCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.3,
  },
});