import axios from 'axios'

export default {
  getCustomerInfoListByKeywords (body) {
    return axios({
      url: 'http://27.223.104.6:32880/base/api/customerinfo/list',
      method: 'post',
      data: body
    })
  }
}
