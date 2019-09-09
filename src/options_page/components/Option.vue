<template>
  <div>
    <el-row>
      <el-col :sm="4" :lg="7" class="hidden-xs-only">&nbsp;</el-col>
      <el-col :sm="16" :lg="10" :xs="24">
        <el-card>
          <option-row label="Click extension icon to ...">
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
        </el-card>
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
      clickExtensionIconTo: app.storageItems.clickExtensionIconTo,
      displayNotification: app.storageItems.displayNotification,
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
    }
  },

  computed: {
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

  mounted() {
    this.$refs.cleanDataTypesTree.setCheckedKeys(app.storageItems.cleanDataTypes);
  },

  methods: {
    handleDataTypeCheck() {
      let checkedDataTypes = this.$refs.cleanDataTypesTree.getCheckedKeys();

      let cleanDataTypes = CleanDataTypesParser.filterCleanDataTypes(checkedDataTypes);

      browser.storage.local.set({
        cleanDataTypes: cleanDataTypes
      });
    }
  }
}
</script>
