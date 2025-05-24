import { View, StyleSheet, Text, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sparkles } from 'lucide-react-native';

export function LoadingOverlay() {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, [fadeAnim, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View 
      style={[
        styles.container, 
        { backgroundColor: colors.overlayBackground, opacity: fadeAnim }
      ]}
    >
      <View style={styles.loadingBox}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Sparkles size={40} color={colors.accent} />
        </Animated.View>
        <Text style={[styles.loadingText, { color: colors.text }]}>
          AIが画像を生成中...
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  loadingBox: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    minWidth: 200,
  },
  loadingText: {
    fontFamily: 'NotoSansJP-Regular',
    fontSize: 16,
    marginTop: 15,
  },
});