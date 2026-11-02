import { Plugin } from 'obsidian';
import { loadOrbiz } from './_bootstrap/load-orbiz';

export type HandleUnload = () => Promise<void>;

export default class OrbizPlugin extends Plugin {

	private _unload: HandleUnload | undefined;

	async onload() {
		if (!this.app.workspace.layoutReady) {
			this.app.workspace.onLayoutReady(async () => {
				this._unload = await loadOrbiz(this);
			});
		} else {
			this._unload = await loadOrbiz(this);
		}
	}

	onunload() {
		// クローズ処理（modified-note書き込みなど）
		void this._unload?.()
	}
}
