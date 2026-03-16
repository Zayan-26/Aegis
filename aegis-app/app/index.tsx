import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WelcomeScreen() {
return(
<View style={styles.container}>
<View style={styles.topSection}>
<Image 
source={require("../assets/images/aegis-logo.png")}
style={styles.logoImage}
resizeMode="contain" />


<Text style={styles.tagline}>
Navigate safely. Travel confidently.
</Text>
</View>

<View style={styles.bottomSection}>
  <TouchableOpacity 
  style={styles.signInButton}
  onPress={() => router.push("/login")}
  >
      <Text style={styles.signInButtonText}>Sign In</Text>
  </TouchableOpacity>
<TouchableOpacity
style={styles.createAccountButton}
onPress={() => router.push("/create-account")}
>
      <Text style={styles.createAccountButtonText}>Create Account</Text>
    </TouchableOpacity>
  </View>
</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  topSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSection: {
    width:"100%",
    marginBottom: 30,
  },
  logoImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  tagline: {
    fontSize: 18,
    color:"#2D4F6C",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  signInButton: {
    width: "100%",
    backgroundColor:"#69B7C6",
    paddingVertical: 16,
    borderRadius:16,
    alignItems:"center",
    marginBottom: 14,
    borderWidth: 1,
  },
  signInButtonText: {
    color:"#FFFFFF",
    fontSize: 18,
    fontWeight:"700",
  },
  createAccountButton: {
    width: "100%",
    backgroundColor:"#FFFFFF",
    paddingVertical: 16,
    borderRadius:16,
    alignItems:"center",
    marginBottom: 14,
    borderWidth: 1,
  },
  createAccountButtonText:{
    color:"#1E2A78",
    fontSize: 18,
    fontWeight:"700",
  },
});

