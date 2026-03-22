import { useAccessibility } from "@/contexts/AccessibilityContext"
import { router } from "expo-router"
import { StyleSheet, TouchableOpacity, Text } from "react-native"

//Literally just doing this one component because it's universal.
type BackBtnProps = {

}
export default function BackBtn() {
    const { theme } = useAccessibility()
    const buttonStyle = StyleSheet.create({
        container: {alignSelf: "flex-start"},
        text: {
            color: theme.interactableTextColor,
            fontFamily: theme.font,
            fontSize: (theme.dyslexicFontSize ?? 13) + 4,
            letterSpacing: theme.letterSpacing,
            fontWeight: "500"
        }
    })
    return (
        <TouchableOpacity onPress={() => router.back()} style={buttonStyle.container}>
            <Text style={buttonStyle.text}> ← Back </Text>
        </TouchableOpacity>
    )
}