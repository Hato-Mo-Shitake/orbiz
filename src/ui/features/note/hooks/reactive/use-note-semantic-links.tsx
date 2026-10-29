import { useCallback, useEffect, useState } from "react";
import { UiUtilsFacades } from "../../../../../_shared/ui-utils-facades";
import { AnyNoteDS, AnyNoteSemanticOutlinksKey, NoteCollection, NoteId } from "../../../../../domain/note";
import { useSearchNoteCollectionByLinkNote } from "../../../../app-hooks/query/use-search-note";
import { useStore } from "../../../../context/use-context";

export function useNoteSemanticLinks(
    rootNoteId: NoteId,
    linkKey: AnyNoteSemanticOutlinksKey,
    direction: "inlink" | "outlink"
): NoteCollection | undefined {
    const noteIndexStore = useStore().noteIndexStore;
    const search = useSearchNoteCollectionByLinkNote();
    const getCollection = useCallback(
        () => search({
            noteIds: rootNoteId,
            direction,
            inKeys: [linkKey],
        }),
        [search, rootNoteId, direction, linkKey],
    );

    // const [notes, setNotes] = useState<NoteCollection | undefined>(() => getCollection());
    const [notes, setNotes] = useState<NoteCollection | undefined>(undefined);

    useEffect(() => {
        // HACK: undefined -> このsetNotes() で無駄なレンダリングが発生する、、、、
        setNotes(getCollection());

        switch (direction) {
            case "inlink": {
                const unsubscribeChanged = noteIndexStore.subscribeInlinksChanged((id, key) => {
                    // NOTE: notesを依存配列に入れられないので、ここでnotesを使用すると、notesが変化して再レンダリングされるタイミングで前のnotesへの参照が、
                    // リスナーの中に残るので、notesに依存した処理は避ける。
                    // if (!notes || linkKey !== key) return;
                    if (linkKey !== key) return;

                    if (rootNoteId.equals(id)) {
                        setNotes(getCollection());
                    }
                });
                const unsubscribeDeleted = noteIndexStore.subscribeDeleted((note) => {
                    if (rootNoteId.equals(note.id)) {
                        setNotes(undefined);
                        return;
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
                    if (rootNoteId.equals(note.id)) {
                        const outlinks = AnyNoteDS.extractNoteSemanticOutlinks(note, linkKey);
                        const oldOutlinks = AnyNoteDS.extractNoteSemanticOutlinks(oldNote, linkKey);
                        if (outlinks === undefined && oldOutlinks === undefined) {
                            return;
                        }
                        if (outlinks && oldOutlinks && outlinks.equals(oldOutlinks)) {
                            return;
                        }

                        setNotes(getCollection());
                    }
                });
                const unsubscribeDeleted = noteIndexStore.subscribeDeleted((note) => {
                    if (rootNoteId.equals(note.id)) {
                        setNotes(undefined);
                        return;
                    }
                });
                return () => {
                    unsubscribeChanged();
                    unsubscribeDeleted();
                }

            }
            default: {
                UiUtilsFacades.alert("Unexpected process in useNoteSemanticLinks()");
                return;
            }
        }

    }, [rootNoteId, linkKey, direction, search, getCollection]);

    return notes;
}
