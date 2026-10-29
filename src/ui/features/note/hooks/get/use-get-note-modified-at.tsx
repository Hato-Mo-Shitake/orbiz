// import { useCallback } from "react";
// import { useStore } from "../../../../context/use-context";
// import { NoteId } from "../../../../note-domain";

// export const useGetNoteModifiedAt = () => {
//     const store = useStore().modifiedNoteHistoryStore;

//     return useCallback((id: NoteId | string) => {
//         return store.findModifiedAt(id);
//     }, [store])
// }