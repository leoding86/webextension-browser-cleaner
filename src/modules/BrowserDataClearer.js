import browser from 'browser';
import BrowserDataClearConfig from './BrowserDataClearConfig';

export default class BrowserDataClearer {
  /**
   *
   * @param {BrowserDataClearConfig} clearConfig
   */
  clearData(clearConfig) {
    return new Promise(resolve => {
      browser.browsingData.remove(clearConfig.removalOptions, clearConfig.dataTypeSet, () => {
        resolve();
      });
    });
  }
}
