import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Typography } from "@mui/material"
import Container from "@mui/material/Container"

import { getUser } from "../../services/auth"


const Title = () => {

    const navigate = useNavigate()

    useEffect(async () => { 
        var user = await getUser()
        if (user) {
            navigate('/dashboard')
        }
    },[])

    return (
        <Container>
            <Typography align='center'>
                <h1>CANTIIIN</h1>
                <h2>Home to all canteens@IIITH</h2>
           </Typography> 
        </Container>
    )
}

export default Title