<template>
  <Dropdown placement="right-start" @on-click="handleClick">
    <a href="javascript:void(0)" class="drop-menu-a">
      <Icon :type="menu.meta.icon"></Icon>
    </a>
    <DropdownMenu slot="list">
      <DropdownItem v-for="item in menu.children" :key="item.name" :name="item.name">{{ item.meta.title }}</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>

<script>
export default {
  name: 'collapsed-menu',
  props: {
    menu: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    handleClick (name) {
      this.$emit('on-click', name)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
