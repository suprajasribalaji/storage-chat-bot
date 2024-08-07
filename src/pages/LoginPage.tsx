import styled from "styled-components";
import BackgroundImage from "../assets/images/LoginPageBackground.jpg";
import { ColorBlack, ColorBlue, ColorGray, ColorRed, ColorWhite } from "../assets/themes/color";
import Title from "antd/es/typography/Title";
import type { FormProps } from 'antd';
import { Button, Checkbox, Divider, Form, Input, message } from 'antd';
import { GoogleOutlined } from "@ant-design/icons";
import { FaFacebookF } from "react-icons/fa";
import { IoLogoMicrosoft } from "react-icons/io5";
import { useState } from "react";
import RetrieveForgottenPasswordModal from "../components/modal/RetrieveForgottenPasswordModal";
import { useNavigate } from "react-router-dom";

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
  
const getEmailValidationRules = () => {
  return [
      { required: true, message: 'Please input your email!' },
      { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Please enter a valid email address!' },
  ];
};

const getPasswordValidationRules = () => {
  return [
      { required: true, message: 'Please input your password!' },
      { pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/, message: 'Password must be min 8 and max 16 valid characters! Includes at least one uppercase letter, one lowercase letter, one digit, and one special character' },
  ];
};

const LoginPage = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleRetrieveForgottenPassword = () => {
      setIsModalOpen(true);
    }

    const handleAccessButton = () => {
      navigate("/home");
      message.success('Logged in successfully!');
    }

    const handleSignupButtton = () => {
      navigate("/signup")
    }

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
                    <LoginPageForm                      
                      name="login-form"
                      layout="vertical"
                      initialValues={{ remember: true }}
                      onFinish={onFinish as any}
                      onFinishFailed={onFinishFailed as any}
                      autoComplete="off"
                    >
                      <Form.Item<FieldType>
                        label="Enter your room's email"
                        name="email"
                        rules={getEmailValidationRules()}
                      >
                        <Input placeholder="example@gmail.com" style={{ height: '5.2vh', width: '96%', border: 'none' }}/>
                      </Form.Item>

                      <Form.Item<FieldType>
                        label="Enter your storage password"
                        name="password"
                        rules={getPasswordValidationRules()}
                      >
                        <Input.Password placeholder="****************" style={{ height: '5.2vh', width: '96%', border: 'none' }}/>
                      </Form.Item>

                      <Form.Item<FieldType>
                        name="remember"
                        valuePropName="checked"
                      >
                        <RememberForgotContainer>
                          <RememberMeCheckboxContainer>
                            <StyledCheckbox />
                            <RememberMe>
                              Remember me
                            </RememberMe>
                          </RememberMeCheckboxContainer>                        
                          <RememberForgotPasswordButton type="link" onClick={handleRetrieveForgottenPassword}>Retrieve forgotten password</RememberForgotPasswordButton>
                        </RememberForgotContainer>
                      </Form.Item>

                      {
                          isModalOpen && 
                          <RetrieveForgottenPasswordModal
                            isModalOpen={isModalOpen}
                            setIsModalOpen={setIsModalOpen}
                          />
                      }

                      <Form.Item>
                        <AccessButton>
                          <StyledAccessButton type="primary" onClick={handleAccessButton}>
                            Access
                          </StyledAccessButton>
                        </AccessButton>
                      </Form.Item>

                      <StyledDivider>
                        <Divider plain>or</Divider>
                      </StyledDivider>

                      <LoginButtonGroups>
                        <StyledGoogleButton icon={<GoogleOutlined />} />
                        <StyledFacebookButton icon={<FaFacebookF />}/>
                        <StyledMicrosoftButton icon={<IoLogoMicrosoft />}/>
                      </LoginButtonGroups>

                      <NewAccount>
                        <CreateNewAccount>
                          Create a new account.
                        </CreateNewAccount>
                        <SignupButton>
                          <StyledSignupButton onClick={handleSignupButtton} type="link">Sign up</StyledSignupButton>
                        </SignupButton>
                      </NewAccount>
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
    color: ${ColorBlack.charcoalBlack};
`;

const LoginPageTitle = styled.div`
    width: 100%;
`;

const StyledTitle = styled(Title)`
    font-size: 3.5rem !important;
    font-weight: 700 !important;
    margin-top: 2%;
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

const LoginPageForm = styled(Form)`
  width: 84%;
  .ant-form-item-explain-error {
    text-align: left;
    margin-left: 2%;
  }
`;

const RememberForgotContainer = styled.div`
  width: 98%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -5%;
  margin-left: 2%;
`;

const RememberMeCheckboxContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledCheckbox = styled(Checkbox)`
  .ant-checkbox-inner {
    border-color: ${ColorBlack.black};
    background-color: ${ColorWhite.white};
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    border-color: ${ColorBlack.raisinBlack};
    background-color: ${ColorWhite.white};
  }

  .ant-checkbox-checked .ant-checkbox-inner::after {
    border-color: ${ColorBlack.raisinBlack};
  }

  &&&:hover .ant-checkbox-inner,
  &&&:focus .ant-checkbox-inner {
    border-color: ${ColorBlack.black};
    background-color: ${ColorWhite.white};
  }

  &&&:hover .ant-checkbox-checked .ant-checkbox-inner,
  &&&:focus .ant-checkbox-checked .ant-checkbox-inner {
    border-color: ${ColorBlack.raisinBlack};
    background-color: ${ColorWhite.white};
  }
`;

const RememberMe = styled.div`
  color: ${ColorBlack.charcoalBlack};
  margin-left: 5px;
`;

const RememberForgotPasswordButton = styled(Button)`
  color: ${ColorBlack.richBlack};
  border: none;
  &&&:hover {
    color: ${ColorBlack.semiTransparentBlack};
  }
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
  background-color: ${ColorBlack.raisinBlack};
  border: none;
  font-weight: bold;
  &&&:hover {
    background-color: ${ColorWhite.white};
    color: ${ColorBlack.raisinBlack};
  }
`;

const StyledThirdPartyLoginButton = styled(Button)`
  .anticon {
    color: ${ColorWhite.white};
  }

  &&&:hover, &&&:focus {
    background-color: ${ColorWhite.white};
    .anticon {
      color: inherit;
    }
  } 

  &&& {
    width: 27%;
    height: 5.8vh;
    border-radius: 14px;
    border: none;
    font-weight: bold;
  }
`;

const StyledGoogleButton = styled(StyledThirdPartyLoginButton)`
  background-color: ${ColorRed.tomatoRed};
  &&&:hover, &&&:focus {
    .anticon {
        color: ${ColorRed.tomatoRed};
    }
  } 
`;

const StyledFacebookButton = styled(StyledThirdPartyLoginButton)`
  background-color: ${ColorBlue.denimBlue};
  color: ${ColorWhite.white};

  &&&:hover, &&&:focus {
    background-color: ${ColorWhite.white};
    color: ${ColorBlue.denimBlue};
  }
`;

const StyledMicrosoftButton = styled(StyledThirdPartyLoginButton)`
  background-color: ${ColorBlack.black};
  color: ${ColorWhite.white};
  &&&:hover, &&&:focus {
    background-color: ${ColorWhite.white};
    color: ${ColorBlack.black};  
  }
`;

const LoginButtonGroups = styled.div`
  display: flex;
  justify-content: center;
  gap: 6%;
  margin-top: -1.5%;
`;

const NewAccount = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-size: 118%;
  margin-top: 6%;
`;

const CreateNewAccount = styled.div``;

const SignupButton = styled.div`
  margin-left: -2%;
`;

const StyledSignupButton = styled(Button)`
  color: rgba(93, 93, 91);
  font-size: 100%;
  font-weight: bold;
  &&&:hover {
    color: ${ColorGray.semiAshGray};
  }
`;