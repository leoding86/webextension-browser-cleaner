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
  ];

  static validUnfilterableDataTypes = [
    "downloads",
    "formData",
    "history",
    "serverBoundCertificates",
    "passwords"
  ];

  static getFilterableCleanDataTypesOption(dataTypes) {
    let cleanDataTypesOption = {};

    dataTypes.forEach(dataType => {
      if (CleanDataTypesParser.validDataTypes.indexOf(dataType) > -1 &&
        CleanDataTypesParser.validUnfilterableDataTypes.indexOf(dataType) < 0 &&
        !cleanDataTypesOption[dataType]
      ) {
        cleanDataTypesOption[dataType] = true;
      }
    });

    return cleanDataTypesOption;
  }

  static getUnfilterableCleanDataTypesOption(dataTypes) {
    let cleanDataTypesOption = {};

    dataTypes.forEach(dataType => {
      if (CleanDataTypesParser.validDataTypes.indexOf(dataType) > -1 &&
        CleanDataTypesParser.validUnfilterableDataTypes.indexOf(dataType) > -1 &&
        !cleanDataTypesOption[dataType]
      ) {
        cleanDataTypesOption[dataType] = true;
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
