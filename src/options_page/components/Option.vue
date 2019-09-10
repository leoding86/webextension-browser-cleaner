<template>
  <div>
    <el-row>
      <el-col :sm="2" :md="3" :lg="6" class="hidden-xs-only">&nbsp;</el-col>
      <el-col :sm="20" :md="18" :lg="12" :xs="24">
        <el-card>
          <option-row label="Click extension icon to ...">
            <el-tooltip v-if="clickExtensionIconTo != 1" content="You can right-click the extension icon and click the 'Option' menu to open options page.">
              <el-button circle
                size="small"
                icon="el-icon-info"
                type="text"></el-button>
            </el-tooltip>
            <el-select v-model="clickExtensionIconTo"
              size="small">
              <el-option
                :value="1"
                :label="'Open options'"></el-option>
              <el-option value="2"
                :label="'Clean data'"></el-option>
            </el-select>
          </option-row>
          <option-row label="Show notification">
            <el-checkbox v-model="displayNotification"></el-checkbox>
          </option-row>

          <el-divider></el-divider>

          <option-row label="Clean data in ..."
            :control-align-left="true">

            <el-tree ref="cleanDataTypesTree"
              :data="dataTypes"
              show-checkbox
              node-key="type"
              @check="handleDataTypeCheck">
            </el-tree>

          </option-row>

          <el-divider></el-divider>

          <option-row label="Whitelist"
            control-align-left
            tip="Work for caches, storage and cookies only">
            <el-input type="textarea"
              v-model="whitelistText"
              :spellcheck="false"
              autosize
              @blur="handleWhitelistBlur"></el-input>
          </option-row>

          <option-row label="Clean data types in whitelist">
            <el-tree ref="cleanDataTypesInWhitelistTree"
              :data="filterableDataTypes"
              show-checkbox
              node-key="type"
              @check="handleWhitelistDataTypeCheck">
            </el-tree>
          </option-row>
        </el-card>
        <div class="global-actions">
          <el-tooltip content="Clean data"
            placement="top">
            <el-button icon="el-icon-delete"
              circle
              type="danger"
              @click="cleanBrowsingData"></el-button>
          </el-tooltip>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import browser from '@/modules/Browser';
import OptionRow from './OptionRow';
import CleanDataTypesParser from '@/modules/CleanDataTypesParser';

export default {
  components: {
    'option-row': OptionRow
  },

  data() {
    return {
      whitelistText: '',
      whitelist: [],
      clickExtensionIconTo: null,
      displayNotification: null,
      dataTypes: [
        {
          type: 'wrapper:browsing-and-download-history',
          label: 'Browsing and download history',
          children: [
            {
              type: 'history',
              label: 'Browsing history'
            },
            {
              type: 'downloads',
              label: 'Download history'
            }
          ]
        },
        {
          type: 'wrapper:cached-images-and-files',
          label: 'Cached images and files',
          children: [
            {
              type: 'appcache',
              label: 'App cache'
            },
            {
              type: 'cache',
              label: 'Cache'
            },
            {
              type: 'cacheStorage',
              label: 'Cache storage'
            }
          ]
        },
        {
          type: 'wrapper:cookies-and-site-data',
          label: 'Cookies and site data',
          children: [
            {
              type: 'cookies',
              label: 'Cookies'
            },
            {
              type: 'fileSystems',
              label: 'File systems'
            },
            {
              type: 'indexedDB',
              label: 'IndexedDB'
            },
            {
              type: 'localStorage',
              label: 'Local Storage'
            },
            {
              type: 'serviceWorkers',
              label: 'Service Workers'
            },
            {
              type: 'webSQL',
              label: 'Web SQL'
            }
          ]
        },
        {
          type: 'wrapper:passwords-and-autofill-form-data',
          label: 'Passwords and autofill form data',
          children: [
            {
              type: 'passwords',
              label: 'Passwords'
            },
            {
              type: 'formData',
              label: 'Autofill form data'
            }
          ]
        }
      ],
      filterableDataTypes: [
        {
          type: 'wrapper:cached-images-and-files',
          label: 'Cached images and files',
          children: [
            {
              type: 'appcache',
              label: 'App cache'
            },
            {
              type: 'cache',
              label: 'Cache'
            },
            {
              type: 'cacheStorage',
              label: 'Cache storage'
            }
          ]
        },
        {
          type: 'wrapper:cookies-and-site-data',
          label: 'Cookies and site data',
          children: [
            {
              type: 'cookies',
              label: 'Cookies'
            },
            {
              type: 'fileSystems',
              label: 'File systems'
            },
            {
              type: 'indexedDB',
              label: 'IndexedDB'
            },
            {
              type: 'localStorage',
              label: 'Local Storage'
            },
            {
              type: 'serviceWorkers',
              label: 'Service Workers'
            },
            {
              type: 'webSQL',
              label: 'Web SQL'
            }
          ]
        }
      ]
    }
  },

  watch: {
    clickExtensionIconTo(val) {
      browser.storage.local.set({
        clickExtensionIconTo: val
      });
    },

    displayNotification(val) {
      browser.storage.local.set({
        displayNotification: !!val
      });
    },

    cleanDataTypes: {
      handler: function(val) {
        browser.storage.local.set({
          cleanDataTypes: val
        });
      },
      deep: true
    },

    storageItems: {
      handler: function(val) {
        this.whitelistText = val.whitelist.join('\r\n');
      },
      deep: true
    }
  },

  computed: {
    storageItems() {
      return this.$root.$data.storageItems;
    },

    indeterminate() {
      let checkedExists = false;
      let uncheckedExists = false;

      Object.keys(this.cleanDataTypes).forEach(type => {
        if (this.cleanDataTypes[type]) {
          checkedExists = true;
        } else {
          uncheckedExists = true;
        }
      });

      this.cleanAll = checkedExists && !uncheckedExists;
      return checkedExists && uncheckedExists;
    }
  },

  beforeMount() {
    this.whitelist = this.storageItems.whitelist;
    this.clickExtensionIconTo = this.storageItems.clickExtensionIconTo;
    this.displayNotification = this.storageItems.displayNotification;
    this.whitelistText = this.whitelist.length > 0 ? this.whitelist.join("\r\n") : '';
  },

  mounted() {
    this.$refs.cleanDataTypesTree.setCheckedKeys(this.storageItems.cleanDataTypes);
    this.$refs.cleanDataTypesInWhitelistTree.setCheckedKeys(this.storageItems.cleanWhitelistDataTypes);
  },

  methods: {
    handleDataTypeCheck() {
      let checkedDataTypes = this.$refs.cleanDataTypesTree.getCheckedKeys();

      let cleanDataTypes = CleanDataTypesParser.filterCleanDataTypes(checkedDataTypes);

      browser.storage.local.set({
        cleanDataTypes: cleanDataTypes
      });
    },

    handleWhitelistDataTypeCheck() {
      let checkedDataTypes = this.$refs.cleanDataTypesInWhitelistTree.getCheckedKeys();

      let cleanWhitelistDataTypes = CleanDataTypesParser.filterCleanDataTypes(checkedDataTypes);

      browser.storage.local.set({
        cleanWhitelistDataTypes: cleanWhitelistDataTypes
      });
    },

    handleWhitelistBlur() {
      let whitelist = [];

      this.whitelistText.split(/\r\n|\r|\n/).forEach(item => {
        if (typeof item === 'string' && item.length > 0) {
          whitelist.push(item);
        }
      });

      browser.storage.local.set({
        whitelist: whitelist
      });
    },

    cleanBrowsingData() {
      let port = browser.runtime.connect();
      port.postMessage({
        action: 'cleanBrowsingData'
      });
    }
  }
}
</script>

<style lang="scss">
.global-actions {
  margin: 20px 0;
  text-align: center;

  .el-button {
    box-shadow: 0 2px 0 #bb5a5a;
  }
}
</style>
