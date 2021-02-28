import Cookies from 'js-cookie'
import config from '@/config/index'
import { forEach, hasOneOf, objEqual } from '@/libs/tools'
const { title, tokenExpires, useI18n } = config

export const TOKEN_KEY = 'access_token'

export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, { expires: tokenExpires || 1 })
}

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  return token || false
}

export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}

const showThisMenuEle = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (hasOneOf(item.meta.access, access)) return true
    else return false
  } else return true
}

/**
 * 根据路由列表得到菜单列表
 * @param list
 * @param access
 * @returns {[]}
 */
export const getMenuByRouter = (list, access) => {
  const res = []
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hidden)) {
      const obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      if ((hasChild(item) || (item.meta && item.meta.showAlways)) && showThisMenuEle(item, access)) {
        obj.children = getMenuByRouter(item.children, access)
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href
      if (showThisMenuEle(item, access)) res.push(obj)
    }
  })
  return res
}

export const getRouteTitleHandled = (route) => {
  const router = { ...route }
  const meta = { ...route.meta }
  let title = ''
  if (meta.title) {
    if (typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true
      title = meta.title(router)
    } else title = meta.title
  }
  meta.title = title
  router.meta = meta
  return router
}

export const showTitle = (item, vm) => {
  let { title, __titleIsFunction__ } = item.meta
  if (!title) return
  if (useI18n) {
    if (title.includes('{{') && title.includes('}}') && useI18n) title = title.replace(/({{[\s\S]+?}})/, (m, str) => str.replace(/{{([\s\S]*)}}/, (m, _) => vm.$t(_.trim())))
    else if (__titleIsFunction__) title = item.meta.title
    else title = vm.$t(item.name)
  } else title = (item.meta && item.meta.title) || item.name
  return title
}

/**
 * 本地存储和获取标签导航列表
 * @param list
 */
export const setTagNavListInLocalstorage = list => {
  localStorage.setItem('tagNaveList', JSON.stringify(list))
}

/**
 * 其中的每个元素只包含路由原信息中的name, path, meta三项
 * @returns {any|*[]}
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.getItem('tagNaveList')
  return list ? JSON.parse(list) : []
}

/**
 * 用于找到路由列表中name为home的对象
 * @param routers 路由列表数组
 * @param homeName
 * @returns {{}|{name}}
 */
export const getHomeRoute = (routers, homeName = 'home') => {
  let i = -1
  const len = routers.length
  let homeRoute = {}
  while (++i < len) {
    const item = routers[i]
    if (item.children && item.children.length) {
      const res = getHomeRoute(item.children, homeName)
      if (res.name) return res
    } else {
      if (item.name === homeName) homeRoute = item
    }
  }
  return homeRoute
}

/**
 * @param list 现有标签导航列表
 * @param newRoute 新添加的路由原信息对象
 * @returns {*[]} 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const { name, path, meta } = newRoute
  const newList = [...list]
  if (newList.findIndex(item => item.name === name) >= 0) return newList
  else newList.push({ name, path, meta })
  return newList
}

/**
 * @param list 标签列表
 * @param route 当前关闭的标签的name
 * @returns {*}
 */
export const getNextRoute = (list, route) => {
  let res = {}
  if (list.length === 2) {
    res = getHomeRoute(list)
  } else {
    const index = list.findIndex(item => routeEqual(item, route))
    if (index === list.length - 1) res = list[list.length - 2]
    else res = list[index + 1]
  }
  return res
}

/**
 * @param times 回调函数需要执行的次数
 * @param callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1
  while (++i < times) {
    callback(i)
  }
}

/**
 * 根据name/params/query判断两个路由对象是否相等
 * @param route1
 * @param route2
 * @returns {*}
 */
export const routeEqual = (route1, route2) => {
  const params1 = route1.params || {}
  const params2 = route2.params || {}
  const query1 = route1.query || {}
  const query2 = route2.query || {}
  return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2)
}

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 * @param tagNavList
 * @param routeItem
 * @returns {boolean}
 */
export const routeHasExist = (tagNavList, routeItem) => {
  const len = tagNavList.length
  let res = false
  doCustomTimes(len, (index) => {
    if (routeEqual(tagNavList[index], routeItem)) res = true
  })
  return res
}

/**
 * 根据当前跳转的路由设置显示在浏览器标签的title
 * @param routeItem 路由对象
 * @param vm Vue实例
 */
export const setTitle = (routeItem, vm) => {
  const handledRoute = getRouteTitleHandled(routeItem)
  const pageTitle = showTitle(handledRoute, vm)
  const resTitle = pageTitle ? `${title} - ${pageTitle}` : title
  window.document.title = resTitle
}

/**
 * @param access 用户权限数组，如 ['super_admin', 'admin']
 * @param route 路由列表
 * @returns {boolean|*}
 */
const hasAccess = (access, route) => {
  if (route.meta && route.meta.access) return hasOneOf(access, route.meta.access)
  else return true
}

/**
 * 用户是否可跳转到该页
 * @param name 即将跳转的路由name
 * @param access 用户权限数组
 * @param routes 路由列表
 * @returns {*}
 */
export const canTurnTo = (name, access, routes) => {
  const routePermissionJudge = (list) => {
    return list.some(item => {
      if (item.children && item.children.length) {
        return routePermissionJudge(item.children)
      } else if (item.name === name) {
        return hasAccess(access, item)
      }
    })
  }

  return routePermissionJudge(routes)
}
