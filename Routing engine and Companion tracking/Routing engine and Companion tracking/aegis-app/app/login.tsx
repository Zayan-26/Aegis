import { router } from "expo-router";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
export default function LoginScreen(){
    return(
        <View style={styles.container}>
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
            />
        <TextInput 
        placeholder="Password"
        placeholderTextColor="#7A869A"
        secureTextEntry
        style={styles.input}
        />

        <TouchableOpacity style={styles.signInButton} onPress={() => router.push("/accessibility")}>
  <Text style={styles.signInButtonText}>Sign In</Text>
</TouchableOpacity>
            
        <TouchableOpacity onPress={() => router.push("/create-account")}>
            <Text style={styles.linkText}>
                Don't have an account? <Text style={styles.linkHighlight}> Create Account</Text>
            </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> router.back()}>
            <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        </View>
    </View>
    );
}

const styles=StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F8FC",
        paddingHorizontal: 24,
        paddingTop: 70,
    },
    header:{
        marginBottom: 40,
        alignItems: "center",
    },
    logo:{
        fontSize: 36,
        fontWeight: "800",
        color: "#1E2A78",
        marginBottom: 16,
        textTransform: "lowercase",
    },
    title: {
        fontSize: 28,
        fontWeight:"700",
        color: "#1E2A78",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color:"#4F647A",
        textAlign: "center",
    },
    form:{
        gap:16,
    },
    input:{
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 15,
        fontSize:16,
        borderWidth:1,
        borderColor: "#D9DDE7",
    },
    signInButton: {
        backgroundColor: "#69B7C6",
        paddingVertical:16,
        borderRadius:16,
        alignItems:"center",
        marginTop:8,
        borderWidth: 1,
    },
    signInButtonText:{
        color: "#FFFFFF",
        fontSize:18,
        fontWeight:700,
    },
    linkText: {
        marginTop:10,
        textAlign: "center",
        color: "#4F647A",
        fontSize: 15,
    },
    linkHighlight:{
        color:"#1E2A78",
        fontWeight: "700",
    },
    backText:{
        marginTop: 18,
        textAlign:"center",
        color: "#1E2A78",
        fontSize:15,
        fontWeight:"600",
    },
});



