import { login, logout, getUserInfo } from '@/api/user'
import { setToken, getToken } from '@/libs/util'
import avatar from '@/assets/images/avatar.jpeg'

export default {
  state: {
    userId: '',
    userName: '',
    avatar: '',
    realName: '',
    email: '',
    access: '',
    token: getToken(),
    hasGetInfo: false
  },
  getters: {

  },
  mutations: {
    setAvatar (state, avatarPath) {
      state.avatar = avatarPath || avatar
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setRealName (state, realName) {
      state.realName = realName
    },
    setEmail (state, email) {
      state.email = email
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { username, password, code }) {
      username = username.trim()
      return new Promise((resolve, reject) => {
        login({
          username,
          password,
          code
        }).then(res => {
          const data = res.data
          commit('setToken', `${data.token_type} ${data.access_token}`)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogout ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('setToken', '')
          commit('setAccess', [])
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token).then(res => {
            const data = res.data
            commit('setAvatar', data.avatar)
            commit('setUserName', data.username)
            commit('setRealName', data.real_name)
            commit('setEmail', data.email)
            commit('setUserId', data.id)
            commit('setAccess', data.access)
            commit('setHasGetInfo', true)
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
