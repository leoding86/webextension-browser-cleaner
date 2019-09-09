import Updater from '@/modules/Updater';
import PackageFileReader from '@/modules/PackageFileReader';
import defaultSettings from './defaultSettings';
import Browser from '@/modules/Browser';

class Update {
  static update(callback) {
    Browser.storage.local.get(null, items => {
      const updater = new Updater(items);

      updater.setDefaultSettings(defaultSettings);

      PackageFileReader.read('manifest.json', result => {
        result = JSON.parse(result);

        if (updater.isNewer(result.version)) {
          updater.mergeSettings(() => {
            console.log('Update complete, current version ' + result.version);
            callback();
          }, {
            version: result.version,
            versionName: result.version_name
          });
        } else {
          callback();
        }
      });
    });
  }
}

export default Update;
