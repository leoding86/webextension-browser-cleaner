export default class BrowserDataClearConfig {
  constructor() {
    this.removalOptions = {
      since: 0,
      origins: []
    }
    this.dataTypeSet = {
      appcache: true,
      cache: true,
      cacheStorage: true,
      cookies: true,
      downloads: true,
      fileSystems: true,
      formData: true,
      history: true,
      indexedDB: true,
      localStorage: true,
      passwords: true,
      pluginData: true,
      serviceWorkers: true,
      webSQL: true
    }
  }

  setOrigin(origin) {
    this.removalOptions.origins = [origin];

    return this;
  }

  setSince(since) {
    this.removalOptions.since = since;

    return this;
  }

  setDataTypeSet(dataType, value) {
    let dataTypes = null;

    if (typeof dataType === 'string') {
      dataTypes = {};
      dataTypes[dataType] = !!value;
    } else if (typeof dataType === 'object' && value === undefined) {
      dataTypes = dataType;
    }

    for (let i in dataTypes) {
      if (this.dataTypeSet[i] !== undefined) {
        this.dataTypeSet[i] = !!dataTypes[i];
      }
    }

    return this;
  }
}
