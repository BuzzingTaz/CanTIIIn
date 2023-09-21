import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LoginIcon from '@mui/icons-material/Login';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Modal, Form, Input, message } from 'antd'

import { getUser, removeToken } from "../../services/auth";
import { GetWallet, UpdateWallet } from "../../services/user"

const Navbar = () => {
  const navigate = useNavigate()

  const [form] = Form.useForm()

  const [user, setUser] = useState(null)
  const [wallet, setWallet] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(async () => {
    var u = await getUser();
    setUser(u);
  }, [navigate])

  useEffect(async () => {
    if (user && user.type === 'buyer') {
      const updateWallet = async () => {
        var wallet = await GetWallet()
        setWallet(wallet.message)
      }
      updateWallet()
      setInterval(updateWallet, 5000)
    }
  }, [user, navigate])

  const Logout = () => {
    removeToken()
    navigate("/")
  }

  const handleSubmit = async (d) => {
    const res = await UpdateWallet(d)
    if (res.status === 1)
      message.error(res.error)
    else {
      message.success(res.message)
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            CANTIIIN
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {!user ? (
            <>
              <Button color="inherit" variant="outlined" onClick={() => navigate("/login")}>
                <LoginIcon />
              </Button>
              <Button sx={{ marginX: "10px" }} color="inherit" variant="outlined" onClick={() => navigate("/register")} disableElevation>
                <PersonAddOutlinedIcon />
              </Button></>) : (
            <>
              {
                user.type === 'buyer' ? (
                  <>
                    <Button sx={{ marginX: "5px" }} color="inherit" variant="outlined" onClick={() => setVisible(true)}>
                      {wallet}<AccountBalanceWalletIcon />
                    </Button>
                    <Modal title="Add money" visible={visible}
                      onCancel={() => { setVisible(false); }}
                      onOk={() => {
                        form
                          .validateFields()
                          .then((values) => {
                            form.resetFields();
                            handleSubmit(values);
                            setVisible(false);
                          })
                          .catch((info) => {
                            console.log('Validate Failed:', info);
                          });
                      }}
                    >
                      <Form form={form} title="Add money" layout="vertical" intialValues={{ remember: true }}>
                        <Form.Item name="amount"
                          rules={[{ required: true, message: "Enter amount to add" }, { pattern: "^[0-9]*$", message: "Enter a valid amount" }]}
                        >
                          <Input placeholder="Amount" />
                        </Form.Item>
                      </Form>

                    </Modal>
                  </>
                ) : <Button sx={{ marginX: "5px" }} color="inherit" variant="outlined" onClick={() => navigate("/stats")}>
                  <AssessmentIcon />
                </Button>
              }
              <Button sx={{ marginX: "5px" }} color="inherit" variant="outlined" onClick={() => navigate("/orders")}>
                <ListAltIcon />
              </Button>
              <Button sx={{ marginX: "5px" }} color="inherit" variant="outlined" onClick={() => navigate("/profile")}>
                <AccountCircleOutlinedIcon />
              </Button>
              <Button sx={{ marginX: "5px" }} color="inherit" variant="outlined" onClick={Logout}>
                <LogoutIcon />
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
