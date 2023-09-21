import { Container, Paper, Typography } from "@mui/material";
import { Form, Input, Button, message, Select, TimePicker } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, SmileOutlined, ShopOutlined } from '@ant-design/icons';

import { getUser } from "../../services/auth"
import { GetUserProfile, UpdateUserProfile } from "../../services/user"
import moment from "moment";

const Profile = () => {

    const [IsBuyer, setIsBuyer] = useState(true);
    const [Edit, setEdit] = useState(false);
    const [form] = Form.useForm()
    const navigate = useNavigate()

    useEffect(async () => {
        const u = await getUser()
        if (!u) navigate("/login")
        if (u.type === 'buyer') {
            setIsBuyer(true)
        }
        else
            setIsBuyer(false)

        const user = await GetUserProfile()
        const { opening, closing, age,...rest } = user
        form.setFieldsValue({
            opening: moment(opening, "HH:mm"),
            closing: moment(closing, "HH:mm"),
            age: age? age.toString() : "",
        })
        form.setFieldsValue(rest)

    }, [])

    const handleEdit = () => {
        setEdit(!Edit)
    }

    const handleSubmit = async (e) => {
        if (Edit) return

        const res = await UpdateUserProfile(e)
        if (res.status === 1) {
            message.error(res.error)
        }
        else {
            message.success(res.message)
        }
    }

    return (
        <Container maxWidth="sm">
            <Paper sx={{
                backgroundColor: '#248BD9',
                color: "#0B1F5D",
                marginTop: "10%",
                paddingY: "1rem",
            }}>
                <Typography variant="h4" align="center" sx={{ paddingBottom: "1rem", color: "white" }}>PROFILE</Typography>
                <Form
                    name="profile"
                    form={form}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ offset: 5, span: 14 }}
                    initialValues={{ remember: true }}
                    onFinish={handleSubmit}
                    size="large"
                    autoComplete="off">
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Please input your email address!' }, { type: 'email', message: "Enter a valid email address" }]}
                    >
                        <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email Address" disabled />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Please input your full name' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Full name" disabled={!Edit} />
                    </Form.Item>
                    <Form.Item
                        name="number"
                        rules={[{ required: true, message: 'Please input your phone number!' }, { len: 10, pattern: "^[0-9]*$", message: "Enter a valid phone number" }]}
                    >
                        <Input
                            prefix={<PhoneOutlined className="site-form-item-icon" />}
                            placeholder="Phone number"
                            disabled={!Edit}
                        />
                    </Form.Item>
                    {IsBuyer &&
                        <>
                            <Form.Item
                                name="age"
                            rules={[{ required: true, message: 'Please input your age!' }, { len: 2, pattern: "^[0-9]*$", message: "Enter a valid age" }]}
                            >
                                <Input
                                    prefix={<SmileOutlined className="site-form-item-icon" />}
                                    placeholder="Age"
                                    disabled={!Edit}
                                />
                            </Form.Item>
                            <Form.Item
                                name="batch"
                                rules={[{ required: true, message: 'Please input your batch!' }]}
                            >
                                <Select placeholder="Batch" disabled={!Edit}>
                                    <Select.Option value="UG1">UG1</Select.Option>
                                    <Select.Option value="UG2">UG2</Select.Option>
                                    <Select.Option value="UG3">UG3</Select.Option>
                                    <Select.Option value="UG4">UG4</Select.Option>
                                    <Select.Option value="UG5">UG5</Select.Option>
                                </Select>
                            </Form.Item>
                        </>
                    }
                    {
                        !IsBuyer &&
                        <>
                            <Form.Item
                                name="shopname"
                                rules={[{ required: true, message: 'Please input your shop name!' }, { min: 2, message: "Shop name must have atleast 2 characters" }]}
                            >
                                <Input
                                    prefix={<ShopOutlined className="site-form-item-icon" />}
                                    placeholder="Shop name"
                                    disabled
                                />
                            </Form.Item>
                            <Form.Item
                                name="opening"
                                rules={[{ required: true, message: 'Please input your opening hours!' }]}
                            >
                                <TimePicker format="HH:mm" placeholder="Opening time" disabled={ !Edit }/>
                            </Form.Item>
                            <Form.Item
                                name="closing"
                                rules={[{ required: true, message: 'Please input your closing hours!' }]}
                            >
                                <TimePicker format="HH:mm" placeholder="Closing time" disabled={ !Edit } />
                            </Form.Item>
                        </>
                    }
                    <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                        <Button type="primary" htmlType="submit" onClick={handleEdit}>
                            {Edit ? "Save" : "Edit"}
                        </Button>
                    </Form.Item>
                </Form>
            </Paper>
        </Container>
    )
}

export default Profile