import { App, PluginSettingTab, Setting } from "obsidian";
import GraphRefresherPlugin from "./main";

export interface GraphRefresherPluginSettings {
	mySetting: string;
	idleDelay: number;
}

export const DEFAULT_SETTINGS: GraphRefresherPluginSettings = {
	mySetting: "default",
	idleDelay: 10000,
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
			.setName("Settings #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Idle time before refresh")
			.setDesc("Set with ms(default: 10000 = 10s)")
			.addText((text) =>
				text
					.setPlaceholder("10000")
					.setValue(this.plugin.settings.idleDelay.toString())
					.onChange(async (value) => {
						this.plugin.settings.idleDelay = parseInt(value);
						await this.plugin.saveSettings();
					})
			);
	}
}
