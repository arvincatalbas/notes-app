import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/use-theme";

export default function NotFoundScreen() {
    const { colors } = useTheme();

    return (
        <>
            <Stack.Screen options={{ title: "Page Not Found" }} />
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.iconContainer, { backgroundColor: colors.input }]}>
                    <Ionicons
                        name="compass-outline"
                        size={64}
                        color={colors.primary}
                    />
                </View>

                <Text style={[styles.title, { color: colors.text }]}>
                    Page Not Found
                </Text>

                <Text style={[styles.message, { color: colors.secondary }]}>
                    The page you are looking for doesn&apos;t exist, was removed, or had its name changed.
                </Text>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.primary }]}
                    onPress={() => router.replace("/")}
                    activeOpacity={0.8}
                >
                    <Ionicons name="home-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Go to Home Screen</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    iconContainer: {
        width: 110,
        height: 110,
        borderRadius: 55,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
        marginBottom: 10,
        textAlign: "center",
    },
    message: {
        fontSize: 15,
        lineHeight: 22,
        textAlign: "center",
        marginBottom: 32,
        maxWidth: 300,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 14,
        gap: 8,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
});
