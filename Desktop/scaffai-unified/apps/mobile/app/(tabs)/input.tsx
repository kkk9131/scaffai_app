import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { InputField } from '@/components/InputField';
import { SwitchField } from '@/components/SwitchField';
import { RadioField } from '@/components/RadioField';
import { colors } from '@/constants/colors';
import { ja } from '@/constants/translations';
import { useScaffold } from '@/context/ScaffoldContext';
import { ArrowRight, RotateCcw, Info } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { validateInput } from '@/utils/validation';
import Constants from 'expo-constants';

// バージョン情報 - 更新するたびに変更
const APP_VERSION = '1.0.1'; // 2025-05-23更新
const LAST_UPDATED = '2025-05-23 09:50';

export default function InputScreen() {
  const {
    inputData,
    setInputValue,
    resetInputData,
    calculateScaffold,
    isLoading,
  } = useScaffold();
  
  // 入力検証のエラー状態
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  
  // 計算実行 - 直接同期的に実行するシンプルな形に修正
  const handleCalculate = () => {
    console.log('Calculate button pressed');
    
    try {
      // 必須フィールドだけでも値を入力しておく (テスト用)
      if (!inputData.frameWidth.northSouth) {
        setInputValue('frameWidth', 'northSouth', 1000);
      }
      if (!inputData.frameWidth.eastWest) {
        setInputValue('frameWidth', 'eastWest', 1000);
      }
      if (!inputData.referenceHeight) {
        setInputValue('referenceHeight', '', 2400);
      }
      
      // 検証をスキップして直接計算を実行
      calculateScaffold();
    } catch (error) {
      console.error('Error in handleCalculate:', error);
      Alert.alert('エラー', 'ボタン処理中にエラーが発生しました');
    }
  };
  
  // 数値入力を処理する関数
  const handleNumberInput = (
    category: keyof typeof inputData,
    field: string,
    value: string
  ) => {
    const numValue = value === '' ? null : Number(value);
    setInputValue(category, field, numValue);
  };

  // バージョン情報表示
  const showVersionInfo = () => {
    Alert.alert(
      'アプリ情報',
      `バージョン: ${APP_VERSION}\n最終更新: ${LAST_UPDATED}\nExpo SDK: ${Constants.expoConfig?.sdkVersion || '不明'}`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <Animated.View 
          entering={FadeIn.duration(600)}
          style={styles.header}
        >
          <Text style={styles.title}>{ja.input.title}</Text>
          <TouchableOpacity
            style={styles.versionButton}
            onPress={showVersionInfo}
          >
            <Info size={16} color={colors.text.secondary} />
          </TouchableOpacity>
        </Animated.View>
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{ja.input.frameWidth}</Text>
            <InputField
              label={ja.input.northSouth}
              value={inputData.frameWidth.northSouth?.toString() || ''}
              onChangeText={(value) =>
                handleNumberInput('frameWidth', 'northSouth', value)
              }
              keyboardType="numeric"
              error={errors['frameWidth.northSouth']}
              suffix={ja.common.mm}
            />
            <InputField
              label={ja.input.eastWest}
              value={inputData.frameWidth.eastWest?.toString() || ''}
              onChangeText={(value) =>
                handleNumberInput('frameWidth', 'eastWest', value)
              }
              keyboardType="numeric"
              error={errors['frameWidth.eastWest']}
              suffix={ja.common.mm}
            />
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{ja.input.eaveOverhang}</Text>
            <InputField
              label={ja.input.north}
              value={inputData.eaveOverhang.north?.toString() || ''}
              onChangeText={(value) =>
                handleNumberInput('eaveOverhang', 'north', value)
              }
              keyboardType="numeric"
              error={errors['eaveOverhang.north']}
              suffix={ja.common.mm}
            />
            <InputField
              label={ja.input.east}
              value={inputData.eaveOverhang.east?.toString() || ''}
              onChangeText={(value) =>
                handleNumberInput('eaveOverhang', 'east', value)
              }
              keyboardType="numeric"
              error={errors['eaveOverhang.east']}
              suffix={ja.common.mm}
            />
            <InputField
              label={ja.input.south}
              value={inputData.eaveOverhang.south?.toString() || ''}
              onChangeText={(value) =>
                handleNumberInput('eaveOverhang', 'south', value)
              }
              keyboardType="numeric"
              error={errors['eaveOverhang.south']}
              suffix={ja.common.mm}
            />
            <InputField
              label={ja.input.west}
              value={inputData.eaveOverhang.west?.toString() || ''}
              onChangeText={(value) =>
                handleNumberInput('eaveOverhang', 'west', value)
              }
              keyboardType="numeric"
              error={errors['eaveOverhang.west']}
              suffix={ja.common.mm}
            />
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{ja.input.propertyLine}</Text>
            <View style={styles.propertyLineContainer}>
              <View style={styles.propertyLineItem}>
                <SwitchField
                    label={ja.input.north}
                    value={inputData.propertyLine.north}
                    onValueChange={(value) =>
                     setInputValue('propertyLine', 'north', value)
                    }
                />
                {inputData.propertyLine.north && (
                  <InputField
                    label={`${ja.input.north}距離`}
                    value={inputData.propertyLineDistance?.north?.toString() || ''}
                    onChangeText={(value) =>
                      handleNumberInput('propertyLineDistance', 'north', value)
                    }
                    keyboardType="numeric"
                    error={errors['propertyLineDistance.north']}
                    suffix={ja.common.mm}
                  />
                )}
              </View>
              <View style={styles.propertyLineItem}>
                <SwitchField
                    label={ja.input.east}
                    value={inputData.propertyLine.east}
                    onValueChange={(value) =>
                     setInputValue('propertyLine', 'east', value)
                    }
                />
                {inputData.propertyLine.east && (
                  <InputField
                    label={`${ja.input.east}距離`}
                    value={inputData.propertyLineDistance?.east?.toString() || ''}
                    onChangeText={(value) =>
                      handleNumberInput('propertyLineDistance', 'east', value)
                    }
                    keyboardType="numeric"
                    error={errors['propertyLineDistance.east']}
                    suffix={ja.common.mm}
                  />
                )}
              </View>
              <View style={styles.propertyLineItem}>
                <SwitchField
                    label={ja.input.south}
                    value={inputData.propertyLine.south}
                    onValueChange={(value) =>
                     setInputValue('propertyLine', 'south', value)
                    }
                />
                {inputData.propertyLine.south && (
                  <InputField
                    label={`${ja.input.south}距離`}
                    value={inputData.propertyLineDistance?.south?.toString() || ''}
                    onChangeText={(value) =>
                      handleNumberInput('propertyLineDistance', 'south', value)
                    }
                    keyboardType="numeric"
                    error={errors['propertyLineDistance.south']}
                    suffix={ja.common.mm}
                  />
                )}
              </View>
              <View style={styles.propertyLineItem}>
                <SwitchField
                    label={ja.input.west}
                    value={inputData.propertyLine.west}
                    onValueChange={(value) =>
                     setInputValue('propertyLine', 'west', value)
                    }
                />
                {inputData.propertyLine.west && (
                  <InputField
                    label={`${ja.input.west}距離`}
                    value={inputData.propertyLineDistance?.west?.toString() || ''}
                    onChangeText={(value) =>
                      handleNumberInput('propertyLineDistance', 'west', value)
                    }
                    keyboardType="numeric"
                    error={errors['propertyLineDistance.west']}
                    suffix={ja.common.mm}
                  />
                )}
              </View>
            </View>
          </View>
          
          <View style={styles.section}>
            <InputField
              label={ja.input.referenceHeight}
              value={inputData.referenceHeight?.toString() || ''}
              onChangeText={(value) =>
                handleNumberInput('referenceHeight', '', value)
              }
              keyboardType="numeric"
              error={errors['referenceHeight']}
              suffix={ja.common.mm}
            />
          </View>
          
          <View style={styles.section}>
            <RadioField
              label={ja.input.roofShape}
              options={[
                { label: ja.input.roofShapes.flat, value: 'flat' },
                { label: ja.input.roofShapes.sloped, value: 'sloped' },
                { label: ja.input.roofShapes.roofDeck, value: 'roofDeck' },
              ]}
              selectedValue={inputData.roofShape}
              onValueChange={(value) =>
                setInputValue('roofShape', '', value)
              }
            />
          </View>
          
          <View style={styles.section}>
            <SwitchField
              label={ja.input.tieColumns}
              value={inputData.hasTieColumns}
              onValueChange={(value) =>
                setInputValue('hasTieColumns', '', value)
              }
            />
          </View>
          
          <View style={styles.section}>
            <InputField
              label={ja.input.eavesHandrails}
              value={inputData.eavesHandrails?.toString() || ''}
              onChangeText={(value) =>
                handleNumberInput('eavesHandrails', '', value)
              }
              keyboardType="numeric"
              error={errors['eavesHandrails']}
              suffix={ja.common.items}
            />
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{ja.input.specialMaterial}</Text>
            <View style={styles.directionContainer}>
              <View style={styles.directionColumn}>
                <Text style={styles.directionTitle}>{ja.input.northSouth}</Text>
                <InputField
                    label={ja.input.material355}
                    value={inputData.specialMaterial.northSouth.material355?.toString() || ''}
                    onChangeText={(value) =>
                      handleNumberInput('specialMaterial', 'northSouth.material355', value)
                    }
                    keyboardType="numeric"
                    error={errors['specialMaterial.northSouth.material355']}
                    suffix={ja.common.items}
                />
                <InputField
                    label={ja.input.material300}
                    value={inputData.specialMaterial.northSouth.material300?.toString() || ''}
                    onChangeText={(value) =>
                      handleNumberInput('specialMaterial', 'northSouth.material300', value)
                    }
                    keyboardType="numeric"
                    error={errors['specialMaterial.northSouth.material300']}
                    suffix={ja.common.items}
                />
                <InputField
                    label={ja.input.material150}
                    value={inputData.specialMaterial.northSouth.material150?.toString() || ''}
                    onChangeText={(value) =>
                      handleNumberInput('specialMaterial', 'northSouth.material150', value)
                    }
                    keyboardType="numeric"
                    error={errors['specialMaterial.northSouth.material150']}
                    suffix={ja.common.items}
                />
              </View>
              <View style={styles.directionColumn}>
                <Text style={styles.directionTitle}>{ja.input.eastWest}</Text>
                <InputField
                    label={ja.input.material355}
                    value={inputData.specialMaterial.eastWest.material355?.toString() || ''}
                    onChangeText={(value) =>
                      handleNumberInput('specialMaterial', 'eastWest.material355', value)
                    }
                    keyboardType="numeric"
                    error={errors['specialMaterial.eastWest.material355']}
                    suffix={ja.common.items}
                />
                <InputField
                    label={ja.input.material300}
                    value={inputData.specialMaterial.eastWest.material300?.toString() || ''}
                    onChangeText={(value) =>
                      handleNumberInput('specialMaterial', 'eastWest.material300', value)
                    }
                    keyboardType="numeric"
                    error={errors['specialMaterial.eastWest.material300']}
                    suffix={ja.common.items}
                />
                <InputField
                    label={ja.input.material150}
                    value={inputData.specialMaterial.eastWest.material150?.toString() || ''}
                    onChangeText={(value) =>
                      handleNumberInput('specialMaterial', 'eastWest.material150', value)
                    }
                    keyboardType="numeric"
                    error={errors['specialMaterial.eastWest.material150']}
                    suffix={ja.common.items}
                />
              </View>
            </View>
          </View>
          
          <View style={styles.section}>
            <InputField
              label={ja.input.targetOffset}
              value={inputData.targetOffset?.toString() || ''}
              onChangeText={(value) =>
                handleNumberInput('targetOffset', '', value)
              }
              keyboardType="numeric"
              error={errors['targetOffset']}
              suffix={ja.common.mm}
            />
          </View>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={resetInputData}
            >
              <RotateCcw size={20} color={colors.text.primary} />
              <Text style={styles.buttonText}>{ja.input.resetButton}</Text>
            </TouchableOpacity>
            
            {/* 計算ボタン */}
            <TouchableOpacity
              style={[
                styles.button,
                styles.calculateButton,
                isLoading && styles.disabledButton,
              ]}
              onPress={handleCalculate}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.text.primary} />
              ) : (
                <>
                  <Text style={styles.buttonText}>{ja.input.calculateButton}</Text>
                  <ArrowRight size={20} color={colors.text.primary} />
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  versionButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
    backgroundColor: colors.background.paper,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  propertyLineContainer: {
    gap: 16,
  },
  propertyLineItem: {
    backgroundColor: colors.background.card,
    borderRadius: 8,
    padding: 12,
  },
  directionContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  directionColumn: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: 8,
    padding: 12,
  },
  directionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 12,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
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
  resetButton: {
    backgroundColor: colors.background.card,
    marginRight: 10,
  },
  calculateButton: {
    backgroundColor: colors.primary.main,
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: `${colors.primary.main}80`,
  },
  buttonText: {
    color: colors.text.primary,
    fontWeight: 'bold',
    fontSize: 16,
    marginHorizontal: 8,
  },
});
