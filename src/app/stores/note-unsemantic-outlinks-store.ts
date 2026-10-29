import { Unsubscribe } from "../../_shared/types";
import { AnyNote, AnyNoteDS, NoteId, NoteIdList } from "../../domain/note";
import { NoteIndexStore } from "./note-index-store";
import { HandleUnsemanticOutlinksChanged, NoteUnsemanticOutlinksStoreReader } from "./note-unsemantic-outlinks-store.types";

// TODO: とりあえずこの形で実装するが、最終的にはNoteIndexStoreに統合して、プラグイン立ち上げ時に全走査する。
// インターフェースは分けて、修正の影響が少なく出るようにする。情報はObsidianのメタデータキャッシュで完結する。
export class NoteUnsemanticOutlinksStore implements NoteUnsemanticOutlinksStoreReader {
    private readonly _listeners: Set<HandleUnsemanticOutlinksChanged> = new Set();
    private readonly _memo: Map<string, NoteIdList> = new Map();

    constructor(private readonly _noteIndexStore: NoteIndexStore) { }


    find(noteId: NoteId | string): NoteIdList | undefined {
        return this._memo.get(noteId.toString())
    }

    subscribe(listener: HandleUnsemanticOutlinksChanged): Unsubscribe {
        this._listeners.add(listener);
        return () => this._listeners.delete(listener);
    }

    update(note: AnyNote, outLinkPaths: string[]) {
        const semanticOutlinks = AnyNoteDS.extractNoteSemanticOutlinks(note);

        const outlinkNoteIds = NoteIdList.fromStringArray(
            outLinkPaths
                .map(path => {
                    return this._noteIndexStore.findIdByPath(path);
                })
                .filter(id => id !== undefined)
        )

        if (!semanticOutlinks) {
            this._memo.set(note.id.value, outlinkNoteIds);
            this._notify(note.id, outlinkNoteIds);
            return;
        }

        if (!semanticOutlinks.contains(outlinkNoteIds)) {
            const unsemanticOutlinks = outlinkNoteIds.remove(semanticOutlinks);
            this._memo.set(note.id.value, unsemanticOutlinks);
            this._notify(note.id, unsemanticOutlinks);
        }
    }

    private _notify(noteId: NoteId, unsemanticOutlinks: NoteIdList | undefined): void {
        this._listeners.forEach(l => l(noteId, unsemanticOutlinks));
    }
}