import React from "react";
import {
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/use-theme";

type Props = {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
};

export default function SearchBar({
    value,
    onChangeText,
    placeholder = "Search notes by title...",
}: Props) {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.input }]}>
            <Ionicons
                name="search-outline"
                size={22}
                color={colors.secondary}
            />

            <TextInput
                style={[styles.input, { color: colors.text }]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.secondary}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 48,
        marginBottom: 20,
    },

    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
});