import { View } from 'react-native'
import React, { useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text, useTheme } from 'react-native-paper'
import CustomButton from '@/components/ui/button'
import { useRouter } from 'expo-router'

const NoInternetScreen = () => {
    const [loading, setloading] = useState<boolean>(false)
    const {colors} = useTheme()
    const router = useRouter()
    
    const checkConnection = ()=>{
        setloading(true)
       
    }
  return (
    <View className='flex-1 h-full flex items-center justify-center'>
        <MaterialCommunityIcons name='wifi-off' color={colors.primary} size={80}/>
        <Text variant="titleMedium" style={{color:colors.primary}} className='mt-3 text-center'>No Internet</Text>
        <Text variant="bodySmall" className='mt-1 text-center text-gray-600 w-[70%]'>
            Please check your internet connection and try again
        </Text>
        <View className='w-[150px]'>
            <CustomButton onPress={checkConnection} className="mt-2" loading={loading} disabled={loading}>Check Again</CustomButton>
        </View>
    </View>
  )
}

export default NoInternetScreen