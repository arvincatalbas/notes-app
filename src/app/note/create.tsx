import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import NoteInput from "../../components/NoteInput";
import CategoryChip from "../../components/CategoryChip";
import { categories } from "../../data/categories";
import { useNotes } from "../../hooks/useNotes";
import { useTheme } from "../../hooks/use-theme";

export default function CreateNoteScreen() {
    const { addNote } = useNotes();
    const { colors } = useTheme();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("Personal");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSave() {
        if (isSubmitting) return;

        if (!title.trim()) {
            Alert.alert(
                "Missing title",
                "Please enter a title."
            );
            return;
        }

        if (!content.trim()) {
            Alert.alert(
                "Missing content",
                "Please enter some content."
            );
            return;
        }

        setIsSubmitting(true);
        try {
            const now = new Date().toISOString();

            await addNote({
                id: Date.now().toString(),
                title: title.trim(),
                content: content.trim(),
                category,
                pinned: false,
                createdAt: now,
                updatedAt: now,
            });

            if (router.canGoBack()) {
                router.back();
            } else {
                router.replace("/");
            }
        } catch (error) {
            console.error("Failed to save note:", error);
            setIsSubmitting(false);
        }
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
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
                    styles.saveButton,
                    { backgroundColor: colors.primary },
                    isSubmitting && { opacity: 0.6 },
                ]}
                onPress={handleSave}
                disabled={isSubmitting}
            >
                <Ionicons
                    name="checkmark"
                    size={22}
                    color="#FFFFFF"
                />

                <Text style={styles.saveText}>
                    {isSubmitting ? "Saving..." : "Save Note"}
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

    saveButton: {
        height: 54,
        borderRadius: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },

    saveText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
        marginLeft: 8,
    },
});