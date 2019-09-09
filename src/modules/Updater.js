import browser from '@/modules/Browser';
import versionCompare from '@/modules/versionCompare';

function Updater(currentSettings) {
  this.currentSettings = currentSettings,
  this.defaultSettings;
}

Updater.prototype = {
  setDefaultSettings: function (defaultSettings) {
    this.defaultSettings = defaultSettings;
    return this;
  },

  removeSettings: function (settingsNeededRemoved) {
    browser.storage.local.remove(settingsNeededRemoved);
  },

  mergeSettings: function (callback, overrideSettings) {
    var self = this;

    Object.keys(this.defaultSettings).forEach(function (key) {
      if (undefined === self.currentSettings[key]) {
        self.currentSettings[key] = self.defaultSettings[key];
      }
    });

    if (overrideSettings) {
      Object.keys(overrideSettings).forEach(function (key) {
        self.currentSettings[key] = overrideSettings[key];
      });
    }

    this.storageSettings(this.currentSettings, callback);
  },

  updateSetting: function (setting, callback) {
    this.storageSettings(setting, callback);
  },

  storageSettings: function (settings, callback) {
    let self = this;

    browser.storage.local.set(settings, function () {
      callback.call(self);
    });
  },

  isNewer: function (version) {
    return !this.currentSettings.version || versionCompare(this.currentSettings.version, version) < 0
  }
}

export default Updater;
