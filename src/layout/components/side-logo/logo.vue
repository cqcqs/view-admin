<template>
  <div class="logo-con">
    <img :src="maxLogo" v-if="!collapsed" />
    <img :src="minLogo" v-else />
  </div>
</template>

<script>
import minLogo from '@/assets/images/logo-min.jpg'
import maxLogo from '@/assets/images/logo.jpg'

export default {
  name: 'logo',
  data () {
    return {
      maxLogo,
      minLogo
    }
  },
  props: {
    collapsed: {
      type: Boolean
    }
  }
}
</script>

<style scoped lang="scss">
.logo-con {
  height: 64px;
  padding: 10px;
  text-align: center;
  img {
    height: 44px;
    width: auto;
  }
}
</style>
