import styled from "styled-components";
import BackgroundImage from "../assets/images/LoginPageBackground.jpg";
import { ColorBlack, ColorGray } from "../assets/themes/color";
import Title from "antd/es/typography/Title";
import type { FormProps } from 'antd';
import { Button, Checkbox, Divider, Form, Input } from 'antd';

type FieldType = {
    email?: string;
    password?: string;
    remember?: string;
};
  
const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
};
  
const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};
  
const LoginPage = () => {
    return (
        <StyledLoginPage>
            <LoginPageBackground1 />
            <LoginPageBackground2>
                <LoginPageContent>
                    <LoginPageTitle>
                        <StyledTitle>Log in</StyledTitle>
                    </LoginPageTitle>
                    <LoginPageSubtitle>
                        <StyledSubtitle>Safeguard and organized for clutter free Spaces</StyledSubtitle>
                    </LoginPageSubtitle>
                    <LoginPageForm>
                      <Form
                      name="login-form"
                      layout="vertical"
                      initialValues={{ remember: true }}
                      onFinish={onFinish}
                      onFinishFailed={onFinishFailed}
                      autoComplete="off"
                    >
                      <Form.Item<FieldType>
                        label="Enter your room's email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                      >
                        <Input placeholder="example@gmail.com" style={{ height: '5.2vh', width: '96%' }}/>
                      </Form.Item>

                      <Form.Item<FieldType>
                        label="Enter your storage password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                      >
                        <Input.Password placeholder="****************" style={{ height: '5.2vh', width: '96%' }}/>
                      </Form.Item>

                      <Form.Item<FieldType>
                        name="remember"
                        valuePropName="checked"
                      >
                        <RememberForgotContainer>
                          <Checkbox>Remember me</Checkbox>
                          <Button type="link">Retrieve forgotten password</Button>
                        </RememberForgotContainer>
                      </Form.Item>

                      <Form.Item>
                        <AccessButton>
                          <StyledAccessButton type="primary" htmlType="submit">
                            Access
                          </StyledAccessButton>
                        </AccessButton>
                      </Form.Item>

                      <StyledDivider>
                        <Divider plain>or</Divider>
                      </StyledDivider>

                      <LoginButtonGroups>
                        <StyledThirdPartyLoginButton>G</StyledThirdPartyLoginButton>
                        <StyledThirdPartyLoginButton>f</StyledThirdPartyLoginButton>
                        <StyledThirdPartyLoginButton>X</StyledThirdPartyLoginButton>
                      </LoginButtonGroups>

                      <NewAccount>
                        <CreateNewAccount>
                          Create a new account.
                        </CreateNewAccount>
                        <SignupButton>
                          <Button type="link">Sign up</Button>
                        </SignupButton>
                      </NewAccount>
                    </Form>
                  </LoginPageForm>
                </LoginPageContent>
            </LoginPageBackground2>
        </StyledLoginPage>
    )
}

export default LoginPage

const StyledLoginPage = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
`;

const LoginPageBackground1 = styled.div`
    background-image: url(${BackgroundImage});
    background-size: cover;
    height: 100%;
    width: 50%;
`;

const LoginPageBackground2 = styled.div`
    background-color: ${ColorGray.lightGray};
    height: 100%;
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const LoginPageContent = styled.div`
    margin-top: -4%;
    width: 80%;
    max-width: 500px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const LoginPageTitle = styled.div`
    width: 100%;
`;

const StyledTitle = styled(Title)`
    font-size: 3.5rem !important;
    font-weight: 700 !important;
    margin-top: 2%;
    color: ${ColorBlack.charcoalBlack};
`;

const LoginPageSubtitle = styled.div`
    width: 100%;
    margin-top: -3%;
    margin-bottom: 8%;
`;

const StyledSubtitle = styled.div`
    font-size: 0.9rem;
    color: ${ColorGray.ashGray};
`;

const LoginPageForm = styled.div`
  width: 84%;
`;

const RememberForgotContainer = styled.div`
  width: 98%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -5%;
  margin-left: 2%;
`;

const StyledDivider = styled.div`
  width: 100%;
  margin-top: -6%;
`;

const AccessButton = styled.div`
  margin-top: -8%;
`;

const StyledAccessButton = styled(Button)`
  width: 95%;
  height: 5.5vh;
  border-radius: 12px;
`;

const LoginButtonGroups = styled.div`
  display: flex;
  justify-content: center;
  gap: 6%;
  margin-top: -1.5%;
`;

const StyledThirdPartyLoginButton = styled(Button)`
  width: 29%;
  height: 5.8vh;
  border-radius: 14px;
`;

const NewAccount = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-size: 118%;
  margin-top: 6%;
`;

const SignupButton = styled.div``;

const CreateNewAccount = styled.div``;
