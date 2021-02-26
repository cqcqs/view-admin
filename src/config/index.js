export default {
  /**
   * 配置显示在浏览器标签的title
   */
  title: 'admin',
  /**
   * token在Cookie中存储的天数，默认1天
   */
  tokenExpires: 1,
  /**
   * 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  /**
   * 是否使用国际化，默认为false
   * 如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   * 用来在菜单中显示文字
   */
  useI18n: false,
  /**
   * api请求基础路径
   */
  baseUrl: {
    // 测试环境
    dev: 'https://www.easy-mock.com/mock/5add9213ce4d0e69998a6f51/iview-admin/',
    // 生产环境
    pro: 'https://produce.com'
  }
}
