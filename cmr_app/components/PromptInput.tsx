import { View, StyleSheet, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Search, Zap } from 'lucide-react-native';
import { Prompt } from '@/types/types';

interface PromptInputProps {
  onSelectPrompt: (prompt: Prompt) => void;
  selectedPrompt: Prompt | null;
}

// Predefined prompt templates
const promptTemplates: Prompt[] = [
  { id: '1', label: '夢の中の風景', text: '夢の中の幻想的な風景を生成してください' },
  { id: '2', label: 'サイバーパンクの街並み', text: 'ネオンと雨が降る未来的なサイバーパンクの街並みを生成してください' },
  { id: '3', label: '宇宙船', text: '未来的な宇宙船のデザインを生成してください' },
  { id: '4', label: '和風の庭園', text: '静かで美しい日本の伝統的な庭園を生成してください' },
  { id: '5', label: '水中都市', text: '海底にある幻想的な水中都市を生成してください' },
  { id: '6', label: '魔法の森', text: '神秘的な生き物が住む魔法の森を生成してください' },
];

export function PromptInput({ onSelectPrompt, selectedPrompt }: PromptInputProps) {
  const { colors } = useTheme();
  const [customPrompt, setCustomPrompt] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectPrompt = (prompt: Prompt) => {
    onSelectPrompt(prompt);
  };

  const handleSubmitCustomPrompt = () => {
    if (customPrompt.trim().length > 0) {
      const newPrompt: Prompt = {
        id: `custom-${Date.now()}`,
        label: customPrompt.length > 15 ? customPrompt.substring(0, 15) + '...' : customPrompt,
        text: customPrompt,
      };
      onSelectPrompt(newPrompt);
      setCustomPrompt('');
    }
  };

  const filteredPrompts = searchQuery
    ? promptTemplates.filter(
        (prompt) =>
          prompt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : promptTemplates;

  const renderPromptItem = ({ item }: { item: Prompt }) => (
    <TouchableOpacity
      style={[
        styles.promptItem,
        selectedPrompt?.id === item.id && { backgroundColor: colors.primaryDark },
      ]}
      onPress={() => handleSelectPrompt(item)}
    >
      <Zap size={16} color={colors.accent} style={styles.promptIcon} />
      <View>
        <Text style={[styles.promptLabel, { color: colors.text }]}>{item.label}</Text>
        <Text style={[styles.promptText, { color: colors.secondaryText }]} numberOfLines={1}>
          {item.text}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
      <Text style={[styles.title, { color: colors.text }]}>プロンプトを選択</Text>
      
      <View style={[styles.searchContainer, { backgroundColor: colors.inputBackground }]}>
        <Search size={18} color={colors.secondaryText} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="プロンプトを検索..."
          placeholderTextColor={colors.secondaryText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <FlatList
        data={filteredPrompts}
        renderItem={renderPromptItem}
        keyExtractor={(item) => item.id}
        style={styles.promptList}
      />
      
      <View style={styles.customPromptContainer}>
        <Text style={[styles.customPromptLabel, { color: colors.text }]}>
          カスタムプロンプト
        </Text>
        <View style={styles.customPromptInputContainer}>
          <TextInput
            style={[styles.customPromptInput, { 
              color: colors.text,
              backgroundColor: colors.inputBackground,
              borderColor: colors.border 
            }]}
            placeholder="あなたのプロンプトを入力..."
            placeholderTextColor={colors.secondaryText}
            value={customPrompt}
            onChangeText={setCustomPrompt}
            multiline
          />
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={handleSubmitCustomPrompt}
          >
            <Text style={styles.submitButtonText}>使用</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: 500,
  },
  title: {
    fontFamily: 'NotoSansJP-Bold',
    fontSize: 18,
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 20,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: 'NotoSansJP-Regular',
  },
  promptList: {
    maxHeight: 250,
  },
  promptItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginVertical: 4,
  },
  promptIcon: {
    marginRight: 10,
  },
  promptLabel: {
    fontFamily: 'NotoSansJP-Bold',
    fontSize: 14,
  },
  promptText: {
    fontFamily: 'NotoSansJP-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  customPromptContainer: {
    marginTop: 20,
  },
  customPromptLabel: {
    fontFamily: 'NotoSansJP-Bold',
    fontSize: 14,
    marginBottom: 8,
  },
  customPromptInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  customPromptInput: {
    flex: 1,
    minHeight: 80,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    fontFamily: 'NotoSansJP-Regular',
    textAlignVertical: 'top',
  },
  submitButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontFamily: 'NotoSansJP-Bold',
    fontSize: 14,
  },
});