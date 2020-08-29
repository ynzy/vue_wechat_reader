import request from '@/utils/request'

/**
 * 创建图书
 */
export function createBook({ ...data }) {
  return request({
    url: '/book/create',
    method: 'post',
    data
  })
}