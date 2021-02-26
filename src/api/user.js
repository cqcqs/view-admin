import axios from '@/libs/api.request'

export const login = ({ username, password, code }) => {
  const data = {
    username,
    password,
    code
  }
  console.log(data)
  return axios.request({
    url: 'login',
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: 'get_info',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}
