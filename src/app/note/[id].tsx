import React from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { formatDateTime } from "../../utils/date";
import { useTheme } from "../../hooks/use-theme";
import { useNotes } from "../../hooks/useNotes";

export default function NoteDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { colors } = useTheme();
    const { notes, loading, togglePin, deleteNote } = useNotes();

    const note = notes.find((item) => item.id === id) || null;

    const lastNavRef = React.useRef(0);

    function handleEditNav() {
        if (!note) return;
        const now = Date.now();
        if (now - lastNavRef.current < 500) return;
        lastNavRef.current = now;
        router.push(`/note/edit/${note.id}`);
    }

    function handleDelete() {
        if (!note) return;

        Alert.alert(
            "Delete Note",
            "Are you sure you want to delete this note?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await deleteNote(note.id);
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace("/");
                        }
                    },
                },
            ]
        );
    }

    function handlePin() {
        if (!note) return;
        togglePin(note.id);
    }

    if (loading) {
        return (
            <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!note) {
        return (
            <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
                <View style={[styles.notFoundIconContainer, { backgroundColor: colors.input }]}>
                    <Ionicons
                        name="document-text-outline"
                        size={56}
                        color={colors.secondary}
                    />
                </View>
                <Text style={[styles.notFoundTitle, { color: colors.text }]}>
                    Note Not Found
                </Text>
                <Text style={[styles.notFoundMessage, { color: colors.secondary }]}>
                    This note may have been deleted or the link is invalid.
                </Text>
                <TouchableOpacity
                    style={[styles.backHomeButton, { backgroundColor: colors.primary }]}
                    onPress={() => router.replace("/")}
                    activeOpacity={0.8}
                >
                    <Ionicons name="home-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.backHomeText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
        >
            <View style={styles.header}>
                <View style={[styles.category, { backgroundColor: colors.badgeBg }]}>
                    <Text style={[styles.categoryText, { color: colors.badgeText }]}>
                        {note.category}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={handlePin}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    activeOpacity={0.6}
                >
                    <Ionicons
                        name={note.pinned ? "pin" : "pin-outline"}
                        size={25}
                        color={colors.primary}
                    />
                </TouchableOpacity>
            </View>

            <Text style={[styles.title, { color: colors.text }]}>
                {note.title}
            </Text>

            <Text style={[styles.date, { color: colors.secondary }]}>
                Updated {formatDateTime(note.updatedAt)}
            </Text>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <Text style={[styles.contentText, { color: colors.text }]}>
                {note.content}
            </Text>

            <View style={styles.buttons}>
                <TouchableOpacity
                    style={[styles.editButton, { backgroundColor: colors.primary }]}
                    onPress={handleEditNav}
                >
                    <Ionicons name="create-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.deleteButton, { backgroundColor: colors.danger }]}
                    onPress={handleDelete}
                >
                    <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    content: {
        padding: 20,
        paddingBottom: 40,
    },

    centerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },

    notFoundIconContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },

    notFoundTitle: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 8,
    },

    notFoundMessage: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 24,
    },

    backHomeButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },

    backHomeText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 15,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    category: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },

    categoryText: {
        fontWeight: "600",
    },

    title: {
        marginTop: 20,
        fontSize: 30,
        lineHeight: 38,
        fontWeight: "800",
    },

    date: {
        marginTop: 8,
        fontSize: 13,
    },

    divider: {
        height: 1,
        marginVertical: 24,
    },

    contentText: {
        fontSize: 17,
        lineHeight: 28,
    },

    buttons: {
        flexDirection: "row",
        gap: 12,
        marginTop: 40,
    },

    editButton: {
        flex: 1,
        height: 52,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    deleteButton: {
        flex: 1,
        height: 52,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    buttonText: {
        color: "#FFFFFF",
        fontWeight: "700",
        marginLeft: 8,
    },
});