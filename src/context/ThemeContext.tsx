import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme as useNativeColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../constants/colors";

export type ThemeMode = "light" | "dark" | "system";

export type ThemeColors = typeof Colors.light;

interface ThemeContextType {
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => Promise<void>;
    isDark: boolean;
    colors: ThemeColors;
}

const THEME_STORAGE_KEY = "@notes_app_theme_mode";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = useNativeColorScheme();
    const [themeMode, setThemeModeState] = useState<ThemeMode>("system");

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const storedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (storedMode === "light" || storedMode === "dark" || storedMode === "system") {
                    setThemeModeState(storedMode as ThemeMode);
                }
            } catch (e) {
                console.error("Failed to load theme preference", e);
            }
        };
        loadTheme();
    }, []);

    const setThemeMode = async (mode: ThemeMode) => {
        setThemeModeState(mode);
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
        } catch (e) {
            console.error("Failed to save theme preference", e);
        }
    };

    const isDark =
        themeMode === "dark" ||
        (themeMode === "system" && systemColorScheme === "dark");

    const colors = isDark ? Colors.dark : Colors.light;

    return (
        <ThemeContext.Provider
            value={{
                themeMode,
                setThemeMode,
                isDark,
                colors,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        return {
            themeMode: "system",
            setThemeMode: async () => {},
            isDark: false,
            colors: Colors.light,
        };
    }
    return context;
};
