// import { Listener, Unsubscribe } from "../../_shared/types";
// import { AnyNote, NotePath } from "../../domain/note";
// import { OrbizResolver } from "../orbiz-resolver.types";
// import { OpenedNoteStoreReader } from "./opened-note-store.types";
// import { RenamedFileInfo } from "./renamed-file-store.types";

// export class OpenedNoteStore implements OpenedNoteStoreReader {
//     private _notes = new Map<string, AnyNote>();
//     private _listeners = new Set<Listener>();
//     // new Set<(changedNotePath?: string) => void>();

//     constructor(private readonly _resolver: OrbizResolver) { }

//     get(path: string): AnyNote {
//         if (!this._notes.has(path)) {
//             const notePath = NotePath.from(path);
//             const note = this._resolver.getNote(notePath);
//             this._notes.set(path, note);
//         }

//         return this._notes.get(path)!;
//     }

//     find(path: string): AnyNote | undefined {
//         try {
//             return this.get(path);
//         } catch {
//             return undefined;
//         }
//     }

//     subscribe(listener: Listener): Unsubscribe {
//         this._listeners.add(listener);
//         return () => this._listeners.delete(listener);
//     }

//     syncOpenedPaths(paths: ReadonlySet<string>) {
//         // const openedPaths = new Set(paths);

//         let isChanged = false;
//         for (const path of this._notes.keys()) {
//             if (!paths.has(path)) {
//                 this._notes.delete(path);
//                 isChanged = true;
//             }
//         }

//         if (isChanged) {
//             this._notify();
//         }
//     }

//     updateNote(path: string, note: AnyNote) {
//         if (this._notes.has(path)) {
//             this._notes.set(path, note);
//             this._notify(path);
//         }
//     }

//     renameNote(renamed: RenamedFileInfo) {
//         if (this._notes.has(renamed.oldPath)) {
//             this._notes.delete(renamed.oldPath);
//             this._notify(renamed.oldPath);
//         }
//     }

//     private _notify(changedNotePath?: string) {
//         // this._listeners.forEach(l => l(changedNotePath));
//         this._listeners.forEach(l => l());
//     }
// }