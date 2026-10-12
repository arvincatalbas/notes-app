import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Note } from "../types/note";
import { formatDate } from "../utils/date";
import { useTheme } from "../hooks/use-theme";

type Props = {
    note: Note;
    onPress: () => void;
    onPin: () => void;
    onLongPress?: () => void;
    isSelectionMode?: boolean;
    isSelected?: boolean;
};

export default function NoteCard({
    note,
    onPress,
    onPin,
    onLongPress,
    isSelectionMode = false,
    isSelected = false,
}: Props) {
    const { colors } = useTheme();
    const lastPressRef = React.useRef(0);

    const handlePress = () => {
        const now = Date.now();
        if (now - lastPressRef.current < 500) {
            return;
        }
        lastPressRef.current = now;

        if (isSelectionMode && onLongPress) {
            onLongPress();
        } else {
            onPress();
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.card,
                {
                    backgroundColor: colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderWidth: isSelected ? 2 : 1,
                },
            ]}
            onPress={handlePress}
            onLongPress={onLongPress}
            delayLongPress={250}
            activeOpacity={0.8}
        >
            <View style={styles.cardRow}>
                {isSelectionMode && (
                    <View style={styles.checkboxContainer}>
                        <Ionicons
                            name={
                                isSelected
                                    ? "checkbox"
                                    : "square-outline"
                            }
                            size={24}
                            color={
                                isSelected
                                    ? colors.primary
                                    : colors.secondary
                            }
                        />
                    </View>
                )}

                <View style={styles.mainContent}>
                    <View style={styles.header}>
                        <Text
                            style={[styles.title, { color: colors.text }]}
                            numberOfLines={1}
                        >
                            {note.title}
                        </Text>

                        {!isSelectionMode && (
                            <TouchableOpacity
                                onPress={(e) => {
                                    e.stopPropagation();
                                    onPin();
                                }}
                                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                                activeOpacity={0.6}
                            >
                                <Ionicons
                                    name={
                                        note.pinned
                                            ? "pin"
                                            : "pin-outline"
                                    }
                                    size={20}
                                    color={
                                        note.pinned
                                            ? colors.primary
                                            : colors.secondary
                                    }
                                />
                            </TouchableOpacity>
                        )}
                    </View>

                    <Text
                        style={[styles.content, { color: colors.textLight }]}
                        numberOfLines={3}
                    >
                        {note.content}
                    </Text>

                    <View style={styles.footer}>
                        <View
                            style={[
                                styles.category,
                                { backgroundColor: colors.badgeBg },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    { color: colors.badgeText },
                                ]}
                            >
                                {note.category}
                            </Text>
                        </View>

                        <Text style={[styles.date, { color: colors.secondary }]}>
                            {formatDate(note.updatedAt)}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
    },

    cardRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    checkboxContainer: {
        marginRight: 12,
        justifyContent: "center",
        alignItems: "center",
    },

    mainContent: {
        flex: 1,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: "700",
        marginRight: 10,
    },

    content: {
        marginTop: 8,
        fontSize: 14,
        lineHeight: 21,
    },

    footer: {
        marginTop: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    category: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },

    categoryText: {
        fontSize: 12,
        fontWeight: "600",
    },

    date: {
        fontSize: 12,
    },
});