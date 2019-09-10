import common from '@/modules/common';
import App from './App';
import Update from './Update';
import browser from '@/modules/Browser';

class Bootstrap {

  constructor() {
    /**
     * @type {Map}
     */
    this.windows = new Map();

    /**
     * @type {Map}
     */
    this.windows = new Map();

    /**
     * @type {App}
     */
    this.app = new App();

    let self = this;

    /**
     * Load storage items and set them to app instance, when the staroge items has
     * been setted, call the app onExtensionStartup method if it's exists.
     */
    browser.storage.local.get(items => {
      self.app.storageItems = items;

      if (typeof self.app.onExtensionStartup === 'function') {
        self.app.onExtensionStartup.call(self.app);
      }
    });

    /**
     * Listen storage changes and set changed items to app instance
     */
    browser.storage.onChanged.addListener(items => {
      Object.keys(items).forEach(key => {
        self.app.storageItems[key] = items[key].newValue;
      });

      if (typeof self.app.onStorageChanged === 'function') {
        self.app.onStorageChanged.call(self.app, items);
      }
    });

    /**
     * Prevent missing windows after extension was reloaded
     */
    browser.windows.getAll(windows => {
      if (windows.length > 0) {
        windows.forEach(window => {
          self.windows.set(window.id, window);
        });
      }
    });

    browser.windows.onCreated.addListener(window => {
      if (!self.windows.has(window.id)) {
        self.windows.set(window.id, window);
      }

      if (self.windows.size === 1) {
        /**
         * Browser is just startup
         */
        common.storeTestData('browser_startup', Date.now());

        if (typeof self.app.onBrowserStartup === 'function') {
          self.app.onBrowserStartup.call(self.app);
        }
      }
    });

    browser.windows.onRemoved.addListener(windowId => {
      if (self.windows.has(windowId)) {
        self.windows.delete(windowId);
      }

      if (self.windows.size <= 0) {
        /**
         * All windows has been closed
         */
        common.storeTestData('browser_closed', Date.now());

        if (typeof self.app.onBrowserClosed === 'function') {
          self.app.onBrowserClosed.call(self.app);
        }
      }
    });
  }

  static startup() {
    Update.update(() => {
      new Bootstrap();
    });
  }
}

Bootstrap.startup();
