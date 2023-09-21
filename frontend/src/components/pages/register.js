import { Grid, Container, Paper, Typography } from '@mui/material'
import { Form, Input, Button, message, Radio, Select, TimePicker } from "antd"
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, SmileOutlined, ShopOutlined } from '@ant-design/icons';
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { RegisterUser, getUser } from "../../services/auth"

const RegisterForm = () => {

    const [form] = Form.useForm()
    const navigate = useNavigate()

    const [Type, setType] = useState("")

    const handleSubmit = async (e) => {
        const res = await RegisterUser(e)
        if (res.status === 1) {
            message.error(res.error)
        }
        else {
            navigate("/login")
        }
    }

    const onChange = (e) => {
        setType(e.target.value)
    }

    useEffect(() => {
        async function checkUser() {
            var u = await getUser()
            if (u) {
                navigate("/")
            }
        }
        checkUser()
    })

    return (
        <Container maxWidth="sm">
            <Paper sx={{
                backgroundColor: '#248BD9',
                color: "#0B1F5D",
                marginTop: "5%",
                paddingY: "2rem",
            }}>
                <Typography variant="h4" align="center" sx={{ paddingBottom: "1rem", color: "white" }}>REGISTER</Typography>
                <Form
                    name="basic"
                    form={form}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ offset: 5, span: 14 }}
                    initialValues={{ remember: true }}
                    onFinish={handleSubmit}
                    size="large"
                    autoComplete="off">
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Please input your full name' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Full name" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Please input your email address!' }, { type: 'email', message: "Enter a valid email address" }]}
                    >
                        <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email Address" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }, { min: 8, message: 'Password must have atleast 8 characters' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item
                        name="number"
                        rules={[{ required: true, message: 'Please input your phone number!' }, { len: 10, pattern: "^[0-9]*$", message: "Enter a valid phone number" }]}
                    >
                        <Input
                            prefix={<PhoneOutlined className="site-form-item-icon" />}
                            placeholder="Phone number"
                        />
                    </Form.Item>
                    <Form.Item
                        name="type"
                        rules={[{ required: true, message: 'Please select the user type' }]}
                        wrapperCol={{ offset: 9 }}
                    >
                        <Radio.Group onChange={onChange} value={Type}>
                            <Radio value={"buyer"}>Buyer</Radio>
                            <Radio value={"vendor"}>Vendor</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {
                        Type === "buyer" &&
                        <>
                            <Form.Item
                                name="age"
                                rules={[{ required: true, message: 'Please input your age!' }, { pattern: "^[1-9][0-9]$", message: "Enter a valid age" }]}
                            >
                                <Input
                                    prefix={<SmileOutlined className="site-form-item-icon" />}
                                    placeholder="Age"
                                />
                            </Form.Item>
                            <Form.Item
                                name="batch"
                                rules={[{ required: true, message: 'Please input your batch!' }]}
                            >
                                <Select placeholder="Batch">
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
                        Type === "vendor" &&
                        <>
                            <Form.Item
                                name="shopname"
                                rules={[{ required: true, message: 'Please input your shop name!' }, { min: 2, message: "Shop name must have atleast 2 characters" }]}
                            >
                                <Input
                                    prefix={<ShopOutlined className="site-form-item-icon" />}
                                    placeholder="Shop name"
                                />
                            </Form.Item>
                            <Form.Item
                                name="opening"
                                rules={[{ required: true, message: 'Please input your opening hours!' }]}
                            >
                                <TimePicker format="HH:mm" placeholder="Opening time" />
                            </Form.Item>
                            <Form.Item
                                name="closing"
                                rules={[{ required: true, message: 'Please input your closing hours!' }]}
                            >
                                <TimePicker format="HH:mm" placeholder="Closing time" />
                            </Form.Item>
                        </>
                    }
                    <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Paper>
        </Container>
    )
}

export default RegisterForm