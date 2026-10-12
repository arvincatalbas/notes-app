import AsyncStorage from "@react-native-async-storage/async-storage";
import { Note } from "../types/note";

const NOTES_KEY = "@notes_app_notes";

export async function getNotes(): Promise<Note[]> {
    try {
        const data = await AsyncStorage.getItem(NOTES_KEY);

        if (!data) {
            return [];
        }

        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading notes:", error);
        return [];
    }
}

export async function saveNotes(notes: Note[]): Promise<void> {
    try {
        await AsyncStorage.setItem(
            NOTES_KEY,
            JSON.stringify(notes)
        );
    } catch (error) {
        console.error("Error saving notes:", error);
    }
}

export async function clearNotes(): Promise<void> {
    try {
        await AsyncStorage.removeItem(NOTES_KEY);
    } catch (error) {
        console.error("Error clearing notes:", error);
    }
}