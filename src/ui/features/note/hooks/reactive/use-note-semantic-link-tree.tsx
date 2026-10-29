import { useEffect, useRef, useState } from "react";
import { UiUtilsFacades } from "../../../../../_shared/ui-utils-facades";
import { AnyNoteDS, AnyNoteSemanticOutlinksKey, NoteId, NoteTreeCollection } from "../../../../../domain/note";
import { useSearchNoteTreeCollectionByRootNote } from "../../../../app-hooks/query/use-search-note";
import { useStore } from "../../../../context/use-context";

export function useNoteSemanticLinkTree(
    rootNoteId: NoteId,
    linkKey: AnyNoteSemanticOutlinksKey,
    direction: "outlink" | "inlink" = "inlink",
): NoteTreeCollection | undefined {
    const noteIndexStore = useStore().noteIndexStore;
    const search = useSearchNoteTreeCollectionByRootNote();

    const [notes, setNotes] = useState<NoteTreeCollection | undefined>(undefined);
    const notesRef = useRef<NoteTreeCollection | undefined>(undefined);

    const updateNotes = (next: NoteTreeCollection | undefined) => {
        notesRef.current = next;
        setNotes(next);
    };

    useEffect(() => {
        const getTree = (): NoteTreeCollection | undefined => {
            return search({
                rootNoteId,
                key: linkKey,
                depth: "infinity",
                direction,
            });
        }

        updateNotes(getTree());

        switch (direction) {
            case "inlink": {
                const unsubscribeChanged = noteIndexStore.subscribeInlinksChanged((id, key) => {
                    if (linkKey !== key) return;

                    if (notesRef.current?.ids.has(id)) {
                        updateNotes(getTree());
                    }
                });

                const unsubscribeDeleted = noteIndexStore.subscribeDeleted((note) => {
                    if (rootNoteId.equals(note.id)) {
                        // setNotes(undefined);
                        updateNotes(undefined);
                        return;
                    }

                    if (notesRef.current?.ids.has(note.id)) {
                        // setNotes(getTree());
                        updateNotes(getTree());
                    }
                })

                return () => {
                    unsubscribeChanged();
                    unsubscribeDeleted();
                }
            }
            case "outlink": {
                const unsubscribeChanged = noteIndexStore.subscribeChanged((note, oldNote) => {
                    if (!oldNote) {
                        return;
                    }
                    // if (notes && notes.ids.has(note.id)) {
                    if (notesRef.current?.ids.has(note.id)) {
                        const outlinks = AnyNoteDS.extractNoteSemanticOutlinks(note, linkKey);
                        const oldOutlinks = AnyNoteDS.extractNoteSemanticOutlinks(oldNote, linkKey);
                        if (outlinks === undefined && oldOutlinks === undefined) {
                            return;
                        }
                        if (outlinks && oldOutlinks && outlinks.equals(oldOutlinks)) {
                            return;
                        }

                        updateNotes(getTree());
                    }
                });
                const unsubscribeDeleted = noteIndexStore.subscribeDeleted((note) => {
                    if (rootNoteId.equals(note.id)) {
                        updateNotes(undefined);
                        return;
                    }

                    if (notesRef.current?.ids.has(note.id)) {
                        updateNotes(getTree());
                    }
                })
                return () => {
                    unsubscribeChanged();
                    unsubscribeDeleted();
                }
            }
            default: {
                UiUtilsFacades.alert("Unexpected process in useNoteSemanticLinkTree()");
                return;
            }
        }
    }, [rootNoteId, linkKey, direction, noteIndexStore, search]);

    return notes;
} 