<template>
  <Dropdown trigger="click">
    <a href="javascript:void(0)">
      语言
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
    </a>
    <DropdownMenu slot="list">
      <DropdownItem>中文简体</DropdownItem>
      <DropdownItem>中文繁体</DropdownItem>
      <DropdownItem>English</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>

<script>
export default {
  name: 'drop-language'
}
</script>

<style scoped>

</style>
