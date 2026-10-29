// import { Listener, Unsubscribe } from "../../_shared/types";
// import { DRecord, DRecordPath } from "../../domain/note-sub/d-record";
// import { OrbizResolver } from "../orbiz-resolver.types";
// import { OpenedDRecordStoreReader } from "./opened-d-record-store.types";

// export class OpenedDRecordStore implements OpenedDRecordStoreReader {
//     private _dRecords = new Map<string, DRecord>();
//     private _listeners = new Set<Listener>();

//     constructor(private readonly _resolver: OrbizResolver) { }

//     get(path: string): DRecord {
//         if (!this._dRecords.has(path)) {
//             const dPath = DRecordPath.from(path);
//             const d = this._resolver.getDRecord(dPath);
//             this._dRecords.set(path, d);
//         }

//         return this._dRecords.get(path)!;
//     }
//     find(path: string): DRecord | undefined {
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
//         for (const path of this._dRecords.keys()) {
//             if (!paths.has(path)) {
//                 this._dRecords.delete(path);
//                 isChanged = true;
//             }
//         }

//         if (isChanged) {
//             this._notify();
//         }
//     }

//     updateDRecord(path: string, dRecord: DRecord) {
//         if (this._dRecords.has(path)) {
//             this._dRecords.set(path, dRecord);
//             this._notify();
//         }
//     }

//     private _notify() {
//         this._listeners.forEach(l => l());
//     }
// }