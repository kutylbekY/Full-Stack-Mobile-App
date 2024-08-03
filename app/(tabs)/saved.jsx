import { View, Text, FlatList, Image, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from "../../constants"
import SeachInput from '../../components/SeachInput'
import EmptyState from '../../components/EmptyState'
import { getAllPosts, getSavedPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'

const Saved = () => {
  const { refresh, triggerRefresh } = useGlobalContext();
  const { user } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(() => getSavedPosts(user.$id));

  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Key to force re-render

  // console.log("Posts" + posts);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
    setRefreshKey(prevKey => prevKey + 1); // Update key to force re-render
  }

  useEffect(() => {
    if (refresh) {
      onRefresh();
      triggerRefresh(); // Reset the refresh trigger
    }
  }, [refresh]);

  return (
    <SafeAreaView className="bg-primary h-full" edges={['right', 'left', 'top']}>
      <FlatList 
        key={refreshKey} // Apply key to force re-render
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard video={item}/>
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="justify-between items-center flex-row mb-6">
              <View className="flex-1 justify-center">
                <Text className="text-2xl font-psemibold text-white">
                  Saved Posts
                </Text>
              </View>

              <View className="mt-1.5">
                <Image 
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode='contain'
                />
              </View>
            </View>

            <SeachInput />

          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title="No Collections Found"
            subtitle="Be the first to create a public collection"
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      />
    </SafeAreaView>
  )
}

export default Saved