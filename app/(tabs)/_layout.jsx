import { View, Text, Image } from 'react-native'
import { Tabs } from 'expo-router'

import { icons } from '../../constants'

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2 mt-2">
      <Image 
        source={icon}
        resizeMode='contain'
        tintColor={color}
        className="w-h h-6"
      />
      <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style={{ color: color }}>
        {name}
      </Text>
    </View>
  )
}

const TabsLayout = () => {
  return (
    <>
      <Tabs 
        screenOptions={{
          tabBarShowLabel: false,
          // tabBarActiveTintColor: '#0075FF',
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#161622',
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: 84,
            // marginTop: 5
          }
        }}
      >
          <Tabs.Screen 
            name="home"
            options={{
              title: 'Home',
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon 
                  icon={icons.home}
                  color={color}
                  name='Home'
                  focused={focused}
                />
              ),
            }}
          />

          {/* <Tabs.Screen 
            name="explore"
            options={{
              title: 'Explore',
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon 
                  icon={icons.search}
                  color={color}
                  name='Explore'
                  focused={focused}
                />
              ),
            }}
          /> */}

          {/* <Tabs.Screen 
            name="collections"
            options={{
              title: 'Collectoins',
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon 
                  icon={icons.collections2}
                  color={color}
                  name='Collectoins'
                  focused={focused}
                />
              ),
            }}
          /> */}

          <Tabs.Screen 
            name="create"
            options={{
              title: 'Create',
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon 
                  icon={icons.create}
                  color={color}
                  name='Create'
                  focused={focused}
                />
              ),
            }}
          />

          <Tabs.Screen 
            name="saved"
            options={{
              title: 'Saved',
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon 
                  icon={icons.bookmark2}
                  color={color}
                  name='Saved'
                  focused={focused}
                />
              ),
            }}
          />

          <Tabs.Screen 
            name="profile"
            options={{
              title: 'Profile',
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon 
                  icon={icons.user}
                  color={color}
                  name='Profile'
                  focused={focused}
                />
              ),
            }}
          />
      </Tabs>

      
    </>
  )
}

export default TabsLayout