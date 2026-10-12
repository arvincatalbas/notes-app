import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/use-theme";

type Props = {
    title: string;
    message: string;
};

export default function EmptyState({
    title,
    message,
}: Props) {
    const { colors } = useTheme();

    return (
        <View style={styles.conatiner}>
            <Ionicons
                name="document-text-outline"
                size={60}
                color={colors.secondary}
            />

            <Text style={[styles.title, { color: colors.text }]}>
                {title}
            </Text>

            <Text style={[styles.message, { color: colors.secondary }]}>
                {message}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    conatiner: {
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
    },

    title: {
        marginTop: 15,
        fontSize: 20,
        fontWeight: "700",
    },

    message: {
        marginTop: 8,
        textAlign: "center",
        fontSize: 14,
    },
});