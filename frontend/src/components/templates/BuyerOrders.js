import { Button, Table, Rate, message, Space } from 'antd'
import { Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import moment from 'moment'

import { getBuyerOrders, pickupOrder, rateOrder } from '../../services/order'

const BuyerOrders = () => {

    const [Orders, SetOrders] = useState([])

    const updateOrders = async () => {
        const res = await getBuyerOrders()
        SetOrders(res.message)
    }

    const handlePickup = async (id) => {
        var data = { id: id }
        const res = await pickupOrder(data)
        if (res.status === 1)
            message.error(res.error)
        else {
            message.success(res.message)
            updateOrders()
        }
    }

    const handleRate = async (id, rating) => {
        var data = { id: id, rating: rating }
        const res = await rateOrder(data)
        if (res.status === 1)
            message.error(res.error)
        else {
            message.success(res.message)
        }
        
    }

    useEffect(() => {
        updateOrders()
        setInterval(updateOrders, 5000)
    }, [])

    const columns = [
        {
            title: 'Item',
            dataIndex: 'item',
            key: 'item',
            render: item => {
                var ren = item.name
                if (item.addon.length) ren += " with "
                item.addon.forEach((addon, index) => {
                    ren += addon.name
                    if (index + 1 !== item.addon.length) {
                        ren += ", "
                    }
                })
                return ren
            }
        },
        {
            title: 'Vendor',
            dataIndex: 'vendor',
            key: 'vendor'
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity'
        },
        {
            title: 'Total Price',
            dataIndex: 'total',
            key: 'total'
        },
        {
            title: 'Order Time',
            dataIndex: 'placedTime',
            key: 'placedTime',
            render: time => moment(time).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            sorter: (a, b) => moment(a.placedTime).unix() - moment(b.placedTime).unix(),
            defaultSortOrder: 'descend',
            sortDirections: ['descend']
        },
        {
            title: 'Status',
            key: 'status',
            render: order => order.status !== 'pickup' ? order.status.toUpperCase() : (
                <>
                    <Space>
                        READY FOR PICKUP
                        <Button type="primary" onClick={() => handlePickup(order._id)}>Picked up</Button>
                    </Space>
                </>
            )
        },
        {
            title: 'Rating',
            key: 'rating',
            render: order => order.status === 'completed' ?(
                <Rate defaultValue={order.rating || 0} onChange={(v) => {handleRate(order._id,v)}}/>
            ) : <></>
        }
    ]

    return (
        <>
            <Table columns={columns} dataSource={Orders} pagination={{ position: ["none", "none"] }}></Table>
        </>
    )
}

export default BuyerOrders