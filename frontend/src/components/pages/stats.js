import { Container, Paper, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import {
    Row, Col, Statistic, List, Divider
} from 'antd'
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { getStats, getBatchStats, getAgeStats } from "../../services/order"

const Stats = () => {

    const [Stats, setStats] = useState({})

    const [BatchOrders, setBatchOrders] = useState([])

    const [AgeOrders, setAgeOrders] = useState({
        labels: [],
        data: []
    })

    const BatchData = {
        labels: ['UG1', 'UG2', 'UG3', 'UG4', 'UG5'],
        datasets: [{
            label: 'Orders',
            data: BatchOrders,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
        }]
    }

    const AgeData = {
        labels: AgeOrders.labels,
        datasets: [{
            label: 'Orders',
            data: AgeOrders.data,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
        }]
    }


    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );

    useEffect(() => {
        const updateStats = async () => {
            var res = await getStats()
            setStats(res.message)
            res = await getBatchStats()
            setBatchOrders(res.message)
            res = await getAgeStats()
            setAgeOrders(res.message)
        }
        updateStats()
    }, [])

    return (
        <>
            <Container maxWidth="sm">
                <Paper sx={{
                    backgroundColor: '#248BD9',
                    color: "#0B1F5D",
                    marginTop: "10%",
                    paddingY: "1rem",
                    paddingX: "1rem"
                }}>
                    <Typography variant="h4" align="center" sx={{ paddingBottom: "1rem", color: "white" }}>Statistics</Typography>
                    <Row>
                        <Col span={6} offset={2}>
                            <Statistic title="Total orders" value={Stats.orders} />
                        </Col>
                        <Col span={6} offset={2}>
                            <Statistic title="Completed orders" value={Stats.completed} />
                        </Col>
                        <Col span={6} offset={2}>
                            <Statistic title="Pending orders" value={Stats.pending} />
                        </Col>
                    </Row>
                    <Typography variant="h6" sx={{ paddingY: "1rem", color: "white" }} >Top sales</Typography>
                    <List itemLayout="horizontal"
                        dataSource={Stats.top}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta title={item.name} description={`Sales : ${item.count}`}
                                />
                            </List.Item>
                        )}
                    />
                    <Bar data={BatchData} />
                    <Divider />
                    <Bar data={AgeData} />
                </Paper>
            </Container>
        </>
    )
}

export default Stats