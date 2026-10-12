import React, { useEffect, useState } from "react";
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

import NoteInput from "../../../components/NoteInput";
import CategoryChip from "../../../components/CategoryChip";
import { categories } from "../../../data/categories";
import { Note } from "../../../types/note";
import { useTheme } from "../../../hooks/use-theme";
import { useNotes } from "../../../hooks/useNotes";

export default function EditNoteScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { colors } = useTheme();
    const { notes, loading, updateNote } = useNotes();

    const note = notes.find((item) => item.id === id) || null;

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("Personal");
    const [isInitialized, setIsInitialized] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (note && !isInitialized) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTitle(note.title);
            setContent(note.content);
            setCategory(note.category);
            setIsInitialized(true);
        }
    }, [note, isInitialized]);

    async function handleUpdate() {
        if (!note || isSubmitting) return;

        if (!title.trim()) {
            Alert.alert("Missing title", "Please enter a title.");
            return;
        }

        setIsSubmitting(true);
        try {
            const updatedNote: Note = {
                ...note,
                title: title.trim(),
                content: content.trim(),
                category,
                updatedAt: new Date().toISOString(),
            };

            await updateNote(updatedNote);
            if (router.canGoBack()) {
                router.back();
            } else {
                router.replace(`/note/${note.id}`);
            }
        } catch (error) {
            console.error("Failed to update note:", error);
            setIsSubmitting(false);
        }
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
                    <Ionicons name="document-text-outline" size={56} color={colors.secondary} />
                </View>
                <Text style={[styles.notFoundTitle, { color: colors.text }]}>
                    Note Not Found
                </Text>
                <Text style={[styles.notFoundMessage, { color: colors.secondary }]}>
                    The note you are trying to edit does not exist or has been removed.
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
            <NoteInput
                title={title}
                content={content}
                onTitleChange={setTitle}
                onContentChange={setContent}
            />

            <Text style={[styles.label, { color: colors.text }]}>
                Category
            </Text>

            <View style={styles.categories}>
                {categories.map((item) => (
                    <CategoryChip
                        key={item}
                        label={item}
                        selected={category === item}
                        onPress={() => setCategory(item)}
                    />
                ))}
            </View>

            <TouchableOpacity
                style={[
                    styles.button,
                    { backgroundColor: colors.primary },
                    isSubmitting && { opacity: 0.6 },
                ]}
                onPress={handleUpdate}
                disabled={isSubmitting}
            >
                <Text style={styles.buttonText}>
                    {isSubmitting ? "Updating..." : "Update Note"}
                </Text>
            </TouchableOpacity>
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

    label: {
        marginTop: 20,
        marginBottom: 10,
        fontSize: 15,
        fontWeight: "600",
    },

    categories: {
        flexDirection: "row",
        flexWrap: "wrap",
    },

    button: {
        height: 54,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
});