import { Vault } from "obsidian";
import { Path } from "../../../../_shared/path.vo";

export async function createFile(
    path: Path,
    content: string,
    vault: Vault
) {
    const folderPath = path.parent;
    if (!folderPath) {
        await vault.create(path.value, content);
        return;
    }

    const existsFolder = vault.getFolderByPath(folderPath.value);
    if (!existsFolder) {
        await vault.createFolder(folderPath.value);
    }

    await vault.create(path.value, content);
}