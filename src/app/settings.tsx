import React from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useNotes } from "../hooks/useNotes";
import { useTheme, ThemeMode } from "../hooks/use-theme";

export default function SettingsScreen() {
    const { notes, deleteAllNotes } = useNotes();
    const { colors, themeMode, setThemeMode } = useTheme();

    function handleDeleteAll() {
        if (notes.length === 0) {
            Alert.alert("No notes", "There are no notes to delete.");
            return;
        }

        Alert.alert(
            "Delete all notes",
            "This will permanently delete all notes.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete All",
                    style: "destructive",
                    onPress: deleteAllNotes,
                },
            ]
        );
    }

    const themeOptions: { mode: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
        { mode: "system", label: "System Default", icon: "desktop-outline" },
        { mode: "light", label: "Light Mode", icon: "sunny-outline" },
        { mode: "dark", label: "Dark Mode", icon: "moon-outline" },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.sectionTitle, { color: colors.secondary }]}>
                APPEARANCE
            </Text>

            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                {themeOptions.map((option, index) => {
                    const isSelected = themeMode === option.mode;
                    const isLast = index === themeOptions.length - 1;

                    return (
                        <TouchableOpacity
                            key={option.mode}
                            style={[
                                styles.themeRow,
                                !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border },
                            ]}
                            onPress={() => setThemeMode(option.mode)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.themeLabelContainer}>
                                <Ionicons
                                    name={option.icon}
                                    size={22}
                                    color={isSelected ? colors.primary : colors.secondary}
                                />
                                <Text style={[styles.themeLabel, { color: colors.text }]}>
                                    {option.label}
                                </Text>
                            </View>

                            {isSelected && (
                                <Ionicons
                                    name="checkmark-circle"
                                    size={22}
                                    color={colors.primary}
                                />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>

            <Text style={[styles.sectionTitle, { color: colors.secondary, marginTop: 24 }]}>
                DATA & STORAGE
            </Text>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Ionicons
                    name="document-text-outline"
                    size={30}
                    color={colors.primary}
                />

                <View style={styles.info}>
                    <Text style={[styles.title, { color: colors.secondary }]}>
                        Total Notes
                    </Text>

                    <Text style={[styles.value, { color: colors.text }]}>
                        {notes.length}
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.deleteButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={handleDeleteAll}
            >
                <Ionicons
                    name="trash-outline"
                    size={21}
                    color={colors.danger}
                />

                <Text style={[styles.deleteText, { color: colors.danger }]}>
                    Delete All Notes
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },

    sectionTitle: {
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 0.8,
        marginBottom: 8,
        marginLeft: 4,
    },

    sectionCard: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: "hidden",
    },

    themeRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 16,
    },

    themeLabelContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    themeLabel: {
        fontSize: 16,
        fontWeight: "500",
    },

    card: {
        borderRadius: 16,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
    },

    info: {
        marginLeft: 15,
    },

    title: {
        fontSize: 14,
    },

    value: {
        fontSize: 28,
        fontWeight: "800",
        marginTop: 2,
    },

    deleteButton: {
        marginTop: 20,
        borderRadius: 14,
        padding: 18,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
    },

    deleteText: {
        marginLeft: 10,
        fontWeight: "700",
    },
});