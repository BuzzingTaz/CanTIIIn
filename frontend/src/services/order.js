import axios from 'axios'
import { setToken } from './auth'

const getBuyerOrders = async () => {
    setToken()
    const res = await axios.get('/orders/buyer')
    return res.data
}

const getVendorOrders = async () => {
    setToken()
    const res = await axios.get('/orders/vendor')
    return res.data
}

const acceptOrder = async (d) => {
    setToken()
    const res = await axios.post('/orders/accept', d)
    return res.data
}

const rejectOrder = async (d) => {
    setToken()
    const res = await axios.post('/orders/reject', d)
    return res.data
}

const moveOrder = async (d) => {
    setToken()
    const res = await axios.post('/orders/move', d)
    return res.data
}

const pickupOrder = async (d) => {
    setToken()
    const res = await axios.post('/orders/pickup', d)
    return res.data
}

const rateOrder = async (d) => {
    setToken()
    const res = await axios.post('/orders/rate', d)
    return res.data
}

const getStats = async () => {
    setToken()
    const res = await axios.get('/orders/stats')
    return res.data
}

const getBatchStats = async () => {
    setToken()
    const res = await axios.get('/orders/batchstats')
    return res.data
}

const getAgeStats = async () => {
    setToken()
    const res = await axios.get('/orders/agestats')
    return res.data
}

export {
    getBuyerOrders, getVendorOrders, acceptOrder, rejectOrder, moveOrder, pickupOrder, rateOrder, getStats, getBatchStats, getAgeStats
}