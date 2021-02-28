import axios from 'axios'
import router from '@/router'
import { getToken } from './util'
import { Message, Modal } from 'view-design'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // request timeout
  timeout: 5000
})

// request interceptor
service.interceptors.request.use(
  config => {
    const accessToken = getToken()
    if (accessToken) {
      config.headers.Authorization = accessToken
    }
    return config
  },

  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data

    if (res.code !== 200) {
      Message.error(res.msg || 'Error')

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 10001) {
        Modal.confirm({
          title: 'Confirm logout',
          content: 'You have been logged out, you can cancel to stay on this page, or log in again',
          onOk: () => {
            Modal.remove()
            router.push({
              name: 'login'
            })
          }
        })
      }

      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    const { response } = error
    if (response.hasOwnProperty('data')) {
      Message.error(response.data.msg)
      return Promise.reject(response.data)
    } else {
      Message.error(error)
      return Promise.reject(error)
    }
  }
)

export default service
