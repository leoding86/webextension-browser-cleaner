import browser from '@/modules/Browser';

export default {
  storeTestData(name, value) {
    let obj = {};

    obj[`_test_${name}`] = value;

    browser.storage.local.set(obj);
  }
}
