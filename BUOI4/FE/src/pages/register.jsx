import React from 'react';
import {Button, Col, Divider, Form, Input, message, notification, Row} from 'antd';
import { createUserApi } from '../util/api';
import {Link, useNavigate} from "react-router-dom";
import { ArrowDownOutlined } from '@ant-design/icons';

const RegisterPage = () => {
    const navigate = useNavigate(); 
    const onFinish = async (values) => {
        const { name, email, password } = values;
        const res = await createUserApi(name, email, password);

        if (res){
            notification.success({
                message: "Success",
                description: "User created successfully!",
            });
            navigate("/login");     
        }
        else {
            notification.error({
                message: "Error",
                description: res.message || "Failed to create user.",
            });
        }   
    };

    return (
        <Row justify={"center"} style ={{marginTop: "30px"}}>
            <Col xs={24} md={16} lg={8}>
                <fieldset style={{
                    padding: "15px",
                    margin:"5px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                }}>
                    <legend style={{padding: "0 10px"}}>Đăng ký</legend>
                    <Form
                        name='basic'
                        onFinish={onFinish}
                        autoComplete='off'
                        layout='vertical'>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, 
                                message: 'Please input your email!' }]}
                            >
                            <Input  />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{width: "100%"}}>
                                Register
                            </Button>
                        </Form.Item>
                        <Divider plain>Or</Divider>
                        <Form.Item>

                            <Link to="/login">
                                <Button type="default" style={{width: "100%"}}>
                                    Login
                                </Button>
                            </Link>
                            <Divider />
                            <Link to={"/"}><ArrowDownOutlined /> Back to Home</Link>    
                        </Form.Item>
                    </Form>

                </fieldset>
            </Col>
        </Row> 
    )
}

export default RegisterPage;
