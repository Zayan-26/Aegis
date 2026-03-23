import { login } from "@/apis/authentication";
import BackBtn from "@/components/back-button";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Toast } from "toastify-react-native";

async function loginBtn(email: string, passwd: string, clearInput: () => void) {
    if (email.length <= 0 || passwd.length <= 0) Toast.error("Input cannot be empty.")
    else {
        const out = await login(email, passwd)
        if (out instanceof Error) {
            Toast.error(out.message)
            clearInput()
        } else {
            Toast.success(`Successfully Logged in as ${out}`)
            router.replace('/accessibility')
        }
    }
}

export default function LoginScreen() {
    const [email, setEmail] = useState('')
    const [passwd, setPasswd] = useState('')
    return (
        <View style={styles.container}>
            <BackBtn />
            <View style={styles.header}>
                <Text style={styles.logo}>aegis</Text>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to continue your safe journey with us</Text>
            </View>

            <View style={styles.form}>
                <TextInput
                    placeholder="Email address"
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
                    value={passwd}
                />

                <TouchableOpacity style={styles.signInButton} onPress={async () => loginBtn(email, passwd, () => {
                    setPasswd('')
                })}>
                    <Text style={styles.signInButtonText}>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/create-account")}>
                    <Text style={styles.linkText}>
                        Don't have an account? <Text style={styles.linkHighlight}> Create Account</Text>
                    </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={()=> router.back()}>
            <Text style={styles.backText}>Back</Text>
            </TouchableOpacity> */}
            </View>
            <TouchableOpacity style={{marginTop: 'auto', marginBottom: 100}}>
                <Text style={[styles.linkHighlight, {textAlign: "center"}]}>
                    Skip Login (Test)
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F8FC",
        paddingHorizontal: 24,
        paddingTop: 70,
    },
    header: {
        marginBottom: 40,
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
    signInButton: {
        backgroundColor: "#69B7C6",
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
        marginTop: 8,
        borderWidth: 1,
    },
    signInButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: 700,
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



