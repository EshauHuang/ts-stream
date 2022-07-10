import request from '@/utils/requestJSON'

export function getUsers() {
  return request({
    url: "/storage/users.json",
    method: "get",
  });
}