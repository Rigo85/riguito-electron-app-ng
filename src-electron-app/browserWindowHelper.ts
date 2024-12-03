import { BrowserWindow, screen } from "electron";
import path from "path";
import { config } from "dotenv";

config({path: ".env"});

const devTools = /true/i.test(process.env["DEV_TOOLS"] || "false");

export type Pair<T> = [T, T];

export interface ElectronAppBrowserWindowOptions {
	size: Record<string, Pair<number>> & { default: Pair<number> };
	icon: Record<string, string> & { default: string };
	frame: boolean;
	transparent: boolean;
	parent?: BrowserWindow;
	route: string;
	onShow?: (window: BrowserWindow, event: any) => void;
	onClose?: (window: BrowserWindow, event: any) => void;
	devTools: boolean;
	alwaysOnTop: boolean;
	resizable: boolean;
	show: boolean;
	fullscreen: boolean;
}

export function createWindow(eabwo: ElectronAppBrowserWindowOptions): BrowserWindow {
	const monitor = screen.getPrimaryDisplay();
	const {x, y, height, width} = monitor.bounds;
	const icon = eabwo.icon[process.platform] || eabwo.icon["default"];
	const size = eabwo.size[process.platform] || eabwo.size["default"];
	const _width = size[0];
	const _height = size[1];

	const window = new BrowserWindow({
		width: eabwo.fullscreen ? width : _width,
		height: eabwo.fullscreen ? height : _height,
		x: eabwo.fullscreen ? x : x + Math.trunc(width / 2) - Math.trunc(_width / 2),
		y: eabwo.fullscreen ? y : y + Math.trunc(height / 2) - Math.trunc(_height / 2),
		frame: eabwo.frame,
		transparent: eabwo.transparent,
		parent: eabwo.parent,
		show: eabwo.show,
		fullscreen: eabwo.fullscreen,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			contextIsolation: true
		}
	});

	const route = eabwo.route ? `#/${eabwo.route}` : "";

	window.loadURL(
		`file://${path.join(__dirname, "..", "..", "dist", "riguito-app-ng", "browser", "index.html")}${route}`
	);

	window.removeMenu();
	window.setAlwaysOnTop(eabwo.alwaysOnTop);
	window.setResizable(eabwo.resizable);
	window.setIcon(icon);

	window.on("show", () => {
		if (eabwo.onShow) {
			eabwo.onShow(window, undefined);
		}
	});

	window.on("close", (event: any) => {
		if (eabwo.onClose) {
			eabwo.onClose(window, event);
		}
	});

	return window;
}

export function createMainWindow(): BrowserWindow {
	const size = {
		"darwin": [400, 260],
		"win32": [400, 290],
		"default": [400, 260]
	} as Record<string, Pair<number>> & { default: Pair<number> };

	const icon = {
		"darwin": "./public/icon.icns",
		"win32": "./public/icon.ico",
		"default": "./public/icon.jpeg"
	} as Record<string, string> & { default: string };

	return createWindow({
		size,
		icon,
		frame: false,
		transparent: true,
		route: "",
		devTools,
		alwaysOnTop: true,
		resizable: false,
		show: false,
		fullscreen: true,
		onShow: (window: BrowserWindow, event: any) => {
			if (devTools) {
				window.webContents.openDevTools();
			}
		}
	});
}
