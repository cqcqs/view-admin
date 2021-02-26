<template>
  <div>
    <Menu ref="menu" theme="dark" :accordion="accordion" :active-name="activeName" :open-names="openedNames" width="auto" :class="menuitemClasses" v-show="!collapsed" @on-select="handleSelect">
      <template v-for="item in list">
        <!-- 一级菜单 -->
        <template v-if="item.children && item.children.length === 1">
          <menu-item :name="item.children[0].name" :key="item.children[0].name">
            <Icon :type="item.children[0].meta.icon" />
            <span>{{ item.children[0].meta.title }}</span>
          </menu-item>
        </template>
        <!-- 二级菜单 -->
        <template v-else>
          <Submenu :key="item.name" :name="item.name">
            <template slot="title">
              <Icon :type="item.meta.icon" />
              <span>{{ item.meta.title }}</span>
            </template>
            <menu-item v-for="subItem in item.children" :name="subItem.name" :key="subItem.name">
              <Icon v-if="subItem.meta.icon" :type="subItem.meta.icon" />
              <span>{{ subItem.meta.title }}</span>
            </menu-item>
          </Submenu>
        </template>
      </template>
    </Menu>
    <div class="menu-collapsed" v-show="collapsed">
      <template v-for="item in list">
        <Tooltip v-if="item.children && item.children.length === 1" :key="item.children[0].name" :content="item.children[0].meta.title" placement="right">
          <a class="drop-menu-a" @click="handleSelect(item.children[0].name)"><Icon :type="item.children[0].meta.icon"></Icon></a>
        </Tooltip>
        <collapsed-menu v-else :menu="item" :key="item.name" @on-click="handleSelect"/>
      </template>
    </div>
  </div>
</template>

<script>
import CollapsedMenu from './collapsed-menu'
import { getUnion } from '@/libs/tools'

export default {
  name: 'side-menu',
  props: {
    collapsed: {
      type: Boolean
    },
    list: {
      type: Array,
      default () {
        return []
      }
    },
    accordion: Boolean,
    activeName: {
      type: String,
      default: ''
    },
    openNames: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      openedNames: []
    }
  },
  components: {
    CollapsedMenu
  },
  methods: {
    handleSelect (name) {
      this.$emit('on-select', name)
    },
    getOpenedNamesByActiveName (name) {
      return this.$route.matched.map(item => item.name).filter(item => item !== name)
    },
    updateOpenName (name) {
      if (name === this.$config.homeName) this.openedNames = []
      else this.openedNames = this.getOpenedNamesByActiveName(name)
    }
  },
  computed: {
    menuitemClasses () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    }
  },
  watch: {
    activeName () {
      if (this.accordion) this.openedNames = this.getOpenedNamesByActiveName(name)
      else this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
    },
    openedNames () {
      this.$nextTick(() => {
        this.$refs.menu.updateOpened()
      })
    }
  },
  created () {
    this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
  }
}
</script>

<style lang="scss">
.drop-menu-a {
  display: inline-block;
  padding: 6px 22px;
  width: 100%;
  text-align: center;
  color: #FFF;

  i.ivu-icon {
    font-size: 20px;
  }

  &:hover{
    color: #FFF;
  }
}
</style>
