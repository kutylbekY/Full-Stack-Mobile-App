import { View, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import InfoBox from '../../components/InfoBox'
import EmptyState from '../../components/EmptyState'
import { getUserPosts, signOut } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'
import { icons } from '../../constants'

import { router } from 'expo-router'
import { useState, useEffect } from 'react'

const Profile = () => {
  const { user, setUser, setIsLoggedIn, refresh, triggerRefresh } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(() => getUserPosts(user.$id));

  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Key to force re-render

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

  const logout = async () =>{
    setUser(null);
    setIsLoggedIn(false);
    await signOut();

    router.replace('/sign-in');
  }

  return (
    <SafeAreaView className="flex bg-primary h-full" edges={['right', 'left', 'top']}>
      <FlatList 
        key={refreshKey} // Apply key to force re-render
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard video={item}/>
        )}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">

            <TouchableOpacity
              className="w-full items-end mb-10 mr-5"
              onPress={logout}
            >
              <Image 
                source={icons.logout}
                resizeMode='contain'
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 rounded-lg justify-center items-center">
              <Image 
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg border border-secondary"
                resizeMode='cover'
              />
            </View>

            <InfoBox 
              title = {user?.username}
              containerStyles = 'mt-5'
              titleStyles = "text-lg"
            />

            <View className="mt-5 flex-row">
              <InfoBox 
                title = {posts.length || 0}
                subtitle="Posts"
                containerStyles = 'mr-10'
                titleStyles = "text-xl"
              />

              <InfoBox 
                title = "1.2K"
                subtitle = "Followers"
                titleStyles = "text-xl"
              />
            </View>

          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title="No Collections Found"
            subtitle="No collections found for this search query"
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      />
    </SafeAreaView>
  )
}

export default Profile