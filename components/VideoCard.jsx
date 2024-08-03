import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { icons } from '../constants'
import { Video, ResizeMode } from 'expo-av'
import { useGlobalContext } from '../context/GlobalProvider'
import { updatePost, isSaved } from '../lib/appwrite'

const VideoCard = ({ video }) => {
    const { title, thumbnail, videoUri, users: { username, avatar } } = video;
    // console.log(video.$id);
    // console.log(videoId);

    const { user } = useGlobalContext();
    const [play, setPlay] = useState(false);
    const [IsOpenMenu, setIsOpenMenu] = useState(false);
    const { triggerRefresh } = useGlobalContext();

    useEffect(() => {
        const checkIfSaved = async () => {
            try {
                if (user) {
                    const saved = await isSaved(user, video.$id);
                    setIsOpenMenu(saved);
                }
            } catch (error) {
                console.error("Error checking if saved:", error.message);
            }
        };

        checkIfSaved();
    }, [user, video.$id]);

    const handlePress = async () => {
        try {
            const saved = !IsOpenMenu;
            setIsOpenMenu(saved);
            await updatePost(user, video.$id);
            triggerRefresh();
        } catch (error) {
            console.error("Error handling press:", error.message);
        }
    };

    return (
    <View className="flex-col items-center px-4 mb-14">
        <View className="flex-row gap-3 items-start">
            <View className="justify-center items-center flex-row flex-1">
                <View className="w-[46px] h-[46px] rounder-lg justify-center items-center p-0.5">
                    <Image 
                        source={{ uri: avatar}}
                        className="w-full h-full rounded-lg border border-secondary"
                        resizeMode='cover'
                    />
                </View>

                <View className="justify-center flex-1 ml-3 gap-y-1">
                    <Text className="text-white font-psemibold text-sm" numberOfLines={1}>
                        {title}
                    </Text>

                    <Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>
                        {username}
                    </Text>
                </View>
            </View>

            <View className="pt-2">
                <TouchableOpacity
                    onPress={handlePress}
                >
                    <Image source={IsOpenMenu ? icons.bookmark : icons.bookmark3} className="w-5 h-5" resizeMode='contain'/>
                </TouchableOpacity>
            </View>
        </View>

        {play ? (
           <Video 
            source={{ uri: videoUri }}
            className="w-full h-60 rounded-xl mt-3"
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay
            onPlaybackStatusUpdate={(status) => {
                if(status.didJustFinish) {
                    setPlay(false);
                }
            }}
            />
        ) : (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setPlay(true)}
                className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
            >
                <Image 
                    source={{uri:thumbnail}}
                    className="w-full h-full rounded-xl mt-3"
                    resizeMode='cover'
                />
                <Image
                    source={icons.play}
                    className="w-12 h-12 absolute"
                    resizeMode='contain'
                />
            </TouchableOpacity>
        )}        
                
        {/* {IsOpenMenu && (
            <View className="absolute mt-10 right-5 rounded-xl bg-primary h-[25%]">
                <View className="flex-col justify-center items-center">
                    <TouchableOpacity onPress={() => Alert.alert('Save option pressed')} className="flex-row justify-center items-center mt-1">
                        <Image source={icons.bookmark} className="w-5 h-5" resizeMode='contain'/>
                        <Text className="px-4 py-2 text-white">Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Alert.alert('Delete option pressed')} className="flex-row justify-center items-center">
                        <Image source={icons.delete_icon} className="w-5 h-5 ml-3" resizeMode='contain'/>
                        <Text className="px-4 py-2 text-white">Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )} */}
    </View>
  )
}

export default VideoCard