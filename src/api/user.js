import axios from '@/libs/api.request'

export const login = ({ username, password, code }) => {
  const data = {
    username,
    password,
    code
  }

  return axios.request({
    url: 'passport/login',
    data,
    method: 'post'
  })
}

export const getUserInfo = () => {
  return axios.request({
    url: 'passport',
    method: 'get'
  })
}

export const logout = () => {
  return axios.request({
    url: 'passport/logout',
    method: 'post'
  })
}
