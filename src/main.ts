import { Plugin } from 'obsidian';
import { initializeOrbiz } from './_bootstrap/initialize-orbiz';


export default class OrbizPlugin extends Plugin {
	async onload() {
		if (!this.app.workspace.layoutReady) {
			this.app.workspace.onLayoutReady(async () => {
				await initializeOrbiz(this);
			});
		} else {
			await initializeOrbiz(this);
		}
	}

	onunload() {
		// クローズ処理（modified-note書き込みなど）
	}

}
