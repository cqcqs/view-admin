import Layout from '@/layout/BaseLayout'

export default [
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/index'),
        meta: { title: '首页', icon: 'md-home' }
      }
    ]
  },
  {
    path: '/order',
    name: 'order',
    redirect: '/order/index',
    component: Layout,
    meta: { title: '订单管理', icon: 'md-cart' },
    children: [
      {
        path: 'index',
        name: 'orderList',
        component: () => import('@/views/order/index'),
        meta: { title: '订单列表' }
      },
      {
        path: 'dispute',
        name: 'orderDispute',
        component: () => import('@/views/order/dispute'),
        meta: { title: '纠纷处理' }
      }
    ]
  },
  {
    path: '/channel',
    name: 'channel',
    redirect: '/channel/shop',
    component: Layout,
    meta: { title: '渠道管理', icon: 'md-desktop' },
    children: [
      {
        path: 'shop',
        name: 'shopChannel',
        component: () => import('@/views/channel/shop'),
        meta: { title: '销售平台' }
      },
      {
        path: 'logistics',
        name: 'logisticsChannel',
        component: () => import('@/views/channel/logistics'),
        meta: { title: '物流渠道' }
      }
    ]
  },
  {
    path: '/product',
    name: 'product',
    redirect: '/product/index',
    component: Layout,
    meta: { title: '产品管理', icon: 'ios-leaf' },
    children: [
      {
        path: 'index',
        name: 'productList',
        component: () => import('@/views/product/index'),
        meta: { title: '产品列表', icon: 'ios-leaf' }
      }
    ]
  }
]
