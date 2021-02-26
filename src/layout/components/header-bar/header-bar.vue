<template>
  <div class="header-bar">
    <Icon :type="icon" size="26" @click.native="handleChange"></Icon>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'header-bar',
  data () {
    return {
      icon: 'md-menu'
    }
  },
  props: {
    collapsed: {
      type: Boolean
    }
  },
  methods: {
    handleChange () {
      this.$emit('on-collapsed', !this.collapsed)
    }
  }
}
</script>

<style scoped lang="scss">
.header-bar {
  i.ivu-icon {
    cursor: pointer;
    margin-right: 30px;
  }
}
</style>
