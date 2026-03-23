import { createAccount } from "@/apis/authentication";
import BackBtn from "@/components/back-button";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Toast } from "toastify-react-native";

async function registerBtn(fullName: string, email: string, password: string, confirmpwd: string, clearpwdCallback: void) {
  if (password !== confirmpwd) {
    Toast.error('Passwords do not match.')
    clearpwdCallback
  }
  else {
    const err = await createAccount(fullName, email, password)
    if (err) {
      Toast.error(err.message)
      router.replace('/')
    } else {
      Toast.success("Account creation successful.")
      router.back()
    }
  }
}

export default function CreateAccountScreen() {
  // var fullName: string
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [passwd, setPasswd] = useState('')
  const [rpasswd, setRPasswd] = useState('')
  return (
    <View style={styles.container}>
      <BackBtn />
      <View style={styles.header}>
        <Text style={styles.logo}>aegis</Text>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Set up your account to start navigation safely</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          placeholder="Display Name"
          placeholderTextColor="#7A869A"
          style={styles.input}
          onChangeText={setFullName}
          />
        <TextInput
          placeholder="Email Address"
          placeholderTextColor="#7A869A"
          style={styles.input}
          onChangeText={setEmail}
          />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#7A869A"
          secureTextEntry
          style={styles.input}
          onChangeText={setPasswd}
          />
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#7A869A"
          secureTextEntry
          style={styles.input}
          onChangeText={setRPasswd}
          />
        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={async () => await registerBtn(fullName, email, passwd, rpasswd)}>

          <Text style={styles.createAccountButtonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.navigate('/login')}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.linkHighlight}> Sign In</Text>
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={()=> router.back()}>
            <Text style={styles.backText}>Back</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FC",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  logo: {
    fontSize: 36,
    fontWeight: "800",
    color: "#1E2A78",
    marginBottom: 16,
    textTransform: "lowercase",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E2A78",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#4F647A",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#D9DDE7",
  },
  createAccountButton: {
    backgroundColor: "#69B7C6",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
  },
  createAccountButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  linkText: {
    marginTop: 10,
    textAlign: "center",
    color: "#4F647A",
    fontSize: 15,
  },
  linkHighlight: {
    color: "#1E2A78",
    fontWeight: "700",
  },
  backText: {
    marginTop: 18,
    textAlign: "center",
    color: "#1E2A78",
    fontSize: 15,
    fontWeight: "600",
  },
});






