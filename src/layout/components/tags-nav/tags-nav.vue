<template>
  <div class="tags-nav">
    <div class="close-con">
      <Dropdown transfer @on-click="handleCloseTags" placement="bottom-end" style="margin-top: 7px;">
        <Button size="small" type="text">
          <Icon :size="18" type="ios-close-circle-outline" />
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem name="close-all">关闭所有</DropdownItem>
          <DropdownItem name="close-others">关闭其他</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <!-- < -->
    <div class="btn-con btn-con-left">
      <Button type="text" @click="handleScroll(240)">
        <Icon :size="18" type="ios-arrow-back" />
      </Button>
    </div>
    <!-- > -->
    <div class="btn-con btn-con-right">
      <Button type="text" @click="handleScroll(-240)">
        <Icon :size="18" type="ios-arrow-forward" />
      </Button>
    </div>
    <div class="scroll-outer" ref="scrollOuter">
      <div class="scroll-body" ref="scrollBody" :style="{left: tagBodyLeft + 'px'}">
        <transition-group name="taglist-moving-animation">
          <Tag
            type="dot"
            ref="tagsPageOpened"
            class="tag-nav"
            v-for="(tag, index) in list"
            :key="`tag-nav-${index}`"
            :name="tag.name"
            :data-route-item="tag"
            @on-close="handleClose(tag)"
            @click.native="handleClick(tag)"
            :closable="tag.name !== $config.homeName"
            :color="isCurrentTag(tag) ? 'primary' : 'default'"
          >{{ showTitleInside(tag) }}</Tag>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import { routeEqual, showTitle } from '@/libs/util'

export default {
  name: 'tags-nav',
  props: {
    value: Object,
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      tagBodyLeft: 0,
      outerPadding: 4
    }
  },
  computed: {
    currentRouteObj () {
      const { name, params, query } = this.value
      return { name, params, query }
    }
  },
  methods: {
    close (route) {
      const res = this.list.filter(item => !routeEqual(route, item))
      this.$emit('on-close', res, undefined, route)
    },
    handleClick (tag) {
      this.$emit('input', tag)
    },
    handleClose (tag) {
      this.close(tag)
    },
    handleScroll (offset) {
      const outerWidth = this.$refs.scrollOuter.offsetWidth
      const bodyWidth = this.$refs.scrollBody.offsetWidth
      if (offset > 0) {
        this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset)
      } else {
        if (outerWidth < bodyWidth) {
          if (this.tagBodyLeft < -(bodyWidth - outerWidth)) {
            // this.tagBodyLeft = this.tagBodyLeft
          } else {
            this.tagBodyLeft = Math.max(this.tagBodyLeft + offset, outerWidth - bodyWidth)
          }
        } else {
          this.tagBodyLeft = 0
        }
      }
    },
    handleCloseTags (type) {
      if (type === 'close-all') {
        // 关闭所有，除了home
        const res = this.list.filter(item => item.name === this.$config.homeName)
        this.$emit('on-close', res, 'all')
      } else if (type === 'close-others') {
        // 关闭除当前页和home页的其他页
        const res = this.list.filter(item => routeEqual(this.currentRouteObj, item) || item.name === this.$config.homeName)
        this.$emit('on-close', res, 'others', this.currentRouteObj)
        setTimeout(() => {
          this.getTagElementByRoute(this.currentRouteObj)
        }, 100)
      }
    },
    showTitleInside (tag) {
      return showTitle(tag, this)
    },
    isCurrentTag (tag) {
      return routeEqual(this.currentRouteObj, tag)
    },
    moveToView (tag) {
      const outerWidth = this.$refs.scrollOuter.offsetWidth
      const bodyWidth = this.$refs.scrollBody.offsetWidth
      if (bodyWidth < outerWidth) {
        this.tagBodyLeft = 0
      } else if (tag.offsetLeft < -this.tagBodyLeft) {
        // 标签在可视区域左侧
        this.tagBodyLeft = -tag.offsetLeft + this.outerPadding
      } else if (tag.offsetLeft > -this.tagBodyLeft && tag.offsetLeft + tag.offsetWidth < -this.tagBodyLeft + outerWidth) {
        // 标签在可视区域
        this.tagBodyLeft = Math.min(0, outerWidth - tag.offsetWidth - tag.offsetLeft - this.outerPadding)
      } else {
        // 标签在可视区域右侧
        this.tagBodyLeft = -(tag.offsetLeft - (outerWidth - this.outerPadding - tag.offsetWidth))
      }
    },
    getTagElementByRoute (route) {
      this.$nextTick(() => {
        this.refsTag = this.$refs.tagsPageOpened
        this.refsTag.forEach((item, index) => {
          if (routeEqual(route, item.$attrs['data-route-item'])) {
            const tag = this.refsTag[index].$el
            this.moveToView(tag)
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.tags-nav {
  position: relative;
  border-top: 1px solid #F0F0F0;
  border-bottom: 1px solid #F0F0F0;
  height: 40px;
  .close-con{
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 32px;
    background: #fff;
    text-align: center;
    z-index: 10;
  }
  .btn-con{
    position: absolute;
    top: 0;
    height: 100%;
    background: #fff;
    padding-top: 3px;
    z-index: 10;

    button {
      padding: 6px 4px;
      line-height: 14px;
      text-align: center;
    }
    &-left{
      left: 0;
    }
    &-right{
      right: 32px;
      border-right: 1px solid #F0F0F0;
    }
  }
  .scroll-outer {
    position: absolute;
    left: 28px;
    right: 61px;
    top: 0;
    bottom: 0;
    box-shadow: 0px 0 3px 2px rgba(100,100,100,.1) inset;
    .scroll-body {
      height: calc(100% - 1px);
      display: inline-block;
      padding: 1px 4px 0;
      position: absolute;
      overflow: visible;
      white-space: nowrap;
      transition: left .3s ease;
      .tag-nav{
        cursor: pointer;
      }
    }
  }
}
</style>
