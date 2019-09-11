import browser from '@/modules/Browser';
import CleanDataTypesParser from '@/modules/CleanDataTypesParser';

class CleanHistoryTask {
  handle() {
    return new Promise((resolve, reject) => {
      browser.browsingData.remove({}, CleanDataTypesParser.getUnfilterableCleanDataTypesOption(['downloads', 'history']), () => {
        if (!browser.runtime.lastError) {
          resolve();
          return;
        }

        reject();
      });
    });
  }
}

export default CleanHistoryTask;
