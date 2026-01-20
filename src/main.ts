import { Notice, Plugin, TFile } from 'obsidian';
import { extractFirstH1, titleToFilename } from './utils';

export default class TitleSyncPlugin extends Plugin {
	onload() {
		this.addCommand({
			id: 'sync-title-to-filename',
			name: 'Sync title to filename',
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				if (file && file.extension === 'md') {
					if (!checking) {
						void this.syncTitleToFilename(file);
					}
					return true;
				}
				return false;
			},
		});
	}

	async syncTitleToFilename(file: TFile) {
		try {
			const content = await this.app.vault.read(file);
			const title = extractFirstH1(content);

			if (!title) {
				new Notice('No H1 header found in the file');
				return;
			}

			const newFilename = titleToFilename(title);

			if (!newFilename) {
				new Notice('Title converts to empty filename');
				return;
			}

			const currentFilename = file.basename;

			if (newFilename === currentFilename) {
				new Notice('Filename already matches title');
				return;
			}

			const newPath = file.parent
				? `${file.parent.path}/${newFilename}.md`
				: `${newFilename}.md`;

			// Check if a file with the new name already exists
			const existingFile = this.app.vault.getAbstractFileByPath(newPath);
			if (existingFile) {
				new Notice(`Cannot rename: "${newFilename}.md" already exists`);
				return;
			}

			await this.app.fileManager.renameFile(file, newPath);
			new Notice(`Renamed to "${newFilename}.md"`);
		} catch (error) {
			console.error('Title Sync: Error syncing title to filename', error);
			new Notice('Error syncing title to filename');
		}
	}

	onunload() {
		// Nothing to clean up
	}
}
