import { Button, Table, Tag, Input, Row, Col, message, Modal, Form, Select, Checkbox, Space, Popconfirm } from 'antd'
import { Typography } from "@mui/material"
import { useState, useEffect } from "react"
import { EditOutlined, DeleteOutlined, PlusOutlined, MinusCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'

import { getVendorProducts, addProduct, editProduct, deleteProduct } from '../../services/product'

const VendorDashboard = () => {

    const [form] = Form.useForm()

    const [Products, setProducts] = useState([])
    const [EditProduct, setEditProduct] = useState({})
    const [AddVisible, setAddVisible] = useState(false)
    const [EditVisible, setEditVisible] = useState(false)
    const [Update, setUpdate] = useState(false)

    const handleAdd = async (d) => {
        const res = await addProduct(d)
        if (res.status === 1)
            message.error(res.error)
        else {
            message.success("Product added successfully")
        }

    }

    const handleEdit = async (d) => {
        var data = d
        data.id = EditProduct._id
        const res = await editProduct(data)
        if (res.status === 1)
            message.error(res.error)
        else
            message.success(res.message)
    }

    const handleDelete = async (d) => {
        var data = { id: d }
        const res = await deleteProduct(data)
        if (res.status === 1)
            message.error(res.error)
        else {
            message.success(res.message)
            setUpdate(!Update)
        }
    }

    useEffect(() => {
        const getProducts = async () => {
            const res = await getVendorProducts()
            setProducts(res.message)
        }
        getProducts()
    }, [AddVisible, EditVisible, Update ])

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Type',
            dataIndex: 'isnv',
            key: 'isnv',
            render: isnv => isnv ? 'Non-Veg' : 'Veg'
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
            render: tags => (
                <>
                    {tags.map(tag => {
                        let color = 'geekblue';
                        if (tag === 'loser') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Addons',
            dataIndex: 'addons',
            key: 'addons',
            render: addons => (
                <>
                    {
                        addons.map(addon => {
                            return <Tag>{addon.name} | {addon.price}rs</Tag>
                        })
                    }
                </>
            )
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating) => {
                return <>{rating.count ? rating.total / rating.count : 0}</>
            },
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Actions',
            key: 'buy',
            render: (text, record) => (
                <>
                    <Button type='primary' onClick={() => { setEditProduct(record); setEditVisible(true) }}><EditOutlined /></Button>
                    <Popconfirm title="Are you sure to delete this product?"
                        okText="Yes"
                        cancelText="No"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        onConfirm={() => handleDelete(record._id)}
                    >
                        <Button style={{ marginLeft: "1rem" }} type='danger'><DeleteOutlined /></Button>
                    </Popconfirm>
                </>
            )
        }
    ]

    return (
        <>
            <Row>
                <Col span={1} offset={0}>
                    <Button type="primary" onClick={() => setAddVisible(true)}><PlusOutlined />Add Product</Button>
                </Col>
            </Row>
            <Table columns={columns} dataSource={Products} pagination={{ position: ["none", "none"] }}>
            </Table>
            <Modal title={"Add Product"} visible={AddVisible}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            handleAdd(values);
                            setAddVisible(false);
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
                onCancel={() => { setAddVisible(false); form.resetFields() }}>
                <Form form={form} title="Add product" layout="vertical" initialValues={{ isnv: false }}>
                    <Form.Item name="name" rules={[{ required: true, message: "Enter name of the product" }]}>
                        <Input placeholder="Name" />
                    </Form.Item>
                    <Form.Item name="price" rules={[{ required: true, message: "Enter price of the product" }, { pattern: "^[1-9][0-9]*$", message: "Enter a valid price" }]}>
                        <Input placeholder="Price" />
                    </Form.Item>
                    <Form.Item name="isnv" valuePropName="checked">
                        <Checkbox>Non-Veg</Checkbox>
                    </Form.Item>
                    <Form.Item name='tags'>
                        <Select mode='multiple' placeholder="Tags">
                            <Select.Option key="COLD">COLD</Select.Option>
                            <Select.Option key="HOT">HOT</Select.Option>
                            <Select.Option key="DRINK">DRINK</Select.Option>
                            <Select.Option key="SWEET">SWEET</Select.Option>
                            <Select.Option key="SNACK">SNACK</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.List name="addons">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'name']}
                                            rules={[{ required: true, message: 'Missing addon name' }]}
                                        >
                                            <Input placeholder="Addon name" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'price']}
                                            rules={[{ required: true, message: 'Missing addon price' }]}
                                        >
                                            <Input placeholder="Price" />
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Add Addon
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
            <Modal title={"Edit Product"} visible={EditVisible}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            handleEdit(values);
                            setEditVisible(false);
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
                onCancel={() => { setEditVisible(false); form.resetFields() }}>
                <Form form={form} title="Edit product" layout="vertical" initialValues={EditProduct}>
                    <Form.Item name="name" rules={[{ required: true, message: "Enter name of the product" }]}>
                        <Input placeholder="Name" />
                    </Form.Item>
                    <Form.Item name="price" rules={[{ required: true, message: "Enter price of the product" }, { pattern: "^[1-9][0-9]*$", message: "Enter a valid price" }]}>
                        <Input placeholder="Price" />
                    </Form.Item>
                    <Form.Item name="isnv" valuePropName="checked">
                        <Checkbox>Non-Veg</Checkbox>
                    </Form.Item>
                    <Form.Item name='tags'>
                        <Select mode='multiple' placeholder="Tags">
                            <Select.Option key="COLD">COLD</Select.Option>
                            <Select.Option key="HOT">HOT</Select.Option>
                            <Select.Option key="DRINK">DRINK</Select.Option>
                            <Select.Option key="SWEET">SWEET</Select.Option>
                            <Select.Option key="SNACK">SNACK</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.List name="addons">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'name']}
                                            rules={[{ required: true, message: 'Missing addon name' }]}
                                        >
                                            <Input placeholder="Addon name" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'price']}
                                            rules={[{ required: true, message: 'Missing addon price' }]}
                                        >
                                            <Input placeholder="Price" />
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Add Addon
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </>
    )
}

export default VendorDashboard