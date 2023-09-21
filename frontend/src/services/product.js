import axios from 'axios'
import { setToken } from "./auth"

const getProductList = async () => {
    setToken()
    const res = await axios.get('/products')
    return res.data
}

const placeOrder = async (e) => {
    setToken()
    const res = await axios.post("/orders/new", e)
    return res.data
}

const toggleFav = async (e) => {
    setToken()
    const res = await axios.post("/products/favourite", e)
    return res.data
}

const getVendorProducts = async () => {
    setToken()
    const res = await axios.get('/products/vendor')
    return res.data
}

const addProduct = async (d) => {
    setToken()
    const res = await axios.post('/products/new', d)
    return res.data
}

const editProduct = async (d) => {
    setToken()
    const res = await axios.post('products/update', d)
    return res.data
}

const deleteProduct = async (d) => {
    const res = await axios.post('products/delete', d)
    return res.data
}

export { getProductList, placeOrder, toggleFav, getVendorProducts, addProduct, editProduct, deleteProduct }