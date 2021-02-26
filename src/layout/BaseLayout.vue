<template>
  <Layout class="layout">
    <Sider ref="side1" hide-trigger collapsible :collapsed-width="64" v-model="collapsed">
      <logo :collapsed="collapsed" />
      <side-menu ref="sideMenu" accordion :collapsed="collapsed" :active-name="$route.name" :list="menuList" @on-select="turnToPage" />
    </Sider>
    <Layout>
      <Header class="layout-header">
        <header-bar :collapsed="collapsed" @on-collapsed="handleChangeCollapsed">
          <drop-user style="float: right;"/>
          <drop-language style="margin-right: 10px;float: right;" />
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;float:right;" />
        </header-bar>
      </Header>
      <Content>
        <Layout>
          <div>
            <tags-nav :value="$route" @input="handleClickTag" @on-close="handleCloseTag" :list="tagList"></tags-nav>
          </div>
          <Content class="layout-content">
            <keep-alive>
              <router-view/>
            </keep-alive>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>

<script>
import Logo from './components/side-logo/logo'
import SideMenu from './components/side-menu/side-menu'
import HeaderBar from './components/header-bar/header-bar'
import DropLanguage from '@/layout/components/header-bar/drop-language'
import DropUser from '@/layout/components/header-bar/drop-user'
import Fullscreen from '@/layout/components/header-bar/fullscreen'
import TagsNav from '@/layout/components/tags-nav/tags-nav'
import { mapMutations } from 'vuex'
import { getNewTagList, routeEqual } from '@/libs/util'

export default {
  name: 'BaseLayout',
  data () {
    return {
      collapsed: false,
      isFullscreen: false
    }
  },
  components: {
    TagsNav,
    Fullscreen,
    DropUser,
    DropLanguage,
    HeaderBar,
    Logo,
    SideMenu
  },
  computed: {
    menuList () {
      return this.$store.getters.menuList
    },
    tagList () {
      return this.$store.state.app.tagNavList
    }
  },
  methods: {
    ...mapMutations([
      'setTagNavList',
      'addTag',
      'closeTag'
    ]),
    handleChangeCollapsed (collapsed) {
      this.collapsed = collapsed
    },
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') {
        name = route
      } else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleClickTag (tag) {
      this.turnToPage(tag)
    },
    handleCloseTag (res, type, route) {
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.homeName)
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route)
          }
        }
      }
      this.setTagNavList(res)
      // 没有标签页，跳转到主页
      if (!res || !res.length) {
        this.$router.push({ name: this.$config.homeName })
      }
    }
  },
  watch: {
    '$route' (newRoute) {
      const { name, query, params, meta } = newRoute
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      })
      this.setTagNavList(getNewTagList(this.tagList, newRoute))
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    }
  },
  mounted () {
    this.setTagNavList()
    const { name, params, query, meta } = this.$route
    this.addTag({
      route: { name, params, query, meta }
    })
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      })
    }
  }
}
</script>

<style scoped lang="scss">
.layout{
  height: 100vh;
  .layout-header{
    padding: 0 20px;
    background-color: #FFF;
  }
  .layout-content{
    padding: 20px;
    height: calc(100vh - 104px);
    overflow: auto;
    background-color: #fff;
  }
}
</style>
