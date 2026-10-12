import React, { createContext, useCallback, useEffect, useState } from "react";
import { Note } from "../types/note";
import { clearNotes, getNotes, saveNotes } from "../services/storage";

interface NotesContextType {
    notes: Note[];
    loading: boolean;
    addNote: (note: Note) => Promise<void>;
    updateNote: (updatedNote: Note) => Promise<void>;
    deleteNote: (id: string) => Promise<void>;
    deleteMultipleNotes: (ids: string[]) => Promise<void>;
    togglePin: (id: string) => Promise<void>;
    togglePinMultiple: (ids: string[], targetPinState?: boolean) => Promise<void>;
    deleteAllNotes: () => Promise<void>;
}

export const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    const loadNotes = useCallback(async () => {
        try {
            const storedNotes = await getNotes();
            setNotes(storedNotes);
        } catch (error) {
            console.error("Error loading notes:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadNotes();
    }, [loadNotes]);

    const addNote = useCallback(async (note: Note) => {
        let updated: Note[] = [];
        setNotes((prevNotes) => {
            if (prevNotes.some((n) => n.id === note.id)) {
                updated = prevNotes;
                return prevNotes;
            }
            updated = [note, ...prevNotes];
            return updated;
        });
        await saveNotes(updated);
    }, []);

    const updateNote = useCallback(async (updatedNote: Note) => {
        let updated: Note[] = [];
        setNotes((prevNotes) => {
            updated = prevNotes.map((note) =>
                note.id === updatedNote.id ? updatedNote : note
            );
            return updated;
        });
        await saveNotes(updated);
    }, []);

    const deleteNote = useCallback(async (id: string) => {
        let updated: Note[] = [];
        setNotes((prevNotes) => {
            updated = prevNotes.filter((note) => note.id !== id);
            return updated;
        });
        await saveNotes(updated);
    }, []);

    const deleteMultipleNotes = useCallback(async (ids: string[]) => {
        const idSet = new Set(ids);
        let updated: Note[] = [];
        setNotes((prevNotes) => {
            updated = prevNotes.filter((note) => !idSet.has(note.id));
            return updated;
        });
        await saveNotes(updated);
    }, []);

    const togglePin = useCallback(async (id: string) => {
        let updated: Note[] = [];
        setNotes((prevNotes) => {
            updated = prevNotes.map((note) =>
                note.id === id
                    ? {
                        ...note,
                        pinned: !note.pinned,
                        updatedAt: new Date().toISOString(),
                    }
                    : note
            );
            return updated;
        });
        await saveNotes(updated);
    }, []);

    const togglePinMultiple = useCallback(async (ids: string[], targetPinState?: boolean) => {
        const idSet = new Set(ids);
        let updated: Note[] = [];
        setNotes((prevNotes) => {
            updated = prevNotes.map((note) => {
                if (idSet.has(note.id)) {
                    return {
                        ...note,
                        pinned: targetPinState !== undefined ? targetPinState : !note.pinned,
                        updatedAt: new Date().toISOString(),
                    };
                }
                return note;
            });
            return updated;
        });
        await saveNotes(updated);
    }, []);

    const deleteAllNotes = useCallback(async () => {
        setNotes([]);
        await clearNotes();
    }, []);

    return (
        <NotesContext.Provider
            value={{
                notes,
                loading,
                addNote,
                updateNote,
                deleteNote,
                deleteMultipleNotes,
                togglePin,
                togglePinMultiple,
                deleteAllNotes,
            }}
        >
            {children}
        </NotesContext.Provider>
    );
};
