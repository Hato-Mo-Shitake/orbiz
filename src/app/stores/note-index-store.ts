import { IssueError } from "../../_shared/error";
import { Commit, Listener, Unsubscribe } from "../../_shared/types";
import { extractBaseNameFromPath } from "../../_shared/utils";
import { AnyNote, AnyNoteDS, AnyNoteSemanticOutlinksKey, anyNoteSemanticOutlinksKeys, Note, NoteId, NoteIdList, NoteKind, NoteName, NoteNameList, NoteTag, NoteTagList } from "../../domain/note";
import { IndexNoteListType, ListenerInlinksChanged, NoteIndex, NoteIndexStoreReader, NoteListMap, NoteNameIndex, NoteNameListByKindMap, NoteRegistry, NoteSemanticInlinksRecord, NoteSource, NoteTagIndex, ReadonlyNoteSource } from "./note-index-store.types";


export class NoteIndexStore implements NoteIndexStoreReader {
    private readonly _listeners: Set<Listener> = new Set();
    private readonly _listenersInlinksChanged: Set<ListenerInlinksChanged> = new Set();

    private readonly _listenersChanged: Set<(note: AnyNote, oldNote?: AnyNote) => void> = new Set();
    private readonly _listenersDeleted: Set<(note: AnyNote) => void> = new Set();

    private readonly _registry: NoteRegistry;
    private readonly _nameIndex: NoteNameIndex;
    private readonly _tagIndex: NoteTagIndex;

    private _tagList: NoteTagList;
    private readonly _noteListMap: NoteListMap;
    private readonly _nameListByKindMap: NoteNameListByKindMap;

    constructor(
        initializedIndex: NoteIndex
    ) {
        this._registry = initializedIndex.registry;
        this._nameIndex = initializedIndex.nameIndex;
        this._tagIndex = initializedIndex.tagIndex;

        this._tagList = initializedIndex.tagList;
        this._noteListMap = initializedIndex.noteListMap;
        this._nameListByKindMap = initializedIndex.nameListByKindMap;
    }

    getNoteList(type: IndexNoteListType): NoteIdList {
        return this._noteListMap[type];
    }

    getNameListByKind(kind: NoteKind): NoteNameList {
        return this._nameListByKindMap[kind];
    }

    findSource(id: string | NoteId): ReadonlyNoteSource | undefined {
        return this._findSource(id);
    }
    private _findSource(id: string | NoteId): NoteSource | undefined {
        const idString = id instanceof NoteId ? id.toString() : id;
        return this._registry.get(idString);
    }

    getSource(id: string | NoteId): ReadonlyNoteSource {
        return this._getSource(id);
    }
    private _getSource(id: string | NoteId): NoteSource {
        const idString = id instanceof NoteId ? id.toString() : id;
        const source = this._findSource(id);

        if (!source) {
            throw new IssueError({
                title: "NoteStore Error",
                layer: "app",
                location: "NoteStore.getSource()",
                message: `Not found source, id: ${idString}`
            });
        }

        return source;
    }

    findName(id: string | NoteId): string | undefined {
        const path = this.findSource(id)?.path;
        if (!path) return undefined;

        return extractBaseNameFromPath(path);
    }
    getName(id: string | NoteId): string {
        const path = this.getSource(id).path;
        return extractBaseNameFromPath(path);
    }

    findIdByPath(path: string): string | undefined {
        try {
            return this.getIdByPath(path);
        } catch {
            return undefined;
        }
    }
    getIdByPath(path: string): string {
        const name = extractBaseNameFromPath(path);
        const id = this.getIdByName(name);
        const source = this.getSource(id);
        if (path !== source.path) {
            throw new IssueError({
                title: "NoteStore Error",
                layer: "app",
                location: "NoteStore.getIdByPath()",
                message: `not equals path, arg's ${path} !== source's ${source.path}`
            });
        }

        return id
    }

    findPath(id: string | NoteId): string | undefined {
        const path = this.findSource(id)?.path;
        if (!path) return undefined;
        return path;
    }
    getPath(id: string | NoteId): string {
        return this.getSource(id).path;
    }

    findInlinks(id: string | NoteId): Readonly<NoteSemanticInlinksRecord> | undefined {
        const inlinks = this.findSource(id)?.inlinkNoteIds;
        if (!inlinks) return undefined;
        return inlinks;
    }
    getInlinks(id: string | NoteId): Readonly<NoteSemanticInlinksRecord> {
        return this.getSource(id).inlinkNoteIds;
    }

    findIdsByTag(tag: string | NoteTag): NoteIdList | undefined {
        const tagName = tag instanceof NoteTag ? tag.toString() : tag;
        return this._tagIndex.get(tagName);
    }

    getIdsByTag(tag: string | NoteTag): NoteIdList {
        const tagName = tag instanceof NoteTag ? tag.toString() : tag;

        const idSet = this.findIdsByTag(tag);
        if (!idSet) {
            throw new IssueError({
                title: "NoteStore Error",
                layer: "app",
                location: "NoteStore.getIdsByTag()",
                message: `
                Not found ids in tag index, tag: ${tagName}
                `
            });
        }
        return idSet;
    }
    getTagList(): NoteTagList {
        return this._tagList;
    }

    findIdByName(name: string | NoteName): string | undefined {
        const nameString = name instanceof NoteName ? name.toString() : name;
        return this._nameIndex.get(nameString);
    }

    getIdByName(name: string | NoteName): string {
        const nameString = name instanceof NoteName ? name.toString() : name;

        const id = this.findIdByName(nameString)
        if (!id) {
            throw new IssueError({
                title: "NoteStore Error",
                layer: "app",
                location: "NoteStore.getIdsByTag()",
                message: `
                Not found id in name index, name: ${nameString}
                `
            });
        }
        return id;
    }

    // 余裕があればupsertMetadataとupsertCoreDataに分けてもいいかも。
    createCommitUpsertNote(newNote: AnyNote, oldNote?: AnyNote): Commit {
        const commitStack: Commit[] = [];

        if (oldNote && !newNote.id.equals(oldNote.id)) {
            throw new IssueError({
                title: "NoteStore Error",
                layer: "app",
                location: "NoteStore.updateNote()",
                message: `
                    new note not equals old note, 
                    new note path: ${newNote.path.toString()},
                    old note path: ${oldNote.path.toString()}
                `
            });
        }

        const oldNoteSource = oldNote
            ? this._validateNoteSource(oldNote) : undefined;
        // if (oldNote) {
        //     const oldNoteSource = this._validateNoteSource(oldNote);
        //     // const oldNoteSource = this._getSource(newNote.id);
        // }

        // // これ、新規作成のノートの時も、古いソースがある前提で動いてる？？？
        // const oldNoteSource = this._getSource(newNote.id);

        const newPath = newNote.path.toString();
        const oldPath = oldNote?.path.toString();

        const newVersion = newNote.entryVersion;
        if (oldNote) {
            const oldVersion = oldNote.entryVersion;
            if (newVersion !== oldVersion + 1) {
                throw new IssueError({
                    title: "NoteStore Error",
                    layer: "app",
                    location: "NoteStore.updateNote()",
                    message: `
                new and old versions are not consecutive, 
                source version: ${oldVersion}, 
                new version: ${newVersion},
                target path: ${oldPath} -> ${newPath}. 
                `
                });
            }
        } else {
            if (newVersion !== 1) {
                throw new IssueError({
                    title: "NoteStore Error",
                    layer: "app",
                    location: "NoteStore.updateNote()",
                    message: `
                    new note version is not 1, 
                    version: ${newVersion}, 
                `
                });
            }
        }

        commitStack.push(() => {
            if (oldNoteSource) {
                this._registry.set(newNote.id.toString(), {
                    ...oldNoteSource,
                    path: newPath,
                    entryVersion: newVersion,
                });
            } else {
                // これ、以下の処理がsource前提だとまずいが、、。
                // でも、なさそう？
                const emptyNoteIds = NoteIdList.empty();
                this._registry.set(newNote.id.toString(), {
                    id: newNote.id.value,
                    path: newPath,
                    entryVersion: newVersion,
                    inlinkNoteIds: {
                        belongsTo: emptyNoteIds,
                        references: emptyNoteIds,
                        creators: emptyNoteIds,
                        // やばい
                        // belongsTo: newNote.belongsTo,
                        // references: newNote.references,
                        // creators: ("creators" in newNote) ? newNote.creators : emptyNoteIds,
                    }
                });
            }
        });

        commitStack.push(
            // this._upsertInlinkNoteIds(newNote, oldNote)
            this._upsertInlinkNoteIds({ newNote, oldNote })
        );
        commitStack.push(
            this._upsertNoteTagIndex({ newNote, oldNote })
        );
        commitStack.push(
            this._upsertNoteNameIndex({ newNote, oldNote })
        );
        commitStack.push(
            this._upsertNoteList({ newNote, oldNote })
        );

        return () => {
            commitStack.forEach(c => c());
            this._notify();
            this._notifyChanged(newNote, oldNote);
        }
    }

    createCommitDeleteNote(note: AnyNote): Commit {
        const commitStack: Commit[] = [];
        this._validateNoteSource(note);

        commitStack.push(
            this._upsertNoteNameIndex({ oldNote: note })
        );

        commitStack.push(
            this._upsertNoteTagIndex({ oldNote: note })
        );

        commitStack.push(
            this._upsertInlinkNoteIds({ oldNote: note })
            // this._deleteInlinkNoteIds(note)
        );
        commitStack.push(
            this._upsertNoteList({ oldNote: note })
        );

        commitStack.push(() => {
            this._registry.delete(note.id.toString());

        });

        return () => {
            commitStack.forEach(c => c());
            this._notify();
            this._notifyDeleted(note);
        }
    }

    subscribe(listener: Listener): Unsubscribe {
        this._listeners.add(listener);
        return () => this._listeners.delete(listener);
    }
    subscribeChanged(listener: (note: AnyNote, oldNote?: AnyNote) => void): Unsubscribe {
        this._listenersChanged.add(listener);
        return () => this._listenersChanged.delete(listener);
    }
    subscribeDeleted(listener: (note: AnyNote) => void): Unsubscribe {
        this._listenersDeleted.add(listener);
        return () => this._listenersDeleted.delete(listener);
    }
    subscribeInlinksChanged(listener: ListenerInlinksChanged): Unsubscribe {
        this._listenersInlinksChanged.add(listener);
        return () => this._listenersInlinksChanged.delete(listener);
    }

    private _notify() {
        this._listeners.forEach(l => l());
    }
    private _notifyInlinksChanged(id: NoteId, key: AnyNoteSemanticOutlinksKey, inlinks: NoteIdList) {
        this._listenersInlinksChanged.forEach(l => l(id, key, inlinks));
    }
    private _notifyChanged(note: AnyNote, oldNote?: AnyNote) {
        this._listenersChanged.forEach(l => l(note, oldNote))
    }
    private _notifyDeleted(note: AnyNote) {
        this._listenersDeleted.forEach(l => l(note));
    }

    private _upsertNoteList(params: {
        newNote?: AnyNote,
        oldNote?: AnyNote,
    }): Commit {
        const { newNote, oldNote } = params;
        const commitStack: Commit[] = [];

        // Top
        commitStack.push(
            this._upsertNoteMembershipList({
                newNote,
                oldNote,
                currentList: this._noteListMap["topNote"],
                setNextList: list => { this._noteListMap["topNote"] = list; },
                qualifies: note => note.isTop(),
            })
        );

        // unresolved
        commitStack.push(
            this._upsertNoteMembershipList({
                newNote,
                oldNote,
                currentList: this._noteListMap["unresolved"],
                setNextList: list => { this._noteListMap["unresolved"] = list; },
                qualifies: note => {
                    if (AnyNoteDS.hasResolvedAt(note)) {
                        return note.isUnresolved()
                    } else {
                        return false;
                    }
                }
            })
        );

        return () => {
            for (const c of commitStack) {
                c();
            }
        }
    }

    private _upsertNoteMembershipList(params: {
        newNote: AnyNote | undefined,
        oldNote: AnyNote | undefined,
        currentList: NoteIdList,
        setNextList: (list: NoteIdList) => void,
        qualifies: (note: AnyNote) => boolean,
    }): Commit {
        const { newNote, oldNote, currentList, setNextList, qualifies } = params;

        if (!newNote && !oldNote) {
            throw new Error("Unexpected Error: NoteIndexStore");
        }

        const rootNoteId = (
            newNote?.id ?? oldNote?.id
        )!;

        const wasIncluded = oldNote ? qualifies(oldNote) : false;
        const isIncluded = newNote ? qualifies(newNote) : false;

        if (wasIncluded === isIncluded) {
            return () => { };
        }

        return () => {
            let nextList = currentList;

            if (isIncluded) {
                nextList = nextList.add(rootNoteId);
            } else {
                nextList = nextList.remove(rootNoteId)
            }

            setNextList(nextList);
        };
    }

    private _upsertInlinkNoteIds(params: {
        newNote?: AnyNote,
        oldNote?: AnyNote,
    }): Commit {
        const { newNote, oldNote } = params;

        if (!newNote && !oldNote) {
            throw new Error("Unexpected Error NoteIndexStore: Both newNote and oldNote are undefined.");
        }
        const rootId = (
            newNote?.id ?? oldNote!.id
        );

        const newOutlinksMap = newNote
            ? AnyNoteDS.extractNoteSemanticOutlinksMap(newNote)
            : null;

        const oldOutlinksMap = oldNote
            ? AnyNoteDS.extractNoteSemanticOutlinksMap(oldNote)
            : null;

        const commitStack: Commit[] = [];

        const scheduleSourceUpdate = (
            outlinkId: NoteId,
            key: AnyNoteSemanticOutlinksKey,
            operation: "add" | "remove",
        ): void => {
            const outlinkIdString = outlinkId.toString();

            // NOTE: ArchiveNoteなどを追加して、noteIndex外のIdがここに来るようになった場合は、findSource()して分岐処理
            const source = this.getSource(outlinkId);

            if (operation === "remove") {
                this._validateOutlinkSourceHasRootId(
                    source,
                    rootId,
                    key,
                );
            }

            commitStack.push(() => {
                // 直前の commit で同じ Source が更新されている可能性があるため、
                // 実行時点の最新 Source からコピーする。
                const currentSource = this._getSource(outlinkId);
                let nextIds = currentSource.inlinkNoteIds[key];

                if (operation === "add") {
                    nextIds = nextIds.add(rootId);
                } else {
                    nextIds = nextIds.remove(rootId);
                }

                this._registry.set(outlinkIdString, {
                    ...currentSource,
                    inlinkNoteIds: {
                        ...currentSource.inlinkNoteIds,
                        [key]: nextIds,
                    },
                });
                this._notifyInlinksChanged(outlinkId, key, nextIds);
            });
        };

        for (const key of anyNoteSemanticOutlinksKeys) {
            const oldOutlinks =
                oldOutlinksMap?.[key] ?? NoteIdList.empty();
            const newOutlinks =
                newOutlinksMap?.[key] ?? NoteIdList.empty();

            const removeIds = oldOutlinks.remove(newOutlinks);
            const addIds = newOutlinks.remove(oldOutlinks);

            for (const outlinkId of removeIds) {
                scheduleSourceUpdate(outlinkId, key, "remove");
            }

            for (const outlinkId of addIds) {
                scheduleSourceUpdate(outlinkId, key, "add");
            }
        }

        return () => {
            commitStack.forEach(c => c());
        };
    }

    private _upsertNoteTagIndex(params: {
        newNote?: AnyNote,
        oldNote?: AnyNote,
    }): Commit {
        const { newNote, oldNote } = params;
        if (!newNote && !oldNote) {
            throw new Error("Unexpected Error NoteIndexStore: Both newNote and oldNote are undefined.");
        }

        const rootNoteId = newNote?.id ?? oldNote!.id;

        const newTags = newNote?.tags ?? NoteTagList.empty();
        const oldTags = oldNote?.tags ?? NoteTagList.empty();

        const removeTags = oldTags.remove(newTags);
        const addTags = newTags.remove(oldTags);
        const commitStack: Commit[] = [];

        for (const tag of removeTags) {
            const tagName = tag.toString();
            const idsByTag = this.getIdsByTag(tagName);
            this._validateNoteTagIndex(idsByTag, tagName, rootNoteId);

            commitStack.push(() => {
                const currentIds = this._tagIndex.get(tagName);
                if (!currentIds) return;

                let nextIds = currentIds;
                nextIds = nextIds.remove(rootNoteId);

                let nextTagList = this._tagList;

                if (nextIds.length === 0) {
                    this._tagIndex.delete(tagName);
                    nextTagList = nextTagList.remove(tag);
                } else {
                    this._tagIndex.set(tagName, nextIds);
                }

                this._tagList = nextTagList;
            });
        }

        for (const tag of addTags) {
            const tagName = tag.toString();

            commitStack.push(() => {
                let nextIds = this._tagIndex.get(tagName) || NoteIdList.empty();
                nextIds = nextIds.add(rootNoteId);

                this._tagIndex.set(tagName, nextIds);

                let nextTagList = this._tagList;
                nextTagList = nextTagList.add(tag);
                this._tagList = nextTagList;
            });
        }

        return () => {
            commitStack.forEach(c => c());
        };
    }

    private _upsertNoteNameIndex(params: {
        newNote?: AnyNote,
        oldNote?: AnyNote,
    }): Commit {
        const { newNote, oldNote } = params;

        if (!newNote && !oldNote) {
            throw new Error("Unexpected Error NoteIndexStore: Both newNote and oldNote are undefined.");
        }

        const rootNoteIdString = (
            newNote?.id ?? oldNote!.id
        ).toString();

        const newName = newNote?.name;
        const oldName = oldNote?.name;

        if (oldNote && oldName !== undefined) {
            this._validateNoteNameIndex(rootNoteIdString, oldName.toString());
        }

        if (newNote && newName !== undefined) {
            const existingId = this._nameIndex.get(newName.toString());

            if (existingId !== undefined && existingId !== rootNoteIdString) {
                throw new IssueError({
                    title: "NoteStore Error",
                    layer: "app",
                    location: "NoteIndexStore._upsertNoteNameIndex()",
                    message: `Note name already exists: ${newName.value}`,
                });
            }
        }

        const isUnchanged =
            newNote !== undefined &&
            oldNote !== undefined &&
            newName === oldName &&
            newNote.kind === oldNote.kind;

        if (isUnchanged) {
            return () => { };
        }

        return () => {
            if (oldName !== undefined && oldName !== newName) {
                this._nameIndex.delete(oldName.toString());
            }

            if (newName !== undefined && oldName !== newName) {
                this._nameIndex.set(newName.toString(), rootNoteIdString);
            }

            if (oldNote && oldName !== undefined) {
                let nextKindNames = this._nameListByKindMap[oldNote.kind];

                nextKindNames = nextKindNames.remove(oldName);

                if (newNote?.kind === oldNote.kind && newName) {
                    nextKindNames = nextKindNames.add(newName);
                }

                this._nameListByKindMap[oldNote.kind] = nextKindNames;
            }

            if (
                newNote &&
                newName !== undefined &&
                (!oldNote || newNote.kind !== oldNote.kind)
            ) {
                let nextKindNames = this._nameListByKindMap[newNote.kind];
                nextKindNames = nextKindNames.add(newName);
                this._nameListByKindMap[newNote.kind] = nextKindNames;
            }
        };
    }

    private _validateNoteTagIndex(idSetByTag: NoteIdList, tag: string, id: NoteId) {
        if (!idSetByTag.has(id)) {
            throw new IssueError({
                title: "NoteStore Error",
                layer: "app",
                location: "NoteStore._validateNoteTagIndex()",
                message: `
                note(${id.value}) has tag(${tag}),
                but id set in tag index has not root note id
                `,
                severity: "fatal",
            });
        }
    }

    private _validateNoteNameIndex(id: string, name: string) {
        const idByIndex = this._nameIndex.get(name);
        if (!idByIndex) {
            throw new IssueError({
                title: "NoteStore Error",
                layer: "app",
                location: "NoteStore._validateNameExistsInNoteNameIndex()",
                message: `
                Not found name in note name index, name: ${name}
                `,
                severity: "fatal",
            });
        }
        if (id !== idByIndex) {
            throw new IssueError({
                title: "NoteStore Error",
                layer: "app",
                location: "NoteStore._validateNameExistsInNoteNameIndex()",
                message: `
                id not equals note name index id, 
                name: ${name},
                id: ${id},
                id by name index: ${idByIndex}
                `,
                severity: "fatal",
            });
        }
    }

    private _validateOutlinkSourceHasRootId(
        outlinkSource: NoteSource,
        rootId: NoteId,
        key: AnyNoteSemanticOutlinksKey
    ) {
        if (!outlinkSource.inlinkNoteIds[key].has(rootId)) {
            throw new IssueError({
                title: "NoteStore Error",
                layer: "app",
                location: "NoteStore._validateOutlinkSourceHasRootId()",
                message: `
                    root note(${rootId.value}) out link to note(${outlinkSource.id}),
                    but outlink note source has not root note id in inlinks
                `,
                severity: "fatal",
            });
        }
    }

    private _validateNoteSource(note: Note): NoteSource {
        const noteSource = this.getSource(note.id);
        // if (!noteSource) {
        //     throw new IssueError({
        //         title: "NoteStore Error",
        //         layer: "app",
        //         location: "NoteStore._validateNoteSource()",
        //         message: `
        //             not found note source,
        //                 path: ${note.path.toString()}
        //                 `
        //     });
        // }

        const path = note.path.toString();
        if (path !== noteSource.path) {
            throw new IssueError({
                title: "NoteStore Error",
                layer: "app",
                location: "NoteStore._validateNoteSource()",
                message: `
                    not equals path,
                        arg'note path: ${path},
                    source'note path: ${noteSource.path}
                        `
            });
        }

        const version = note.entryVersion;
        if (version !== noteSource.entryVersion) {
            throw new IssueError({
                title: "NoteStore Error",
                layer: "app",
                location: "NoteStore._validateNoteSource()",
                message: `
                    not equals version,
                        arg'note path: ${version},
                    source'note path: ${noteSource.entryVersion}
                        `
            });
        }

        return noteSource;
    }
}