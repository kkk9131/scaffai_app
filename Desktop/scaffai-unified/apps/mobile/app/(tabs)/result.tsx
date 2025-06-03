import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ResultCard } from '@/components/ResultCard';
import { colors } from '@/constants/colors';
import { ja } from '@/constants/translations';
import { useScaffold } from '@/context/ScaffoldContext';
import { useRouter } from 'expo-router';
import { Save, RefreshCw, CircleAlert as AlertCircle } from 'lucide-react-native';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated'

export default function ResultScreen() {
  const { isLoading, error, calculationResult } = useScaffold();
  const router = useRouter();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <Text style={styles.loadingText}>{ja.common.loading}</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <AlertCircle size={60} color={colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => router.back()}
        >
          <Text style={styles.errorButtonText}>{ja.common.retry}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!calculationResult) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{ja.result.noResults}</Text>
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => router.push('/(tabs)/input')}
        >
          <Text style={styles.emptyButtonText}>{ja.input.title}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="light" />
      <Animated.View 
        entering={FadeIn.duration(600)}
        style={styles.header}
      >
        <Text style={styles.title}>{ja.result.title}</Text>
      </Animated.View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View 
          entering={SlideInUp.duration(600).delay(200)}
          style={styles.resultContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{ja.result.spanComposition}</Text>
            <View style={styles.spanDetails}>
              <ResultCard
                title={`${ja.input.northSouth}面 全スパン`}
                value={calculationResult.ns_total_span}
                suffix={ja.common.mm}
                delay={100}
              />
              <ResultCard
                title={`${ja.input.northSouth}面 スパン構成`}
                value={calculationResult.ns_span_structure}
                delay={200}
              />
              <ResultCard
                title={`${ja.input.eastWest}面 全スパン`}
                value={calculationResult.ew_total_span}
                suffix={ja.common.mm}
                delay={300}
              />
              <ResultCard
                title={`${ja.input.eastWest}面 スパン構成`}
                value={calculationResult.ew_span_structure}
                delay={400}
              />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{ja.result.endGaps}</Text>
            <View style={styles.endGapsContainer}>
              <ResultCard
                title={ja.input.north}
                value={calculationResult.north_gap}
                suffix={ja.common.mm}
                delay={500}
              />
              <ResultCard
                title={ja.input.east}
                value={calculationResult.east_gap}
                suffix={ja.common.mm}
                delay={600}
              />
              <ResultCard
                title={ja.input.south}
                value={calculationResult.south_gap}
                suffix={ja.common.mm}
                delay={700}
              />
              <ResultCard
                title={ja.input.west}
                value={calculationResult.west_gap}
                suffix={ja.common.mm}
                delay={800}
              />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>高さ情報</Text>
            <View style={styles.heightDetails}>
              <ResultCard
                title={ja.result.numberOfLevels}
                value={calculationResult.num_stages}
                suffix={ja.common.units}
                delay={900}
              />
              <ResultCard
                title={ja.result.numberOfUnits}
                value={calculationResult.modules_count}
                suffix={ja.common.pieces}
                delay={1000}
              />
              <ResultCard
                title={ja.result.jackupHeight}
                value={calculationResult.jack_up_height}
                suffix={ja.common.mm}
                delay={1100}
              />
              <ResultCard
                title={ja.result.firstLevelHeight}
                value={calculationResult.first_layer_height}
                suffix={ja.common.mm}
                delay={1200}
              />
            </View>
          </View>
          
          {calculationResult.tie_column_used && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>建物がらみ支持</Text>
              <ResultCard
                title="建物がらみ支持の判定"
                value={calculationResult.tie_ok ? '適合' : '不適合'}
                delay={1300}
              />
            </View>
          )}
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={() => {
                /* 保存機能は将来実装予定 */
              }}
            >
              <Save size={20} color={colors.text.primary} />
              <Text style={styles.buttonText}>{ja.result.saveButton}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.recalculateButton]}
              onPress={() => router.push('/(tabs)/input')}
            >
              <RefreshCw size={20} color={colors.text.primary} />
              <Text style={styles.buttonText}>{ja.result.recalculateButton}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.dark,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: colors.text.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.dark,
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  errorButtonText: {
    color: colors.text.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.dark,
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: colors.text.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultContainer: {
    paddingBottom: 30,
  },
  section: {
    backgroundColor: colors.background.paper,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  endGapsContainer: {
    gap: 12,
  },
  spanDetails: {
    gap: 12,
  },
  heightDetails: {
    gap: 12,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
  },
  saveButton: {
    backgroundColor: colors.secondary.main,
    marginRight: 10,
  },
  recalculateButton: {
    backgroundColor: colors.primary.main,
    marginLeft: 10,
  },
  buttonText: {
    color: colors.text.primary,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});
