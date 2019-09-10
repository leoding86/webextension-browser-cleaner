<template>
  <el-container>
    <el-header>
      <div class="header-left">
        <h1>
          <img class="header-icon"
            src="../assets/icon.png" height="60" alt="Browser Cleaner">
          <span>Browser Cleaner</span>
        </h1>
      </div>
      <div class="header-right">
        <div class="support-buttons-wrapper">
          <el-button size="medium" round class="support-button"
            @click="openInTab('https://chrome.google.com/webstore/detail/bmplnhifhfmmkjmeffbbahieajpmonla')">
            <img src="@/assets/chrome-es.png"> Give 5 Stars!</el-button>
          <el-button size="medium" round class="support-button"
            @click="openInTab('https://github.com/leoding86/webextension-browser-cleaner')">
            <img src="@/assets/github.svg"> Star It!</el-button>
          <!-- <el-button size="medium" round class="support-button"
            @click="openInTab('https://www.patreon.com/leoding')">
            <img src="@/assets/patreon.png"> Become a Patron!</el-button> -->
          <el-divider direction="vertical"></el-divider>
          <el-badge value="4.8 ⭐">
            <el-button size="medium" round class="support-button"
              @click="openInTab('https://chrome.google.com/webstore/detail/pixiv-toolkit/ajlcnbbeidbackfknkgknjefhmbngdnj')">
              <img src="@/assets/pixiv-toolkit.png"> Try Pixiv Toolkit</el-button>
          </el-badge>
        </div>
      </div>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
    <el-footer class="footer">
      <div class="footer-left">{{ versionName }}</div>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      versionName: this.$root.$data.storageItems.versionName
    }
  },

  methods: {
    openInTab(url) {
      window.open(url, '_blank');
    }
  }
}
</script>

<style lang="scss">
.el-header {
  .header-left {
    float: left;
  }

  .header-right {
    float: right;
  }

  h1 {
    display: inline;

    span {
      position: relative;
      font-size: 20px;
      color:#13b693;
      text-shadow: 0px 1px 0 #0d5d4c;
      top: 3px;
    }

    .header-icon {
      margin-right: 10px;
      border-radius: 30px;
      box-shadow: 0px 3px 0px #069576;
      vertical-align: middle;
    }
  }
}

.support-buttons-wrapper {
  position: relative;
  top: 10px;
  text-align: right;

  .support-button {
    position: relative;
    padding-left: 50px!important;
    overflow: hidden;
    box-shadow:0px 3px 0px #ddd;

    img {
      position: absolute;
      width: 46px;
      top: -5px;
      left: -3px;
    }
  }

  .el-badge__content.is-fixed  {
    right: 30px;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  line-height: 60px;
  width: 100%;
  box-sizing: border-box;

  .footer-left {
    float: left;
  }

  .footer-right {
    float: right;
  }
}
</style>
