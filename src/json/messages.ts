import request from '@/utils/requestJSON'

export function getMessages() {
  return request({
    url: "/storage/messages.json",
    method: "get",
  });
}