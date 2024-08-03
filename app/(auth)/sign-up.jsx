import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import { Link, router } from 'expo-router'

import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomBtn from "../../components/CustomBtn";
import { createUser } from '../../lib/appwrite'
import { useGlobalContext } from "../../context/GlobalProvider";

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setform] = useState({
    username: '',
    email: '',
    password: '',
    // repeatPassword: '',
  })
  
  const submit = async () => {
    // if (!form.username || !form.email || !form.password) {
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert('Error', 'Please fill in all the fields');
    }

    setIsSubmitting(true);

    try {
      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setIsLogged(true);

      router.replace('/home');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center h-full px-4 my-6">
          <Image 
            source={images.logo} 
            resizeMode='contain' 
            className="w-[115px] h-[35px]"
          />
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Sign up to Style</Text>
        
          <FormField 
            title="Username"
            value={form.username}
            placeholder="Username"
            handleChangeText={(e) => setform({...form, username: e})}
            otherStyles="mt-10"
          />

          <FormField 
            title="Email"
            value={form.email}
            placeholder="Email"
            handleChangeText={(e) => setform({...form, email: e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField 
            title="Password"
            value={form.password}
            placeholder="Password"
            handleChangeText={(e) => setform({...form, password: e})}
            otherStyles="mt-7"
          />

          {/* <FormField 
            title="RepeatPassword"
            value={form.repeatPassword}
            placeholder="Repeat password"
            handleChangeText={(e) => setform({...form, repeatPassword: e})}
            otherStyles="mt-7"
          /> */}

          <CustomBtn 
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">Registered already?</Text>
            <Link href="/sign-in" className='text-lg font-semibold text-secondary'>Sign In</Link>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp