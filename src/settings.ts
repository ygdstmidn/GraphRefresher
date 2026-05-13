import { App, PluginSettingTab, Setting } from "obsidian";
import GraphRefresherPlugin from "./main";

export interface GraphRefresherPluginSettings {
	idleDelay: number;
	intervalDelay: number;
}

export const DEFAULT_SETTINGS: GraphRefresherPluginSettings = {
	idleDelay: 30000,
	intervalDelay: 5000,
};

export class GraphRefresherSettingTab extends PluginSettingTab {
	plugin: GraphRefresherPlugin;

	constructor(app: App, plugin: GraphRefresherPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Idle time before refresh")
			.setDesc("Set with ms(default: 30000 = 30s)")
			.addText((text) =>
				text
					.setPlaceholder("30000")
					.setValue(this.plugin.settings.idleDelay.toString())
					.onChange(async (value) => {
						this.plugin.settings.idleDelay = parseInt(value);
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Refresh interval")
			.setDesc("Set with ms(default: 5000 = 5s)")
			.addText((text) =>
				text
					.setPlaceholder("5000")
					.setValue(this.plugin.settings.intervalDelay.toString())
					.onChange(async (value) => {
						this.plugin.settings.intervalDelay = parseInt(value);
						await this.plugin.saveSettings();
					}),
			);
	}
}
