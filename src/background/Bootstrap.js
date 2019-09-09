import common from '@/modules/common';
import App from './App';
import Update from './Update';
import browser from '@/modules/Browser';

class Bootstrap {

  constructor() {
    this.windows = new Map();

    /**
     * @property {Map}
     */
    this.windows = new Map();

    this.app = new App();

    let self = this;

    /**
     * Load storage items and set them to app instance
     */
    browser.storage.local.get(items => {
      self.app.storageItems = items;

      /**
       * Test
       */
      if (!items.clearDataTypes) {
        browser.storage.local.set({
          clearDataTypes: {
            "appcache": true,
            "cache": true,
            "cacheStorage": true,
            "cookies": true,
            "downloads": true,
            "fileSystems": true,
            "formData": true,
            "history": true,
            "indexedDB": true,
            "localStorage": true,
            // "pluginData": true,
            "passwords": true,
            "serviceWorkers": true,
            "webSQL": true
          }
        });
      }
    });

    /**
     * Listen storage changes and set changed items to app instance
     */
    browser.storage.onChanged.addListener(items => {
      Object.keys(items).forEach(key => {
        self.app.storageItems[key] = items[key].newValue;
      });
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
