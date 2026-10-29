import { NoteIdList } from "../../note-id-list.vo";
import { MyNoteEntry } from "../my-note.types";
import { galleryNoteDateKeys, galleryNoteSemanticOutlinksKeys } from "./gallery-note.const";

export type GalleryNoteEntry = MyNoteEntry & Readonly<{
    kind: "gallery"
    creators: NoteIdList
}>

export type GalleryNoteDateKey = typeof galleryNoteDateKeys[number];
export type GalleryNoteSemanticOutLinksKey = typeof galleryNoteSemanticOutlinksKeys[number];
