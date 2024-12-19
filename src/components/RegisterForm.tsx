import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { updateRegisterFormField, resetRegisterForm } from "../store/slice/registerFormSlice";
import { Button, Form, Input, Row, Col, Typography } from "antd";

const { Text, Title } = Typography;

const RegisterForm: React.FC = () => {
  const dispatch = useDispatch();
  const formValues = useSelector((state: RootState) => state.registerForm);

  const handleChange = (field: keyof typeof formValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateRegisterFormField({ field, value: e.target.value }));
  };

  const handleSubmit = () => {
    console.log("Submitted Data:", formValues);
    dispatch(resetRegisterForm());
  };

  return (
    <Row className="flex items-center justify-center min-h-screen bg-slate-600">
      <Row className="w-full max-w-5xl bg-slate-400 p-8 rounded-xl">
        <Col span={12} className="flex flex-col items-center justify-center min-h-[600px]">
          <Title level={3} className="mb-6 self-start">Sign Up</Title>
          <Form name="registerForm" onFinish={handleSubmit} autoComplete="off" className="w-full pr-10">
            <Text>Email :</Text>
            <Form.Item validateStatus={formValues.email ? "" : "error"} help={!formValues.email ? "Please enter your email!" : ""}>
              <Input placeholder="Enter your email" value={formValues.email} onChange={handleChange("email")} />
            </Form.Item>

            <Text>Password :</Text>
            <Form.Item validateStatus={formValues.password ? "" : "error"} help={!formValues.password ? "Please enter your password!" : ""}>
              <Input.Password placeholder="Enter your password" value={formValues.password} onChange={handleChange("password")} />
            </Form.Item>

            <Text>Confirm Password :</Text>
            <Form.Item validateStatus={formValues.confirmPassword === formValues.password ? "" : "error"} help={formValues.confirmPassword !== formValues.password ? "Passwords do not match!" : ""}>
              <Input.Password placeholder="Confirm your password" value={formValues.confirmPassword} onChange={handleChange("confirmPassword")} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">Sign Up</Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={12} className="bg-slate-300"></Col>
      </Row>
    </Row>
  );
};

export default RegisterForm;
