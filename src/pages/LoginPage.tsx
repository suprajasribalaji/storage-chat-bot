import styled from "styled-components";
import BackgroundImage from "../assets/images/LoginPageBackground.jpg";
import { colors } from "../assets/themes/color";
import Title from "antd/es/typography/Title";
import type { FormProps } from 'antd';
import { Button, Checkbox, Divider, Form, Input, message } from 'antd';
import { GoogleOutlined, GithubOutlined } from "@ant-design/icons";
import { useState } from "react";
import ForgotPasswordModal from "../components/modal/ForgotPasswordModal";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { requestUserLogin, requestUserLoginByGithub, requestUserLoginByGoogle } from "../redux/slices/user/login";
import { getEmailValidationRules, getPasswordValidationRules } from "../helpers/helpers";
import { FieldType } from "../utils/utils";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, database } from "../config/firebase.config";
import axios from "axios";

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed on finish:', errorInfo);
};

const LoginPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [failedAttempts, setFailedAttempts] = useState<number>(0);

    const handleForgotPassword = () => {
      setIsModalOpen(true);
    }

    const handleLoginButton: FormProps<FieldType>['onFinish'] = async (values) => {
      console.log('Success:', values);
      const { email, password, remember } = values;
      try {
        if(remember){
          localStorage.setItem('email', email);
          localStorage.setItem('password', password);
        }
        const response = await dispatch(requestUserLogin({email, password})).unwrap();
        console.log('in login page: =======-----<<<<< ', response);
       
        const userQuery = query(collection(database, "Users"), where("email", "==", auth.currentUser?.email));
        const querySnapshot = await getDocs(userQuery);
        const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
        
        if (!querySnapshot.empty && userData.is_2fa_enabled) {
          try {
            const response = await axios.post('http://localhost:5001/generate-send-otp', { email: userData.email, nickName: userData.nick_name });
            console.log('otp generate and send: ', response);
            
            if(userData.is_2fa_enabled) {
              navigate('/verify-user')
            } else {
              navigate('/home');
            }
          } catch (error) {
            console.error('Error generating OTP:', error);
            message.error('Failed to generate OTP. Please try again.');
          }
        } else {
          navigate('/home');
        }
        console.log(response, "this is the response ====>");
        message.success('Logged in successfully!');
        setFailedAttempts(0);
      } catch (error) {
        console.error('Login failed:', error);
        setFailedAttempts(prev => prev + 1);

        if (failedAttempts >= 3) {
          handleForgotPassword();
        }

        if (axios.isAxiosError(error)) {
          if (error.response) {
            message.error(`Login failed: ${error.response.data.message || 'Unknown error'}`);
          } else if (error.request) {
            message.error('No response received from the server. Please check your internet connection.');
          } else {
            message.error(`Error: ${error.message}`);
          }
        } else {
          message.error('Please input valid credentials!');
        }
      }
    };

    const handleLoginByProvider = async (provider: string) => {
      try {
        let response;
        if(provider==='google') response = await dispatch(requestUserLoginByGoogle());
        if(provider==='github') response = await dispatch(requestUserLoginByGithub());
        navigate('/home');
        console.log(response, " : provider respose ----------");
        message.success('Logged in using gmail successfully!');
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
                      onFinish={handleLoginButton as any}
                      onFinishFailed={onFinishFailed as any}
                    >
                      <Form.Item<FieldType>
                        label="Enter your registered email"
                        name="email"
                        rules={getEmailValidationRules()}
                      >
                        <StyledInput 
                          placeholder="example@gmail.com"
                        />
                      </Form.Item>

                      <Form.Item<FieldType>
                        label="Enter your password correctly"
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
                          <RememberForgotPasswordButton type="link" onClick={handleForgotPassword}>Forgot Password?</RememberForgotPasswordButton>
                        </RememberForgotContainer>
                      </Form.Item>

                      {
                          isModalOpen && 
                          <ForgotPasswordModal
                            isModalOpen={isModalOpen}
                            setIsModalOpen={setIsModalOpen}
                          />
                      }

                      <Form.Item>
                        <LoginButton>
                          <StyledLoginButton type="primary" htmlType="submit">
                            LOG IN
                          </StyledLoginButton>
                        </LoginButton>
                      </Form.Item>

                      <StyledDivider>
                        <Divider plain>or</Divider>
                      </StyledDivider>

                      <LoginButtonGroups>
                        <StyledGoogleButton icon={<GoogleOutlined />} onClick={() => handleLoginByProvider('google')}/>
                        <StyledGithubButton icon={<GithubOutlined />} onClick={() => handleLoginByProvider('github')}/>
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

const PageDivision = styled.div`
  height: 100%;
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginPageBackground1 = styled(PageDivision)`
  background-image: url(${BackgroundImage});
  background-size: cover;
`;

const LoginPageBackground2 = styled(PageDivision)`
  background-color: ${colors.lightGray};
`;

const LoginPageContent = styled.div`
  margin-top: -4%;
  width: 80%;
  max-width: 100%;
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

export const StyledInput = styled(Input)`
  height: 5.2vh;
  width: 96%;
  border: none;
`;

export const StyledPasswordInput = styled(Input.Password)`
  height: 5.2vh;
  width: 96%;
  border: none;
  .ant-input {
    height: 100%;
    border: none;
  }
  .ant-input-password-icon {
    color: ${colors.charcoalBlack};
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
  margin-left: 0.5em;
`;

const RememberForgotPasswordButton = styled(Button)`
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

const LoginButton = styled.div`
  margin-top: -8%;
`;

const StyledLoginButton = styled(Button)`
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

const StyledThirdPartyButton = styled(Button)`
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
    border-radius: 1.2em;
    border: none;
    font-weight: bold;
  }
`;

export const StyledGoogleButton = styled(StyledThirdPartyButton)`
  background-color: ${colors.tomatoRed};
  &&&:hover, &&&:focus {
    .anticon {
        color: ${colors.tomatoRed};
    }
  } 
`;

export const StyledGithubButton = styled(StyledThirdPartyButton)`
  background-color: ${colors.black};
  color: ${colors.white};

  &&&:hover, &&&:focus {
    background-color: ${colors.white};
    color: ${colors.black};
  }
`;

export const CenteringTheDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginButtonGroups = styled(CenteringTheDiv)`
  gap: 6%;
  margin-top: -1.5%;
`;

const NewAccount = styled(CenteringTheDiv)`
  width: 100%;
  font-size: 118%;
  margin-top: 6%;
`;

const CreateNewAccount = styled.div``;

const SignupButton = styled.div`
  margin-left: -2%;
`;

const StyledSignupButton = styled(Button)`
  color: ${colors.ashGray};
  font-size: 100%;
  font-weight: bold;
  &&&:hover {
    color: ${colors.semiAshGray};
  }
`;