import axios from 'axios'

import { setToken } from './auth'

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000/api"

const GetUserProfile = async () => {
    setToken()
    const res = await axios.post("/user/profile")

    return res.data
}

const UpdateUserProfile = async (user) => {
    setToken()
    const res = await axios.post("/user/profile/update", user)

    return res.data
}

const GetWallet = async () => {
    const res = await axios.get("/user/wallet")

    return res.data
}

const UpdateWallet = async (v) => {
    const res = await axios.post("/user/wallet", v)

    return res.data
}

export { GetUserProfile, UpdateUserProfile, GetWallet, UpdateWallet }