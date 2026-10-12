import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useTheme } from "../hooks/use-theme";

type Props = {
    title: string;
    content: string;
    onTitleChange: (text: string) => void;
    onContentChange: (text: string) => void;
};

export default function NoteInput({
    title,
    content,
    onTitleChange,
    onContentChange,
}: Props) {
    const { colors } = useTheme();

    return (
        <View>
            <Text style={[styles.label, { color: colors.text }]}>
                Title
            </Text>

            <TextInput
                style={[
                    styles.titleInput,
                    {
                        backgroundColor: colors.input,
                        color: colors.text,
                    },
                ]}
                value={title}
                onChangeText={onTitleChange}
                placeholder="Enter note title"
                placeholderTextColor={colors.secondary}
            />

            <Text style={[styles.label, { color: colors.text }]}>
                Content
            </Text>

            <TextInput
                style={[
                    styles.contentInput,
                    {
                        backgroundColor: colors.input,
                        color: colors.text,
                    },
                ]}
                value={content}
                onChangeText={onContentChange}
                placeholder="Write your note..."
                placeholderTextColor={colors.secondary}
                multiline
                textAlignVertical="top"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 8,
        marginTop: 10,
    },

    titleInput: {
        borderRadius: 12,
        paddingHorizontal: 14,
        height: 52,
        fontSize: 16,
    },

    contentInput: {
        borderRadius: 12,
        padding: 14,
        minHeight: 220,
        fontSize: 16,
        lineHeight: 24,
    },
});