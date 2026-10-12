import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../hooks/use-theme";
import { NotesProvider } from "../context/NotesContext";

function RootLayoutNav() {
    const { colors, isDark } = useTheme();

    return (
        <SafeAreaProvider>
            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <StatusBar hidden={true} style={isDark ? "light" : "dark"} />
                <Stack
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: colors.card,
                        },
                        headerTintColor: colors.text,
                        headerTitleStyle: {
                            fontWeight: "700",
                        },
                        contentStyle: {
                            backgroundColor: colors.background,
                        },
                    }}
                >
                    <Stack.Screen
                        name="index"
                        options={{
                            headerShown: false,
                        }}
                    />

                    <Stack.Screen
                        name="search"
                        options={{
                            title: "Search Notes",
                        }}
                    />

                    <Stack.Screen
                        name="pinned"
                        options={{
                            title: "Pinned Notes",
                        }}
                    />

                    <Stack.Screen
                        name="settings"
                        options={{
                            title: "Settings",
                        }}
                    />

                    <Stack.Screen
                        name="note/create"
                        options={{
                            title: "Create Note",
                        }}
                    />

                    <Stack.Screen
                        name="note/[id]"
                        options={{
                            title: "Note",
                        }}
                    />

                    <Stack.Screen
                        name="note/edit/[id]"
                        options={{
                            title: "Edit Note",
                        }}
                    />

                    <Stack.Screen
                        name="+not-found"
                        options={{
                            title: "Page Not Found",
                        }}
                    />

                </Stack>
            </View>
        </SafeAreaProvider>
    );
}

export default function RootLayout() {
    return (
        <ThemeProvider>
            <NotesProvider>
                <RootLayoutNav />
            </NotesProvider>
        </ThemeProvider>
    );
}