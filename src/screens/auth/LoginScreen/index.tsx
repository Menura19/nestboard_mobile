// src/screens/LoginScreen.tsx
import React, { useState } from "react";
import {
  View, Text, TouchableOpacity,
  StyleSheet
  ,
} from "react-native";
import { Mail } from "lucide-react-native";
import IconInput from "../../../components/ui/IconInput";
import PasswordField from "../../../components/ui/PasswordField";
import RegularButton from "../../../components/ui/RegularButton";
import { Colors } from "../../../constant/colors";
import AuthUIWrapper from "../../../components/wrappers/AuthUIWrapper";
import FormComponentWrapper from "../../../components/wrappers/FormComponentWrapper";
import { AuthAPI } from "../../../api/auth";
import { useDispatch } from "react-redux";
import { saveToken } from "../../../store/authSlice";
import { persistLogin } from "../../../util/localStorage";
import { useNavigation } from "@react-navigation/native";
import useSocialAuth from "../../../hooks/useSocialAuth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const nav: any = useNavigation();

  const handleContinue = async () => {
    setError(null);

    if (!email && !password) {
      setError('Please enter email and password');
      return;
    } else if (!email) {
      setError('Please enter the email');
      return;
    } else if (!password) {
      setError('Please enter the password');
      return;
    }
    setLoading(true);
    try {
      const data = await AuthAPI.login({ email, password });

      // Save the tokens inside the global state using redux
      dispatch(saveToken({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      }))

      //Save the refresh token inside the device storage
      persistLogin(data.refreshToken)
} catch (err: any) {
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else {
        setError('Something went wrong, please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  //Development , Staging, QA, Production
  //Debug , Release

  //nestboard://
  //nestboard://property/897a4dd4-6268-4fdb-950d-98a11b2f2e6b

  const { authGoogle, loading: googleAuthenticating } = useSocialAuth();

  const joinWithGoogle = () => {
    authGoogle();
  }

  return (
    <AuthUIWrapper heightPrecentage={'45%'}>
      <View style={styles.formContainer}>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue to your account.</Text>

        <FormComponentWrapper title="Email"  >
          <IconInput
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            Icon={Mail}
            onChangeText={setEmail}
          />
        </FormComponentWrapper>

        <FormComponentWrapper title="Password" >
          <PasswordField
            password={password}
            setPassword={setPassword}
            placeholder={"Enter your password"}
          />
        </FormComponentWrapper>

        {error && <Text style={styles.error}>{error}</Text>}

        <RegularButton
          Icon={undefined}
          text={"Continue"}
          onPress={handleContinue}
          loading={loading}
          marginTop={20}
        />

        {/* Divider*/}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 10, height: 20, }}>
          <View style={{ flex: 1, height: 1, backgroundColor: "#e7e7e7" }}></View>
          <Text style={styles.dividerText}>
            Or
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: "#e7e7e7" }}></View>
        </View>

        <RegularButton
          Icon={undefined}
          variant="outline"
          text={"Join with Google"}
          onPress={joinWithGoogle}
          loading={googleAuthenticating}
        />

        <TouchableOpacity onPress={() => nav.navigate('Signup')}>
          <Text style={styles.footerText}>
            Don't have an account? <Text style={styles.link}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </AuthUIWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: { flex: 1, justifyContent: 'flex-end', },
  formContainer: {
    padding: 24, justifyContent: 'center', backgroundColor: '#ffffff', paddingBottom: 50,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: { fontSize: 24, fontWeight: '700', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4, marginBottom: 24 },
  label: { fontSize: 13, fontWeight: '600', color: '#111827', marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 10, marginBottom: 16, gap: 8,
  },
  input: { flex: 1, fontSize: 14, color: '#111827' },
  error: { color: '#DC2626', fontSize: 13, marginBottom: 12 },
  button: {
    backgroundColor: '#E8623A', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginTop: 8,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  dividerText: { fontSize: 13 },
  footerText: { textAlign: 'center', color: '#6B7280', fontSize: 13, marginTop: 24 },
  link: { color: '#E8623A', fontWeight: '700' },
  nest: {
    color: Colors.SECONDARY_COLOR,
    fontSize: 30,
    fontWeight: '700',
  }
});