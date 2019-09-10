import browser from '@/modules/Browser';
import Notification from '@/modules/Notification';
import CleanDataTypesParser from '@/modules/CleanDataTypesParser';

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

    this.cleanDataTypesOptionExcludeWhitelist = {};

    this.cleanUnfilterableDataTypesOption = {};

    browser.browserAction.onClicked.addListener(() => {
      if (this.storageItems.clickExtensionIconTo == 1) {
        browser.runtime.openOptionsPage();
      } else {
        this.showNotification({
          type: "basic",
          iconUrl: "./icon.png",
          title: "Browser cleaner",
          message: 'Cleaning browser data'
        });

        this.cleanBrowsingData().then(() => {
          this.showNotification({
            type: "basic",
            iconUrl: "./icon.png",
            title: "Browser cleaner",
            message: 'Clean browser data complete'
          });
        }).catch(() => {
          this.showNotification({
            type: "basic",
            iconUrl: "./icon.png",
            title: "Browser cleaner",
            message: 'Some error occurred'
          });
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
            this.showNotification({
              type: "basic",
              iconUrl: "./icon.png",
              title: "Browser cleaner",
              message: 'Clean browser data complete'
            });
          }).catch(() => {
            this.showNotification({
              type: "basic",
              iconUrl: "./icon.png",
              title: "Browser cleaner",
              message: 'Some error occurred'
            });
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
            self.showNotification('Site has been added');
          }
        });
      });
    });
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
