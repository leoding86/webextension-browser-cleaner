class CleanDataTypesParser {
  static validDataTypes = [
    "appcache",
    "cache",
    "cacheStorage",
    "cookies",
    "downloads",
    "fileSystems",
    "formData",
    "history",
    "indexedDB",
    "localStorage",
    "serverBoundCertificates",
    "pluginData",
    "passwords",
    "serviceWorkers",
    "webSQL"
  ]

  static getCleanDataTypesOption(dataTypes) {
    let cleanDataTypesOption = {};

    dataTypes.forEach(type => {
      if (CleanDataTypesParser.validDataTypes.indexOf(type) > -1 && !cleanDataTypesOption[type]) {
        cleanDataTypesOption[type] = true;
      }
    });

    return cleanDataTypesOption;
  }

  static filterCleanDataTypes(dataTypes) {
    let cleanDataTypes = [];

    dataTypes.forEach(type => {
      if (CleanDataTypesParser.validDataTypes.indexOf(type) > -1 && cleanDataTypes.indexOf(type) < 0) {
        cleanDataTypes.push(type);
      }
    });

    return cleanDataTypes;
  }
}

export default CleanDataTypesParser;