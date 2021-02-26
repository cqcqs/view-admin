<template>
  <Dropdown @on-click="handleClick">
    <a href="javascript:void(0)">
      <Badge dot>
        <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
    </a>
    <DropdownMenu slot="list">
      <DropdownItem>
        消息中心<Badge style="margin-left: 10px" :count="6"></Badge>
      </DropdownItem>
      <DropdownItem>用户中心</DropdownItem>
      <DropdownItem name="logout">退出登录</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'drop-user',
  methods: {
    ...mapActions([
      'handleLogout'
    ]),
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
      }
    },
    logout () {
      this.handleLogout().then(res => {
        this.$router.push({
          name: 'login'
        })
      })
    }
  }
}
</script>

<style>
.ivu-badge-dot{
  top: 16px !important;
}
</style>
