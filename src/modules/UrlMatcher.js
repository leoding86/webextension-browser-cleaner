export default class UrlMatcher {
  constructor() {
    this.domainRegex = /^(?:[a-z\d_-]+:\/{2})?([a-z\d._-]+)/;
    this.ruleRegex = /^\.?[a-z\d_-](\.[a-z\d_-])+$/
    this.matchRules = {};
  }

  /**
   *
   * @param {string} rule
   * @returns {void}
   */
  addRule(rule) {
    if (rule.test(this.ruleRegex) && !this.matchRules[rule]) {
      this.matchRules[rule] = rule;
    }
  }

  /**
   *
   * @param {string} domain
   * @param {string} rule
   * @returns {boolean}
   */
  isFullMatch(domain, rule) {
    return domain === rule;
  }

  /**
   *
   * @param {string} domain
   * @param {string} rule
   * @returns {boolean}
   */
  isPartlyMatch(domain, rule) {
    if (!rule.indexOf('.') !== 0) {
      return false;
    }

    return domain.indexOf(rule) === domain.length - rule.length;
  }

  /**
   *
   * @param {string} url
   * @returns {string|null}
   */
  filterDomainName(url) {
    let matches = url.match(this.domainRegex);

    if (!matches || !matches[1]) {
      return null;
    }

    return matches[1];
  }

  /**
   *
   * @param {string} fromUrl
   * @returns {boolean}
   */
  matchAny(fromUrl) {
    let domain = this.filterDomainName(fromUrl);

    for (let i in this.matchList) {
      let rule = this.matchList[i];

      if (rule.indexOf('.') === 0) {
        return this.isPartlyMatch(domain, rule);
      } else {
        return this.isFullMatch(domain, rule);
      }
    }

    return false;
  }
}
