import menus from '@/router/menus'

export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login')
  },
  ...menus
]
