import { Button, Table, Tag, Row, Col, message, Space } from 'antd'
import { Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import moment from 'moment'

import { getVendorOrders, acceptOrder, rejectOrder, moveOrder } from '../../services/order'

const VendorOrders = () => {

    const [Orders, SetOrders] = useState([])

    const updateOrders = async () => {
        const res = await getVendorOrders()
        SetOrders(res.message)
    }

    const handleAccept = async (id) => {
        const data = { id: id }
        const res = await acceptOrder(data)
        if (res.status === 1)
            message.error(res.error)
        else {
            message.success(res.message)
            updateOrders()
        }
    }

    const handleReject = async (id) => {
        const data = { id: id }
        const res = await rejectOrder(data)
        if (res.status === 1)
            message.error(res.error)
        else {
            message.success(res.message)
            updateOrders()
        }
    }

    const handleMove = async (id) => {
        const data = { id: id }
        const res = await moveOrder(data)
        if (res.status === 1)
            message.error(res.err)
        else {
            message.success(res.message)
            updateOrders()
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
            title: 'Buyer',
            dataIndex: 'buyer',
            key: 'buyer'
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
            render: order => (<>
                <Space>
                    {order.status === 'placed' ? (
                        <>
                            PLACED
                            <Button type="primary" onClick={() => handleAccept(order._id)}>Accept</Button>
                            <Button type="danger" onClick={() => handleReject(order._id)}>Reject</Button>
                        </>
                    ) : order.status === 'pickup' ? (
                        <>
                            READY TO PICKUP
                        </>
                    ) : order.status === 'rejected' ? (
                        <>
                            REJECTED
                        </>
                    ) : order.status === 'completed' ? (
                        <>
                            COMPLETED
                        </>
                    ) : (
                        <>
                            {order.status.toUpperCase()}
                            <Button type="primary" onClick={() => handleMove(order._id)}>Move to next stage</Button>
                        </>
                    )
                    }
                </Space>
            </>)
        }
    ]

    return (
        <>
            <Table columns={columns} dataSource={Orders} pagination={{ position: ["none", "none"] }}></Table>
        </>
    )
}

export default VendorOrders