import { myNoteDateKeys, myNoteSemanticOutlinksKeys } from "../my-note.const";
import { GalleryNoteDateKey, GalleryNoteSemanticOutLinksKey } from "./gallery-note.types";

export const galleryNoteUniqueDateKeys = [
] as const;
export const galleryNoteDateKeys = [
    ...myNoteDateKeys,
    ...galleryNoteUniqueDateKeys,
] as const;
export function isGalleryNoteDateKey(key: unknown): key is GalleryNoteDateKey {
    return galleryNoteDateKeys.includes(key as GalleryNoteDateKey);
}

export const galleryNoteUniqueSemanticOutlinksKeys = [
    "creators"
] as const;
export const galleryNoteSemanticOutlinksKeys = [
    ...myNoteSemanticOutlinksKeys,
    ...galleryNoteUniqueSemanticOutlinksKeys,
] as const;
export function isGalleryNoteSemanticOutlinksKey(key: unknown): key is GalleryNoteSemanticOutLinksKey {
    return galleryNoteSemanticOutlinksKeys.includes(key as GalleryNoteSemanticOutLinksKey);
}


