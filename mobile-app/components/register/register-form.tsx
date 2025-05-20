import { View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { Button, Divider, Text, TextInput, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import CustomButton from "../ui/button";
import { useRegisterMutation } from "@/modules/auth/api/auth.api";
import { AuthCredentials } from "@/modules/auth/models/auth.model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGetMyProfileMutation } from "@/modules/profile/api/profile.api";
import {
  GoogleSignin
} from '@react-native-google-signin/google-signin';
import { getAuth } from "@react-native-firebase/auth";
import auth from "@react-native-firebase/auth";

interface RegisterFormProps {
  setKeyboardOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegisterForm = (props: RegisterFormProps) => {
  const [register, { data, isLoading, error: registrationError }] =
    useRegisterMutation();
  const [
      getProfile,
      { data: profileData, isLoading: profileLoading, error: profileError }
    ] = useGetMyProfileMutation();  

  const [email, setEmail] = useState<string>("");
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [showPass, setShowPass] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const theme = useTheme();
  const router = useRouter();
  const f_auth = getAuth();

  useEffect(() => {
    if (data) {
      router.push("/create-profile");
    }
  }, [data]);

  const registerUser = async () => {
    if (email === "" || password === "" || passwordConfirm === "") {
      setErrorMessage("Please fill all fields");
    } else if (!email.includes("@")) {
      setErrorMessage("Invalid email");
    } else if (password !== passwordConfirm) {
      setErrorMessage("Passwords do not match");
    } else {
      setErrorMessage("");
      try {
        const credentials: AuthCredentials = { email, password };
        f_auth
          .createUserWithEmailAndPassword(email, password)
          .then(async (userCredential) => {
            const user = await userCredential.user;
            const token = await user.getIdToken();
            AsyncStorage.setItem("accessToken", token);
            router.push("/create-profile");
          })
          .catch((error) => {
            if (error.message) setErrorMessage(error.message);
            else setErrorMessage("Unknown error occurred");
          });
      } catch (err) {
        setErrorMessage("Registration failed");
      }
    }
  };

  const onGoogleButtonClick = async () => {
    setGoogleLoading(true);
    const f_auth = getAuth();
    // Check if your device supports Google Play
    await GoogleSignin.signOut();
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // get birthday
    // Get the users ID token
    const googleSignInResult: any = await GoogleSignin.signIn().then((result) => {
      console.log(result);
      
      if(result.data===null){
        setGoogleLoading(false);
        return;
      }
      return result;
    }).catch((error) => {
      console.log(error);
      return;
    });

    // const accessToken = (await GoogleSignin.getTokens()).accessToken;
    // console.log(accessToken);

    // const userBirthday = await fetchUserBirthday(accessToken);

    // console.log(userBirthday);

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(
      googleSignInResult.data?.idToken ?? null
    );

    // Sign-in the user with the credential
    try{
      await f_auth.signInWithCredential(googleCredential).then(async (userCredential) => {
        const token = await userCredential.user.getIdToken();
        await AsyncStorage.setItem("accessToken", token);
        const profile = await getProfile(null);
        console.log(profile);
        if(profile.data?.id) {
          console.log("User already exists");
          router.push("/(tabs)");
        }else {
          console.log("User does not exist");
          router.push("/create-profile");
        }
        //logic to handle if has lifeline profile or not and redirect accordingly
      }); 
    }catch(err){
      console.log(err);
    }finally{
      setGoogleLoading(false);
    }
    setGoogleLoading(false);
  }

  return (
    <View className="px-5 mt-10">
      <Text variant="titleLarge" className="text-center">
        Register
      </Text>
      <View className="mt-5">
        <TextInput
          value={email}
          placeholder="E-mail"
          mode="outlined"
          outlineColor={theme.colors.primary}
          onPress={() => props.setKeyboardOpen && props.setKeyboardOpen(true)}
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          value={password}
          mode="outlined"
          className="mt-3"
          placeholder="password"
          outlineColor={theme.colors.primary}
          onChangeText={(password) => setPassword(password)}
          secureTextEntry={!showPass}
          onPress={() => props.setKeyboardOpen && props.setKeyboardOpen(true)}
          right={
            showPass ? (
              <TextInput.Icon
                icon="eye-off"
                onPress={() => setShowPass(!showPass)}
              />
            ) : (
              <TextInput.Icon
                icon="eye"
                onPress={() => setShowPass(!showPass)}
              />
            )
          }
        />
        <TextInput
          value={passwordConfirm}
          mode="outlined"
          className="mt-3"
          placeholder="Confirm password"
          outlineColor={theme.colors.primary}
          onChangeText={(password) => setPasswordConfirm(password)}
          secureTextEntry={!showPass}
          onPress={() => props.setKeyboardOpen && props.setKeyboardOpen(true)}
        />
      </View>
      <CustomButton className="mt-5" onPress={registerUser} loading={isLoading}>
        Sign Up
      </CustomButton>
      <CustomButton className="mt-5" mode="outlined" onPress={onGoogleButtonClick} loading={googleLoading}>
        <Image source={require('@/assets/images/google_ic.png')} style={{ width: 20, height: 20 }} />
        Sign In with Google
      </CustomButton>
      {errorMessage && (
        <View className="rounded-md p-3 bg-red-200 mt-3">
          <Text className="text-red-500 font-medium">{errorMessage}</Text>
        </View>
      )}
      <View className="flex items-center">
        <Divider bold className="my-5 w-[200px]" />
        <View className="flex flex-row items-center gap-2">
          <Text variant="bodySmall">Already have an Account?</Text>
          <Text
            onPress={() => router.push("/login")}
            variant="bodySmall"
            style={{ color: theme.colors.primary }}
          >
            Login
          </Text>
        </View>
      </View>
    </View>
  );
};

export default RegisterForm;
