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
    /**
     * @type {Object}
     */
    this.storageItems;

    /**
     * @type {Notification}
     */
    this.notification = Notification.getNotification();

    browser.browserAction.onClicked.addListener(() => {
      if (this.storageItems.clickExtensionIconTo == 1) {
        browser.tabs.create({
          url: browser.runtime.getURL('./options_page/index.html')
        });
      } else {
        this.showNotification({
          type: "basic",
          iconUrl: "./icon.png",
          title: "Browser clearer",
          message: 'Clearing browser data'
        });

        this.wipeBrowingData().then(() => {
          this.showNotification({
            type: "basic",
            iconUrl: "./icon.png",
            title: "Browser clearer",
            message: 'Delete browser data complete'
          });
        }).catch(() => {
          this.showNotification({
            type: "basic",
            iconUrl: "./icon.png",
            title: "Browser clearer",
            message: 'Some error occurred'
          });
        });
      }
    });
  }

  showNotification(options) {
    if (this.storageItems.displayNotification) {
      this.notification.show(options);
    }
  }

  onBrowserStartup() {
    this.wipeBrowingData();
  }

  onBrowserClosed() {
    this.wipeBrowingData();
  }

  wipeBrowingData() {
    let self = this;

    return new Promise((resolve, reject) => {
      browser.browsingData.remove({}, CleanDataTypesParser.getCleanDataTypesOption(self.storageItems.cleanDataTypes), () => {
        if (!browser.runtime.lastError) {
          resolve();
          return;
        }

        reject();
      });
    });
  }
}

export default App;
