import browser from '@/modules/Browser';
import Notification from '@/modules/Notification';
import CleanDataTypesParser from '@/modules/CleanDataTypesParser';
import ScheduledTask from '@/modules/ScheduledTask';
import CleanHistoryTask from './CleanHistoryTask';

/**
 * @class
 */
class App {

  /**
   * @constructor
   */
  constructor() {
    this.domainPattern = /^([a-z\d][a-z\d-]*[a-z\d]\.)+[a-z\d][a-z\d-]*[a-z\d]$/i;

    this.fetchDomainPattern = /https?:\/{2}((?:[a-z\d][a-z\d-]*[a-z\d]\.)+[a-z\d][a-z\d-]*[a-z\d])/i;

    /**
     * @type {Object}
     */
    this.storageItems;

    /**
     * @type {Notification}
     */
    this.notification = Notification.getNotification();

    /**
     * @type {Array}
     */
    this.whitelistOrigins = [];

    /**
     * @type {Object}
     */
    this.cleanDataTypesOptionIncludeWhitelist = {};

    /**
     * @type {Object}
     */
    this.cleanDataTypesOptionExcludeWhitelist = {};

    /**
     * @type {Object}
     */
    this.cleanUnfilterableDataTypesOption = {};

    /**
     * @type {ScheduledTask}
     */
    this.scheduledCleanHistoryTask = null;

    browser.browserAction.onClicked.addListener(() => {
      if (this.storageItems.clickExtensionIconTo == 1) {
        browser.runtime.openOptionsPage();
      } else {
        this.showNotification('Cleaning browser data');

        this.cleanBrowsingData().then(() => {
          this.showNotification('Clean browser data complete');
        }).catch(() => {
          this.showNotification('Some error occurred');
        });
      }
    });
  }

  showNotification(options) {
    if (this.storageItems.displayNotification) {
      if (typeof options === 'string') {
        this.notification.show({
          type: "basic",
          iconUrl: "./icon.png",
          title: "Browser cleaner",
          message: options
        });
      } else {
        this.notification.show(options);
      }
    }
  }

  onExtensionStartup() {
    let self = this;

    this.setWhitelistOrigins(this.storageItems.whitelist);

    this.cleanUnfilterableDataTypesOption =
      CleanDataTypesParser.getUnfilterableCleanDataTypesOption(this.storageItems.cleanDataTypes);

    this.cleanDataTypesOptionExcludeWhitelist =
      CleanDataTypesParser.getFilterableCleanDataTypesOption(this.storageItems.cleanDataTypes);

    this.cleanDataTypesOptionIncludeWhitelist =
      CleanDataTypesParser.getFilterableCleanDataTypesOption(this.storageItems.cleanWhitelistDataTypes);

    browser.runtime.onConnect.addListener(port => {
      port.onMessage.addListener((message, sender) => {
        if (message.action === 'cleanBrowsingData') {
          this.cleanBrowsingData().then(() => {
            this.showNotification('Clean browser data complete');
          }).catch(() => {
            this.showNotification('Some error occurred');
          });
        }
      });
    });

    /**
     * Create a context menu
     */
    browser.contextMenus.removeAll(() => {
      browser.contextMenus.create({
        title: "Add to whitelist",
        id: Date.now() + ''
      }, () => {
        browser.contextMenus.onClicked.addListener(info => {
          let matches = info.pageUrl.match(self.fetchDomainPattern);

          if (matches && self.storageItems.whitelist.indexOf(matches[1]) < 0) {
            browser.storage.local.set({
              whitelist: self.storageItems.whitelist.concat([matches[1].toLowerCase()])
            }, () => {
              self.showNotification('Site added');
            });
          } else {
            if (!matches) {
              self.showNotification('It\'s a invalid site');
            } else {
              self.showNotification('Site has been added');
            }
          }
        });
      });
    });

    this.scheduledCleanHistoryTask = new ScheduledTask();
    this.scheduledCleanHistoryTask.debug = __DEBUG__;

    let cleanHistoryTask = new CleanHistoryTask();

    this.scheduledCleanHistoryTask.task = cleanHistoryTask;
    this.updateTaskInterval(this.scheduledCleanHistoryTask, this.storageItems.cleanHistoryInEvery * 1000);

    this.scheduledCleanHistoryTask.run();
  }

  onBrowserStartup() {
    this.cleanBrowsingData();
  }

  onBrowserClosed() {
    this.cleanBrowsingData();
  }

  onStorageChanged(storageItems) {
    if (undefined !== storageItems.whitelist) {
      this.setWhitelistOrigins(storageItems.whitelist.newValue);
    }

    if (undefined !== storageItems.cleanDataTypes) {
      this.cleanUnfilterableDataTypesOption =
        CleanDataTypesParser.getUnfilterableCleanDataTypesOption(storageItems.cleanDataTypes.newValue);
      this.cleanDataTypesOptionExcludeWhitelist =
        CleanDataTypesParser.getFilterableCleanDataTypesOption(storageItems.cleanDataTypes.newValue);
    }

    if (undefined !== storageItems.cleanWhitelistDataTypes) {
      this.cleanDataTypesOptionIncludeWhitelist =
        CleanDataTypesParser.getFilterableCleanDataTypesOption(storageItems.cleanWhitelistDataTypes.newValue);
    }

    if (undefined !== storageItems.cleanHistoryInEvery) {
      this.updateTaskInterval(this.scheduledCleanHistoryTask, storageItems.cleanHistoryInEvery.newValue * 1000);
    }
  }

  /**
   *
   * @param {ScheduledTask} scheduledTask
   * @param {*} intervalTime
   */
  updateTaskInterval(scheduledTask, intervalTime) {
    if (/^[1-9]\d*$/.test(intervalTime)) {
      scheduledTask.setIntervalTime(intervalTime);

      if (scheduledTask.status === ScheduledTask.STOP) {
        scheduledTask.restart();
      }
    } else if (intervalTime == 0) {
      scheduledTask.stop();
    }
  }

  setWhitelistOrigins(whitelist) {
    this.whitelistOrigins = [];

    try {
      whitelist.forEach(item => {
        if (this.domainPattern.test(item)) {
          this.whitelistOrigins.push('http://' + item);
          this.whitelistOrigins.push('https://' + item);
        }
      });
    } catch(e) {
      console.log(e);
    }
  }

  setCleanWhitelistDataTypesOption(dataTypes) {
    try {
      this.cleanWhitelistDataTypesOption = CleanDataTypesParser.getCleanTypesOptionFromExclude(dataTypes);
    } catch(e) {
      console.log(e);
    }
  }

  removeBrowsingData(options, dataToRemove) {
    let self = this;

    return new Promise((resolve, reject) => {
      browser.browsingData.remove(options, dataToRemove, () => {
        if (!browser.runtime.lastError) {
          resolve();
          return;
        }

        reject();
      });
    });
  }

  cleanBrowsingData() {
    return this.cleanUnfilterableBrowsingData().then(() => {
      return this.cleanExcludeWhitelistBrowsingData();
    }).then(() => {
      return this.cleanWhitelistBrowsingData();
    });
  }

  cleanUnfilterableBrowsingData() {
    return this.removeBrowsingData({}, this.cleanUnfilterableDataTypesOption);
  }

  cleanExcludeWhitelistBrowsingData() {
    return this.removeBrowsingData({
      excludeOrigins: this.whitelistOrigins
    }, this.cleanDataTypesOptionExcludeWhitelist);
  }

  cleanWhitelistBrowsingData() {
    return this.removeBrowsingData({
      origins: this.whitelistOrigins
    }, this.cleanDataTypesOptionIncludeWhitelist);
  }
}

export default App;
