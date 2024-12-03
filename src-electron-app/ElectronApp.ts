import { app, BrowserWindow, dialog, ipcMain } from "electron";

import { createMainWindow } from "./browserWindowHelper";

export class ElectronApp {
	private static instance: ElectronApp;
	private mainWindow: BrowserWindow | undefined;

	constructor() {
		this.mainWindow = createMainWindow();
	}

	static getInstance() {
		if (!ElectronApp.instance) {
			ElectronApp.instance = new ElectronApp();
		}
		return ElectronApp.instance;
	}

	get MainWindow() {
		return this.mainWindow;
	}

	async init() {
		try {
			ipcMain.on("close-app", this.closeMainWindow.bind(this));

			this.mainWindow?.once("ready-to-show", () => {
				this.mainWindow?.show();
			});
		} catch (e) {
			console.error("Electron App init:", e);
		}
	}

	private closeMainWindow(event: any) {
		if (process.platform !== "darwin") {
			const buttons = {YES: 0, NO: 1};
			const window = BrowserWindow.getFocusedWindow();
			if (window && dialog.showMessageBoxSync(window, {
				type: "question",
				title: "Confirmation",
				message: "Are you sure you want to close the app?",
				buttons: ["Yes", "No"]
			}) === buttons.YES) {
				if (this.mainWindow) {
					this.mainWindow.destroy();
					this.mainWindow = undefined;
				}
				app.quit();
			} else {
				event.preventDefault();
			}
		}
	}
}
