<template>
  <el-row class="option-row">
    <el-col :span="14" class="option-label">
      {{ label }}
      <el-tooltip v-if="tip" :content="tip"
        placement="right">
        <el-button circle
          type="text"
          size="small"
          icon="el-icon-info"></el-button>
      </el-tooltip>
    </el-col>
    <el-col :span="10" class="option-control" :class="{'option-control-align-left': controlAlignLeft}">
      <slot></slot>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    label: {
      required: true,
      type: String
    },

    controlAlignLeft: {
      type: Boolean,
      default: false
    },

    tip: {
      type: String
    }
  }
}
</script>

<style lang="scss">
.option-row {
  margin: 5px 0;

  .option-label {
    line-height: 32px;
    font-size: 14px;
  }

  .option-control {
    text-align: right;
    line-height: 32px;
  }

  .option-control-align-left {
    text-align: left;
  }
}
</style>
