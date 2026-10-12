import React, { useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import NoteCard from "../components/NoteCard";
import EmptyState from "../components/EmptyState";
import { useNotes } from "../hooks/useNotes";
import { useTheme } from "../hooks/use-theme";

export default function PinnedScreen() {
    const { notes, togglePin, deleteMultipleNotes, togglePinMultiple } = useNotes();
    const { colors } = useTheme();

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const isSelectionMode = selectedIds.length > 0;

    const pinnedNotes = notes.filter((note) => note.pinned);

    function handleLongPress(id: string) {
        if (selectedIds.includes(id)) {
            const next = selectedIds.filter((item) => item !== id);
            setSelectedIds(next);
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    }

    function handleSelectAll() {
        const allIds = pinnedNotes.map((n) => n.id);
        if (selectedIds.length === allIds.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(allIds);
        }
    }

    function handleBatchDelete() {
        Alert.alert(
            "Delete Notes",
            `Are you sure you want to delete ${selectedIds.length} selected note(s)?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await deleteMultipleNotes(selectedIds);
                        setSelectedIds([]);
                    },
                },
            ]
        );
    }

    function handleBatchUnpin() {
        togglePinMultiple(selectedIds, false);
        setSelectedIds([]);
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {isSelectionMode && (
                <View style={[styles.selectionBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.selectionLeft}>
                        <TouchableOpacity
                            style={styles.selectionCloseButton}
                            onPress={() => setSelectedIds([])}
                        >
                            <Ionicons name="close" size={24} color={colors.text} />
                        </TouchableOpacity>

                        <Text style={[styles.selectionTitle, { color: colors.text }]}>
                            {selectedIds.length} Selected
                        </Text>
                    </View>

                    <View style={styles.selectionActions}>
                        <TouchableOpacity onPress={handleSelectAll} style={styles.selectionActionButton}>
                            <Ionicons
                                name={selectedIds.length === pinnedNotes.length ? "checkbox" : "square-outline"}
                                size={22}
                                color={colors.primary}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleBatchUnpin} style={styles.selectionActionButton}>
                            <Ionicons name="pin" size={22} color={colors.primary} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleBatchDelete} style={styles.selectionActionButton}>
                            <Ionicons name="trash-outline" size={22} color={colors.danger} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {pinnedNotes.length === 0 ? (
                <EmptyState
                    title="No pinned notes"
                    message="Pin important notes to find them quickly."
                />
            ) : (
                <FlatList
                    data={pinnedNotes}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <NoteCard
                            note={item}
                            onPress={() => {
                                if (isSelectionMode) {
                                    handleLongPress(item.id);
                                } else {
                                    router.push(`/note/${item.id}`);
                                }
                            }}
                            onPin={() => togglePin(item.id)}
                            onLongPress={() => handleLongPress(item.id)}
                            isSelectionMode={isSelectionMode}
                            isSelected={selectedIds.includes(item.id)}
                        />
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },

    selectionBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 20,
    },

    selectionLeft: {
        flexDirection: "row",
        alignItems: "center",
    },

    selectionCloseButton: {
        marginRight: 12,
        padding: 4,
    },

    selectionTitle: {
        fontSize: 16,
        fontWeight: "700",
    },

    selectionActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    selectionActionButton: {
        padding: 6,
    },
});