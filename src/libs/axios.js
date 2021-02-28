import axios from 'axios'
import router from '@/router'
import { getToken } from './util'
import { Message, Modal } from 'view-design'

class HttpRequest {
  constructor () {
    this.options = {
      url: '',
      method: ''
    }
    // 存储请求队列
    this.queue = {}
  }

  // 销毁请求实例
  destroy (url) {
    delete this.queue[url]
    const queue = Object.keys(this.queue)
    return queue.length
  }

  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      const accessToken = getToken()
      if (accessToken) {
        config.headers.Authorization = accessToken
      }
      return config
    }, error => {
      return Promise.reject(error)
    })

    // 响应拦截
    instance.interceptors.response.use(response => {
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
      } else {
        return res
      }
    }, error => {
      const { response } = error
      if (response.hasOwnProperty('data')) {
        Message.error(response.data.msg)
        return Promise.reject(response.data)
      } else {
        Message.error(error)
        return Promise.reject(error)
      }
    })
  }

  // 请求实例
  create () {
    const conf = {
      baseURL: process.env.VUE_APP_BASE_API,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-URL-PATH': location.pathname
      }
    }
    return axios.create(conf)
  }

  // 合并请求实例
  mergeRequest (instance = []) {
    //
  }

  // 请求实例
  request (options) {
    const instance = this.create()
    this.interceptors(instance, options.url)
    options = Object.assign({}, options)
    this.queue[options.url] = instance
    return instance(options)
  }
}

export default HttpRequest
