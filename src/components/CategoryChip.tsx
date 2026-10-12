import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";
import { useTheme } from "../hooks/use-theme";

type Props = {
    label: string;
    selected?: boolean;
    onPress?: () => void;
};

export default function CategoryChip({
    label,
    selected = false,
    onPress,
}: Props) {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.container,
                { backgroundColor: colors.input },
                selected && { backgroundColor: colors.primary },
            ]}
        >
            <Text
                style={[
                    styles.text,
                    { color: colors.text },
                    selected && { color: colors.white, fontWeight: "600" },
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },

    text: {
        fontSize: 14,
    },
});