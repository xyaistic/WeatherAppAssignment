import { View, Text, FlatList, Image, TouchableOpacity, Linking, Alert, TextInput, SafeAreaView, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNewsStore } from '@/App/context/newsStore'
import { Ionicons } from '@expo/vector-icons';
import ConditionTabs from '@/App/components/ConditionTabs';

export default function News() {
  const { getAllNews, getLatestnews, latestNews, news,intrestedNews }: any = useNewsStore()
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [todaysWeather, setTodaysWeather] = useState<any>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        if (todaysWeather) {
          await getAllNews(todaysWeather);
        } else {
          await getLatestnews();
        }
        setIsLoading(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch news');
        setIsLoading(false);
      }
    }
    fetchNews();
  }, [todaysWeather])

  const filteredNews = todaysWeather ? news : latestNews?.filter((item: any) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handlePress = (url: string) => {
    Linking.openURL(url)
  }

  const renderNewsItem = ({ item }: any) => (
    <TouchableOpacity
      className="bg-white mx-4 mt-4 rounded-xl overflow-hidden shadow-md relative"
      onPress={() => handlePress(item.url)}
      activeOpacity={0.7}
    >
      {item.urlToImage && (
        <Image
          source={{ uri: item.urlToImage }}
          className="w-full h-48 bg-gray-300"
          resizeMode="cover"
        />
      )}
      <View className='absolute top-2 right-2 z-50 p-2 bg-black/20 rounded-full'>
        <Ionicons name="chevron-forward" size={20} color="white" />
      </View>
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-800 mb-2 leading-6" numberOfLines={2}>
          {item.title}
        </Text>

        <Text className="text-sm text-gray-600 leading-5 mb-3" numberOfLines={3}>
          {item.description}
        </Text>

        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xs font-semibold text-blue-600 uppercase">
            {item.source?.name}
          </Text>
          <Text className="text-xs text-gray-400 italic">
            {item.author && `By ${item.author}`}
          </Text>
        </View>

        <Text className="text-xs text-gray-400 text-right">
          {new Date(item.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </View>
    </TouchableOpacity>
  )

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center pt-24">
      <Text className="text-base text-gray-400 text-center">No news articles available</Text>
    </View>
  )

  function handleSearchSubmit(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <>
      <View className="flex-1 bg-gray-100">
        <SafeAreaView className='flex-1 bg-white'>

          <View className='flex-row items-center justify-between px-4 py-3 border-b border-gray-200'>
            <Text className="text-2xl font-bold text-center">
              Latest News
            </Text>
          </View>

          <View className="flex-row items-center border rounded-2xl px-4 py-3 mx-4 my-4 border-gray-300">
            <Ionicons name="search" size={20} color="gray" style={{ opacity: 0.8 }} />
            <TextInput
              className="flex-1 text-b text-base font-medium ml-3 px-4 h-7"
              placeholder="Search News..."
              placeholderTextColor="gray"
              placeholderClassName='p-3'
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
              autoCapitalize="words"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                className="ml-2"
              >
                <Ionicons name="close-circle" size={20} color="white" style={{ opacity: 0.8 }} />
              </TouchableOpacity>
            )}
          </View>

          <ConditionTabs setTodaysWeather={setTodaysWeather} todaysWeather={todaysWeather} />

          {isLoading ? (
            <View className='flex-1 justify-center items-center'>
              <Text>Loading...</Text>
            </View>
          ) : (
            <FlatList
              data={todaysWeather ? news : filteredNews || intrestedNews || latestNews}
              renderItem={renderNewsItem}
              keyExtractor={(item, index) => item.url || index.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={renderEmptyState}
              refreshing={false}
              onRefresh={() => getLatestnews()}
            />)}
        </SafeAreaView>
      </View>
    </>
  )
}