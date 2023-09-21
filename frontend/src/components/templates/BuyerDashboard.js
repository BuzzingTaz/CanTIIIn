import { Button, Table, Tag, Input, Switch, Row, Col, message, Modal, Form, Select, Space } from 'antd'
import { Typography } from "@mui/material"
import { useState, useEffect } from "react"
import { HeartOutlined, HeartFilled } from '@ant-design/icons'
import fuzzy from 'fuzzy'

import { getProductList, placeOrder, toggleFav } from '../../services/product'
import { useNavigate } from 'react-router-dom'

const BuyerDashboard = () => {

    const [Products, setProducts] = useState([])
    const [Allproducts, setAllProducts] = useState({})
    const [Favourite, setFavourite] = useState(false)

    const [form] = Form.useForm()
    const navigate = useNavigate()

    const [VegFilter, setVegFilter] = useState(false)
    const [Search, setSearch] = useState('')
    const [VendorFilter, setVendorFilter] = useState([])
    const [TagFilter, setTagFilter] = useState([])
    const [PriceFilter, setPriceFilter] = useState("0;9999999")

    const [Visible, SetVisible] = useState(false)
    const [BuyProduct, SetBuyProduct] = useState({})

    const [CanFilter, setCanFilter] = useState([])
    const [Tags, setTags] = useState([])


    const onVegFilterChange = (checked) => {
        setVegFilter(checked)
    }

    const handleSearch = (e) => {
        setSearch(e.target.value)
    }

    const handleMin = (e) => {
        const f = PriceFilter.split(';')
        const min = e.target.value
        setPriceFilter(min + ';' + f[1])
    }

    const handleMax = (e) => {
        const f = PriceFilter.split(';')
        var max = e.target.value
        if (max === '') max = "9999999"
        setPriceFilter(f[0] + ';' + max)
    }

    const handleBuy = (id) => {
        const p = Products.filter((p) => (p._id === id))
        SetBuyProduct(p[0])
        SetVisible(true)
    }

    const findProduct = (id) => {
        const a = Allproducts.available.findIndex((p) => (p._id === id))
        const c = Allproducts.unavailable.findIndex((p) => (p._id === id))
        if (a !== -1) {
            const b = Allproducts.afavourites.findIndex((p) => (p._id === id))
            if (b !== -1) return { fav: true, available: true, index: a , findex:b}
            else return { fav: false, available: true, index: a, findex: b }
        }
        else if (c !== -1) {
            const b = Allproducts.ufavourites.findIndex((p) => (p._id === id))
            if (b!== -1) return { fav: true, available: false, index: c, findex:b }
            else return { fav: false, available: false, index: c, findex:b }
        }
    }

    const handleFav = async (id) => {
        const data = { productId: id }
        const res = await toggleFav(data)
        const det = findProduct(id)
        if (res.status === 1)
            message.error(res.error)
        else {
            message.success(res.message)
            if (det.available) {
                if (det.fav)
                    Allproducts.afavourites.splice(det.findex, 1)
                else
                    Allproducts.afavourites.push(Allproducts.available[det.index])
            }
            else {
                if (det.fav)
                    Allproducts.ufavourites.splice(det.findex, 1)
                else
                    Allproducts.ufavourites.push(Allproducts.unavailable[det.index])
            }
        }
    }

    const handleChange = (pagination, filters, sorter) => {
        setTagFilter(filters.tags)
        setVendorFilter(filters.vendor)
    };

    const handleSubmit = async (d) => {
        var data = d
        data.productId = BuyProduct._id
        const res = await placeOrder(data)
        if (res.status === 1)
            message.error(res.error)
        else {
            message.success('Order placed successfully')
            navigate('/orders')
        }
    }

    useEffect(async () => {

        const data = await getProductList()
        setAllProducts(data.message)
        setProducts(data.message.available)

        var vendors = []
        data.message.available.forEach((p) => vendors.push(p.vendor))
        data.message.unavailable.forEach((p) => vendors.push(p.vendor))
        vendors = [...new Set(vendors)]
        var vf = []
        vendors.forEach((v) => vf.push({ text: v, value: v }))
        setCanFilter(vf)

        var tags = []
        data.message.available.forEach((p) => p.tags.forEach((tag) => tags.push(tag)))
        data.message.unavailable.forEach((p) => p.tags.forEach((tag) => tags.push(tag)))
        tags = [...new Set(tags)]
        var tf = []
        tags.forEach((t) => tf.push({ text: t, value: t }))
        setTags(tf)

    }, [])

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            onFilter: (value, record) => {
                var t = [record.name.toLowerCase()]
                let r = fuzzy.filter(value.toLowerCase(), t)
                let m = r.map((x) => x.string)
                return m.length === 1
            },
            filteredValue: [Search]
        },
        {
            title: 'Vendor',
            dataIndex: 'vendor',
            key: 'vendor',
            filters: CanFilter,
            onFilter: (value, record) => record.vendor.includes(value),
            filteredValue: VendorFilter
        },
        {
            title: 'Type',
            dataIndex: 'isnv',
            key: 'isnv',
            render: isnv => isnv ? 'Non-Veg' : 'Veg',
            onFilter: (value, record) => !(record.isnv && (value === 'true')),
            filteredValue: [VegFilter]
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
            filters: Tags,
            onFilter: (value, record) => record.tags.includes(value),
            filteredValue: TagFilter
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating) => {
                return <>{rating.count ? rating.total / rating.count : 0}</>
            },
            sorter: (a, b) => a.rating.count ? a.rating.total / a.rating.count : 0 - b.rating.count ? b.rating.total / b.rating.count : 0,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            sorter: (a, b) => a.price - b.price,
            onFilter: (value, record) => {
                const f = value.split(';')
                const min = f[0]
                const max = f[1]

                return (record.price >= min && record.price <= max)
            },
            filteredValue: [PriceFilter]
        },
        {
            title: 'Actions',
            key: 'buy',
            render: (text, record) => (
                <>
                    <Button type="primary" onClick={() => { handleBuy(record._id) }}>Buy</Button>
                    <Button style={{marginLeft : "1rem"}} type="primary" onClick={() => handleFav(record._id)}>{findProduct(record._id).fav ? <HeartFilled /> : <HeartOutlined />}</Button>
                </>
            )
        }
    ]

    const ucolumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            onFilter: (value, record) => {
                var t = [record.name.toLowerCase()]
                let r = fuzzy.filter(value.toLowerCase(), t)
                let m = r.map((x) => x.string)
                return m.length === 1
            },
            filteredValue: [Search]
        },
        {
            title: 'Vendor',
            dataIndex: 'vendor',
            key: 'vendor',
            filters: CanFilter,
            onFilter: (value, record) => record.vendor.includes(value),
            filteredValue: VendorFilter
        },
        {
            title: 'Type',
            dataIndex: 'isnv',
            key: 'isnv',
            render: isnv => isnv ? 'Non-Veg' : 'Veg',
            onFilter: (value, record) => !(record.isnv && (value === 'true')),
            filteredValue: [VegFilter]
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
            filters: Tags,
            onFilter: (value, record) => record.tags.includes(value),
            filteredValue: TagFilter
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating) => {
                return <>{rating.count ? rating.total / rating.count : 0}</>
            },
            sorter: (a, b) => a.rating.count ? a.rating.total / a.rating.count : 0 - b.rating.count ? b.rating.total / b.rating.count : 0,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            sorter: (a, b) => a.price - b.price,
            onFilter: (value, record) => {
                const f = value.split(';')
                const min = f[0]
                const max = f[1]

                return (record.price >= min && record.price <= max)
            },
            filteredValue: [PriceFilter]
        },
        {
            title: 'Actions',
            key: 'buy',
            render: (text, record) => (
                <>
                    <Button type="primary" disabled>Buy</Button>
                    <Button style={{marginLeft : "1rem"}} type="primary" onClick={() => handleFav(record._id)}>{findProduct(record._id).fav ? <HeartFilled /> : <HeartOutlined />}</Button>
                </>
            )
        }
    ]

    return (
        <>
            <Row><Col span={1} offset={0}>
                <Button type="primary" onClick={() => setFavourite(!Favourite)}>{Favourite ? <HeartFilled /> : <HeartOutlined />}</Button>
            </Col>
                <Col style={{ paddingBottom: "5px" }} span={8}>
                    <Input.Search onChange={handleSearch} placeholder='Search' />
                </Col>
                <Col span={5} offset={8}>
                    <Input.Group compact><Input placeholder='Min' style={{ width: "20%" }} onChange={handleMin} /><Input placeholder='Max' style={{ width: "20%" }} onChange={handleMax} /></Input.Group>
                </Col>
                <Col span={1} offset={0}>
                    <Switch onChange={onVegFilterChange} checkedChildren="Veg" unCheckedChildren="Any" />
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={Favourite ? Allproducts.afavourites : Allproducts.available}
                pagination={{ position: ["none", "none"] }}
                onChange={handleChange}>

            </Table>
            <Typography align="center" color={"white"} variant="h6">Unavailable</Typography>
            <Table
                columns={ucolumns}
                dataSource={Favourite ? Allproducts.ufavourites : Allproducts.unavailable}
                pagination={{ position: ["none", "none"] }}
                onChange={handleChange}>

            </Table>
            <Modal title={"Buy " + BuyProduct.name} visible={Visible}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            handleSubmit(values);
                            SetVisible(false);
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
                onCancel={() => { SetVisible(false); form.resetFields() }}>
                <Form
                    form={form}
                    title={"Buy " + BuyProduct.name}
                    layout="vertical"
                    initialValues={{ remember: true }}
                >
                    <Form.Item
                        name="quantity"
                        rules={[{ required: true, message: "Enter a quantity" }, { pattern: "[1-9][0-9]*", message: "Enter a valid quantity" }]}
                    >
                        <Input placeholder='Quantity' />

                    </Form.Item>
                    <Form.Item
                        name="addons"
                    >
                        <Select
                            mode="multiple"
                            placeholder="Addons"
                        >
                            {BuyProduct.name &&
                                BuyProduct.addons.map((a, i) => <Select.Option value={a._id} label={a.name}>{a.name} {a.price}rs</Select.Option>)
                            }

                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default BuyerDashboard
