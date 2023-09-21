import { Container, Paper, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import BuyerOrders from "../templates/BuyerOrders"
import VendorOrders from "../templates/VendorOrders"

import { getUser } from "../../services/auth"

const Orders = () => {

    const [UserType, setUserType] = useState('');
    const navigate = useNavigate()

    useEffect(async () => {
        const u = await getUser()
        if (!u) navigate('/login')
        if (u.type === 'vendor') {
            setUserType('vendor')
        } else {
            setUserType('buyer')
        }
    }, [])

    return (
        <Container maxWidth="xl">
        <Paper sx={{
            backgroundColor: '#248BD9',
            color: "#0B1F5D",
            marginTop: "1%",
            paddingY: "2rem",
            paddingX:"1rem"
        }}>
        <Typography variant="h4" align="center" sx={{ paddingBottom: "1rem", color: "white" }}>Orders</Typography>
        {/* <BuyerOrders /> */}
        {UserType === 'buyer' ? <BuyerOrders /> : <VendorOrders />}
        </Paper>
    </Container>
    )
}

export default Orders