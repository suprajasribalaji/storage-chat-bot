import styled from "styled-components";
import BackgroundImage from "../assets/images/LoginPageBackground.jpg";
import { colors } from "../assets/themes/color";
import Title from "antd/es/typography/Title";
import type { FormProps } from 'antd';
import { Button, Checkbox, Divider, Form, Input, message } from 'antd';
import { GoogleOutlined, GithubOutlined } from "@ant-design/icons";
import { useState } from "react";
import RetrieveCredentialsModal from "../components/modal/RetrieveCredentialsModal";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { requestUserLogin, requestUserLoginByGithub, requestUserLoginByGoogle } from "../redux/slices/login";


type FieldType = {
    email: string;
    password: string;
    remember: string;
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
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleRetrieveCredentials = () => {
      setIsModalOpen(true);
    }

    const handleAccessButton: FormProps<FieldType>['onFinish'] = async (values) => {
      console.log('Success:', values);
      const { email, password, remember } = values;
      try {
        if(remember){
          localStorage.setItem('email', email);
          localStorage.setItem('password', password);
        }
        const response = await dispatch(requestUserLogin({email, password})).unwrap();
        navigate('/home');
        console.log(response, "this is the response ====>");
        message.success('Logged in successfully!');
      } catch (error) {
        console.error('Login failed:', error);
        message.error('Login failed. Please check your credentials.');
      }
    };

    const handleGoogleProviderButton = async () =>{
      try {
        const response = await dispatch(requestUserLoginByGoogle());
        navigate('/home');
        console.log(response, " gmail provider respose ----------");
        message.success('Logged in using gmail successfully!');
      } catch (error) {
        console.error('Login failed:', error);
        message.error('Login failed. Please check your credentials.');
      }
    };

    const handleGithubProviderButton = async () =>{
      try {
        const response = await dispatch(requestUserLoginByGithub());
        navigate('/home');
        console.log(response, " github provider respose ----------");
        message.success('Logged in using github successfully!');
      } catch (error) {
        console.error('Login failed:', error);
        message.error('Login failed. Please check your credentials.');
      }
    };

    const handleSignupButtton = () => {
      navigate("/signup")
    };  

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
                      initialValues={{
                        email: localStorage.getItem('email') || '',
                        password: localStorage.getItem('password') || '',
                        remember: false,
                      }}
                      autoComplete="off"
                      onFinish={handleAccessButton as any}
                      onFinishFailed={onFinishFailed as any}
                    >
                      <Form.Item<FieldType>
                        label="Enter your room's email"
                        name="email"
                        rules={getEmailValidationRules()}
                      >
                        <StyledInput 
                          placeholder="example@gmail.com"
                        />
                      </Form.Item>

                      <Form.Item<FieldType>
                        label="Enter your storage password"
                        name="password"
                        rules={getPasswordValidationRules()}
                      >
                        <StyledPasswordInput
                          placeholder="****************"
                        />
                      </Form.Item>

                      <Form.Item<FieldType>
                        name="remember"
                        valuePropName="checked"
                      >
                        <RememberForgotContainer>
                          <SaveCredentialsCheckboxContainer>
                            <StyledCheckbox />
                            <SaveCredentials>
                              Save Credentials
                            </SaveCredentials>
                          </SaveCredentialsCheckboxContainer>                        
                          <RememberRetrieveCredentialsButton type="link" onClick={handleRetrieveCredentials}>Retrieve Credentials</RememberRetrieveCredentialsButton>
                        </RememberForgotContainer>
                      </Form.Item>

                      {
                          isModalOpen && 
                          <RetrieveCredentialsModal
                            isModalOpen={isModalOpen}
                            setIsModalOpen={setIsModalOpen}
                          />
                      }

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
                        <StyledGoogleButton icon={<GoogleOutlined />} onClick={handleGoogleProviderButton}/>
                        <StyledGithubButton icon={<GithubOutlined />} onClick={handleGithubProviderButton}/>
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
    background-color: ${colors.lightGray};
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
    color: ${colors.charcoalBlack};
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
    color: ${colors.ashGray};
`;

const LoginPageForm = styled(Form)`
  width: 84%;
  .ant-form-item-explain-error {
    text-align: left;
    margin-left: 2%;
  }
`;

const StyledInput = styled(Input)`
  height: 5.2vh;
  width: 96%;
  border: none;
`;

const StyledPasswordInput = styled(StyledInput).attrs({ type: 'password' })``;

const RememberForgotContainer = styled.div`
  width: 98%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -5%;
  margin-left: 2%;
`;

const SaveCredentialsCheckboxContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledCheckbox = styled(Checkbox)`
  .ant-checkbox-inner {
    border-color: ${colors.black};
    background-color: ${colors.white};
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    border-color: ${colors.raisinBlack};
    background-color: ${colors.white};
  }

  .ant-checkbox-checked .ant-checkbox-inner::after {
    border-color: ${colors.raisinBlack};
  }

  &&&:hover .ant-checkbox-inner,
  &&&:focus .ant-checkbox-inner {
    border-color: ${colors.black};
    background-color: ${colors.white};
  }

  &&&:hover .ant-checkbox-checked .ant-checkbox-inner,
  &&&:focus .ant-checkbox-checked .ant-checkbox-inner {
    border-color: ${colors.raisinBlack};
    background-color: ${colors.white};
  }
`;

const SaveCredentials = styled.div`
  color: ${colors.charcoalBlack};
  margin-left: 5px;
`;

const RememberRetrieveCredentialsButton = styled(Button)`
  color: ${colors.richBlack};
  border: none;
  &&&:hover {
    color: ${colors.semiTransparentBlack};
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
  background-color: ${colors.raisinBlack};
  border: none;
  font-weight: bold;
  &&&:hover {
    background-color: ${colors.white};
    color: ${colors.raisinBlack};
  }
`;

const StyledThirdPartyLoginButton = styled(Button)`
  .anticon {
    color: ${colors.white};
  }

  &&&:hover, &&&:focus {
    background-color: ${colors.white};
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
  background-color: ${colors.tomatoRed};
  &&&:hover, &&&:focus {
    .anticon {
        color: ${colors.tomatoRed};
    }
  } 
`;

const StyledGithubButton = styled(StyledThirdPartyLoginButton)`
  background-color: ${colors.black};
  color: ${colors.white};

  &&&:hover, &&&:focus {
    background-color: ${colors.white};
    color: ${colors.black};
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
    color: ${colors.semiAshGray};
  }
`;