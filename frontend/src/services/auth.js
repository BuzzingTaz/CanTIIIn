import axios from "axios"

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000/api"

const LoginUser = async (user) => {
    const res = await axios.post("/auth/login", user)

    if (res.data.status === 1) {
        console.log(res.data.error)
    }

    return res.data
}

const LoginGoogleUser = async (data) => {
  const res = await axios.post("/auth/google", data)
  return res.data
}

const RegisterUser = async (user) => {
    const res = await axios.post("/auth/register", user)

    if (res.data.status === 1) {
        console.log(res.data.error)
    }

    return res.data
}

const setToken = () => {
  let auth = "";
  try {
    auth = window.localStorage.getItem('Authorization');
  } catch {
    auth = "";
  }

  axios.defaults.headers.common['Authorization'] = auth;
}

const removeToken = () => {
  try {
    window.localStorage.removeItem('Authorization')
  } catch {
    
  }
}

const getUser = async () => {
    setToken()
    const res = await axios.post("/user/token")
    if (res.data.status === 1)
    {
        removeToken()
        return null
    }
    return res.data
}

export { LoginUser, RegisterUser, LoginGoogleUser, getUser, setToken, removeToken }