import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import SearchBar from "../components/SearchBar";
import NoteCard from "../components/NoteCard";
import EmptyState from "../components/EmptyState";
import { useNotes } from "../hooks/useNotes";
import { useTheme } from "../hooks/use-theme";

export default function Homescreen() {
    const { notes, loading, togglePin, deleteMultipleNotes, togglePinMultiple } = useNotes();
    const { colors } = useTheme();

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const isSelectionMode = selectedIds.length > 0;

    const pinnedNotes = notes.filter((note) => note.pinned);
    const recentNotes = notes.slice(0, 10);

    function handleLongPress(id: string) {
        if (selectedIds.includes(id)) {
            const next = selectedIds.filter((item) => item !== id);
            setSelectedIds(next);
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    }

    function handleSelectAll() {
        const allIds = recentNotes.map((n) => n.id);
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

    function handleBatchPin() {
        const selectedNotes = notes.filter((n) => selectedIds.includes(n.id));
        const allPinned = selectedNotes.every((n) => n.pinned);
        togglePinMultiple(selectedIds, !allPinned);
        setSelectedIds([]);
    }

    if (loading) {
        return (
            <View style={[styles.loading, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
            {isSelectionMode ? (
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
                                name={selectedIds.length === recentNotes.length ? "checkbox" : "square-outline"}
                                size={22}
                                color={colors.primary}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleBatchPin} style={styles.selectionActionButton}>
                            <Ionicons name="pin-outline" size={22} color={colors.primary} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleBatchDelete} style={styles.selectionActionButton}>
                            <Ionicons name="trash-outline" size={22} color={colors.danger} />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <>
                    <View style={styles.header}>
                        <View>
                            <Text style={[styles.smallTitle, { color: colors.primary }]}>
                                Note Pad
                            </Text>

                            <Text style={[styles.title, { color: colors.text }]}>
                                Create Notes
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.settingsButton,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ]}
                            onPress={() => router.push("/settings")}
                        >
                            <Ionicons
                                name="settings-outline"
                                size={23}
                                color={colors.text}
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => router.push("/search")}
                    >
                        <View pointerEvents="none">
                            <SearchBar
                                value=""
                                onChangeText={() => {}}
                                placeholder="Tap to search Notes..."
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ]}
                            onPress={() => router.push("/pinned")}
                        >
                            <Ionicons
                                name="pin-outline"
                                size={20}
                                color={colors.primary}
                            />

                            <Text style={[styles.actionText, { color: colors.text }]}>
                                Pinned ({pinnedNotes.length})
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ]}
                            onPress={() => router.push("/note/create")}
                        >
                            <Ionicons
                                name="add"
                                size={22}
                                color={colors.primary}
                            />

                            <Text style={[styles.actionText, { color: colors.text }]}>
                                New Note
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}

            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Recent Note
            </Text>

            {recentNotes.length === 0 ? (
                <EmptyState
                    title="No notes yet"
                    message="Create your first note to get started."
                />
            ) : (
                <FlatList
                    data={recentNotes}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 40,
                    }}
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },

    loading: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },

    smallTitle: {
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1,
    },

    title: {
        fontSize: 32,
        fontWeight: "800",
        marginTop: 2,
    },

    settingsButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
    },

    actions: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 25,
    },

    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: 1,
    },

    actionText: {
        marginLeft: 6,
        fontWeight: "600",
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 14,
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