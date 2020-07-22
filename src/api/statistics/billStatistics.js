import axios from 'axios'

export default {
  selectProfitStatistics (query) {
    return axios({
      url: '/api/statistics/selectProfitStatistics',
      method: 'post',
      data: query
    })
  },
  selectArrearsStatistics (query) {
    return axios({
      url: '/api/statistics/selectArrearsStatistics',
      method: 'post',
      data: query
    })
  },
  selectUnpaidStatistics (query) {
    return axios({
      url: '/api/statistics/selectUnpaidStatistics',
      method: 'post',
      data: query
    })
  },
  selectPaymentStatistics (query) {
    return axios({
      url: '/api/statistics/selectPaymentStatistics',
      method: 'post',
      data: query
    })
  },
  selectContainerCountStatistics (query) {
    return axios({
      url: '/api/statistics/selectContainerCountStatistics',
      method: 'post',
      data: query
    })
  },
  selectProfitDetailStatistics (query) {
    return axios({
      url: '/api/statistics/selectProfitDetailStatistics',
      method: 'post',
      data: query
    })
  },
  selectArrearsDetailStatistics (query) {
    return axios({
      url: '/api/statistics/selectArrearsDetailStatistics',
      method: 'post',
      data: query
    })
  },
  selectUnpaidDetailStatistics (query) {
    return axios({
      url: '/api/statistics/selectUnpaidDetailStatistics',
      method: 'post',
      data: query
    })
  },
  selectPaymentDetailStatistics (query) {
    return axios({
      url: '/api/statistics/selectPaymentDetailStatistics',
      method: 'post',
      data: query
    })
  },
  selectContainerCountDetailStatistics (query) {
    return axios({
      url: '/api/statistics/selectContainerCountDetailStatistics',
      method: 'post',
      data: query
    })
  },
  getMyDepartment () {
    return axios({
      url: '/api/depart/getCurrentUserDepartment',
      method: 'get'
    })
  },
  getCurrentCompanyAllDepartment () {
    return axios({
      url: '/api/depart/currentCompany/department/all',
      method: 'get'
    })
  },
  exportData (queryExcelBody) {
    return axios({
      url: '/api/statistics/exportData',
      method: 'post',
      data: queryExcelBody,
      responseType: 'blob'
    })
  },
  selectSalesStatistics (query) {
    return axios({
      url: '/api/statistics/selectSalesStatistics',
      method: 'post',
      data: query
    })
  },
  selectSalesArrearsStatistics (query) {
    return axios({
      url: '/api/statistics/selectSalesArrearsStatistics',
      method: 'post',
      data: query
    })
  },
  selectSalesCustomerDetailStatistics (query) {
    return axios({
      url: '/api/statistics/selectSalesCustomerDetailStatistics',
      method: 'post',
      data: query
    })
  },
  businessObtain () {
    return axios({
      url: '/api/statistics/businessObtain',
      method: 'post'
    })
  }
}
