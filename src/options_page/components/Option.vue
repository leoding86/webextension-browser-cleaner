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
                :label="'Clear data'"></el-option>
            </el-select>
          </option-row>
          <option-row label="Show notification">
            <el-checkbox v-model="displayNotification"></el-checkbox>
          </option-row>
          <el-divider></el-divider>
          <option-row label="Clear data in ..."
            :control-align-left="true">
            <el-checkbox :indeterminate="indeterminate" v-model="clearAll" @change="handleClearAllChanged">All</el-checkbox>
            <el-checkbox v-model="clearDataTypes.appcache">appcache</el-checkbox>
            <el-checkbox v-model="clearDataTypes.cache">cache</el-checkbox>
            <el-checkbox v-model="clearDataTypes.cacheStorage">cacheStorage</el-checkbox>
            <el-checkbox v-model="clearDataTypes.cookies">cookies</el-checkbox>
            <el-checkbox v-model="clearDataTypes.downloads">downloads</el-checkbox>
            <el-checkbox v-model="clearDataTypes.fileSystems">fileSystems</el-checkbox>
            <el-checkbox v-model="clearDataTypes.formData">formData</el-checkbox>
            <el-checkbox v-model="clearDataTypes.history">history</el-checkbox>
            <el-checkbox v-model="clearDataTypes.indexedDB">indexedDB</el-checkbox>
            <el-checkbox v-model="clearDataTypes.localStorage">localStorage</el-checkbox>
            <!-- <el-checkbox>pluginData</el-checkbox> -->
            <el-checkbox v-model="clearDataTypes.passwords">passwords</el-checkbox>
            <el-checkbox v-model="clearDataTypes.serviceWorkers">serviceWorkers</el-checkbox>
            <el-checkbox v-model="clearDataTypes.webSQL">webSQL</el-checkbox>
          </option-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import browser from '@/modules/Browser';
import OptionRow from './OptionRow';

export default {
  components: {
    'option-row': OptionRow
  },

  data() {
    return {
      clearAll: null,
      clearDataTypes: app.storageItems.clearDataTypes,
      clickExtensionIconTo: app.storageItems.clickExtensionIconTo,
      displayNotification: app.storageItems.displayNotification
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

    clearDataTypes: {
      handler: function(val) {
        browser.storage.local.set({
          clearDataTypes: val
        });
      },
      deep: true
    }
  },

  computed: {
    indeterminate() {
      let checkedExists = false;
      let uncheckedExists = false;

      Object.keys(this.clearDataTypes).forEach(type => {
        if (this.clearDataTypes[type]) {
          checkedExists = true;
        } else {
          uncheckedExists = true;
        }
      });

      this.clearAll = checkedExists && !uncheckedExists;
      return checkedExists && uncheckedExists;
    }
  },

  methods: {
    handleClearAllChanged(val) {
      Object.keys(this.clearDataTypes).forEach(type => {
        this.clearDataTypes[type] = !!val;
      });
    }
  }
}
</script>
