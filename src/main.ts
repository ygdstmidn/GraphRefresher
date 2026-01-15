import { Plugin } from "obsidian";
import {
	DEFAULT_SETTINGS,
	GraphRefresherPluginSettings,
	GraphRefresherSettingTab,
} from "./settings";

export default class GraphRefresherPlugin extends Plugin {
	settings: GraphRefresherPluginSettings;
	idleTimer: number | null = null;

	// イベントリスナーをプロパティとして保持
	private onMouseMove = () => this.resetIdleTimer();
	private onKeyDown = () => this.resetIdleTimer();
	private onMouseDown = () => this.resetIdleTimer();

	async onload() {
		console.debug("Loading Graph Refresher Plugin");

		// 設定をロード
		await this.loadSettings();

		// 設定タブを追加
		this.addSettingTab(new GraphRefresherSettingTab(this.app, this));

		// ユーザが操作したらアイドルタイマーをリセット
		window.addEventListener("mousemove", this.onMouseMove);
		window.addEventListener("keydown", this.onKeyDown);
		window.addEventListener("mousedown", this.onMouseDown);

		// プラグインロード時にアイドルタイマーをセット
		this.resetIdleTimer();
	}

	onunload() {
		console.debug("Unloading Graph Refresher Plugin");
		window.removeEventListener("mousemove", this.onMouseMove);
		window.removeEventListener("keydown", this.onKeyDown);
		window.removeEventListener("mousedown", this.onMouseDown);
	}

	resetIdleTimer() {
		if (this.idleTimer) {
			window.clearTimeout(this.idleTimer);
		}
		this.idleTimer = window.setTimeout(() => {
			this.refreshGraphView();
		}, this.settings.idleDelay);
	}

	refreshGraphView() {
		const leaf = this.app.workspace.getMostRecentLeaf();

		if (!leaf || leaf.view.getViewType() !== "graph") {
			return;
		}

		void leaf.setViewState({
			type: "graph",
			active: true,
		});

		console.debug(
			"Graph Refresher Plugin: Graph view refreshed due to inactivity."
		);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<GraphRefresherPluginSettings>
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
