import styled from "styled-components";
import BackgroundImage from "../assets/images/SignupPageBackground.jpg";
import { colors } from "../assets/themes/color";
import Title from "antd/es/typography/Title";
import type { FormProps } from 'antd';
import { Button, Divider, Form, Input, message } from 'antd';
import { GoogleOutlined, GithubOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { requestUserLoginByGithub } from "../redux/slices/login";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { requestUserSignup } from "../redux/slices/signup";

type FieldType = {
    email: string;
    password: string;
    remember?: string;
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

const SignupPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleGetClutterFreeButton: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('Success:', values);
        const { email, password } = values;
        try {
            const response = await dispatch(requestUserSignup({email, password})).unwrap();
            navigate('/home');
            console.log(response, "this is the response ====>")
            message.success('Logged in successfully!');
        } catch (error) {
            console.error('Login failed:', error);
            message.error('Login failed. Please check your credentials.');
        }
      };

    const handleGoogleProviderButton = async () =>{
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
    return (
        <StyledSigupPage>
            <SignupPageContent>
                <SignupPageTitle>
                    <StyledTitle>Sign up</StyledTitle>
                </SignupPageTitle>
                <SignupPageSubtitle>
                    <StyledSubtitle>Safeguard and organized for clutter free Spaces</StyledSubtitle>
                </SignupPageSubtitle>
                <SignupPageForm>
                    <StyledForm>
                        <StyledSignupPageForm
                            name="login-form"
                            layout="vertical"
                            initialValues={{ remember: true }}
                            onFinish={handleGetClutterFreeButton as any}
                            onFinishFailed={onFinishFailed as any}
                            autoComplete="off"
                        >
                            <StyledFormItem
                                label="Create your room's email"
                                name="email"
                                rules={getEmailValidationRules()}
                            >
                                <StyledInput placeholder="example@gmail.com"/>
                            </StyledFormItem>

                            <StyledFormItem
                                label="Create your storage password"
                                name="password"
                                rules={getPasswordValidationRules()}
                            >
                                <StyledPasswordInput placeholder="****************"/>
                            </StyledFormItem>

                            <StyledFormItem
                                name="confirm"
                                label="Confirm Password"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please confirm your password!',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('The passwords you entered do not match!'));
                                        },
                                    }),
                                ]}
                            >
                                <StyledPasswordInput placeholder="****************" />
                            </StyledFormItem>

                            <Form.Item>
                                <GetClutterFreeButton>
                                    <StyledGetClutterFreeButton type="primary" htmlType="submit">
                                        Get Clutter-Free
                                    </StyledGetClutterFreeButton>
                                </GetClutterFreeButton>
                            </Form.Item>

                            <SignupPageDivider>
                                <StyledDivider plain><StyledDividerText>or</StyledDividerText></StyledDivider>
                            </SignupPageDivider>

                            <SignupButtonGroups>
                                <StyledGoogleButton icon={<GoogleOutlined />} onClick={handleGoogleProviderButton}/>
                                <StyledGithubButton icon={<GithubOutlined />} onClick={handleGithubProviderButton}/>
                            </SignupButtonGroups>
                        </StyledSignupPageForm>
                    </StyledForm>
                </SignupPageForm>
            </SignupPageContent>
        </StyledSigupPage>
    );
};

export default SignupPage;

const StyledSigupPage = styled.div`
    height: 100vh;
    width: 100%;
    background-image: url(${BackgroundImage});
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const SignupPageContent = styled.div`
    width: 42%;
    height: 90vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 30px;
    margin-left: 38%;
    background-color: ${colors.lightSemiTransparentBlack}; 
    font-family: "Poppins", sans-serif;   
`;

const SignupPageTitle = styled.div`
    margin-bottom: -1rem;
    margin-top: -1.8rem;
    text-align: center;
`;

const StyledTitle = styled(Title)`
    font-size: 2.8rem !important;
    font-weight: 700 !important;
    color: ${colors.white} !important;
`;

const SignupPageSubtitle = styled.div`
    margin-bottom: 2rem;
    text-align: center;
`;

const StyledSubtitle = styled.div`
    font-size: 0.9rem;
    font-weight: 100;
    color: ${colors.white};
`;

const SignupPageForm = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const StyledForm = styled.div`
    width: 68%;
    margin-top: 1%;
`;

const StyledSignupPageForm = styled(Form)`
    .ant-form-item-label > label {
        color: ${colors.white} !important; 
    }

    .ant-form-item-explain-error {
        color: ${colors.white}; 
        font-size: 0.8rem;
    }
`;

const StyledFormItem = styled(Form.Item)`
    margin-top: -3%;
`;

const StyledInput = styled(Input)`
    height: 5.2vh;
    width: 100%;
    border: none;
`;

const StyledPasswordInput = styled(StyledInput).attrs({ type: 'password' })``;

const SignupPageDivider = styled.div`
    margin-top: -8%;
    margin-bottom: -3%;
`;

const StyledDivider = styled(Divider)`
    width: 100%;
    margin: 1rem 0; /* Adjust spacing around the divider */
    color: ${colors.white};
    border-color: ${colors.white};
`;

const StyledDividerText = styled.p`
    color: ${colors.white} !important;
    text-align: center;
    font-size: 130%;
`;

const GetClutterFreeButton = styled.div`
    margin-bottom: 0.2rem; 
    display: flex;
    justify-content: center;
`;

const StyledGetClutterFreeButton = styled(Button)`
    width: 100%;
    height: 6vh;
    border-radius: 12px;
    background-color: ${colors.raisinBlack};
    border: none;
    font-weight: bold;
    font-size: 110%;
    margin-top: 6%;
    &&&:hover {
        background-color: ${colors.white};
        color: ${colors.raisinBlack};
    }
`;

const SignupButtonGroups = styled.div`
    display: flex;
    justify-content: center;
    gap: 6%;
    width: 100%;
`;

const StyledThirdPartySignupButton = styled(Button)`
    .anticon {
        color: ${colors.white};
    }

    &&&:hover, &&&:focus {
        background-color: ${colors.white};
    } 

    &&& {
        width: 100%;
        height: 5.8vh;
        border-radius: 14px;
        border: none;
        font-weight: bold;
    }
`;

const StyledGoogleButton = styled(StyledThirdPartySignupButton)`
    background-color: ${colors.tomatoRed};
    &&&:hover, &&&:focus {
        .anticon {
            color: ${colors.tomatoRed};
        }
    } 
`;

const StyledGithubButton = styled(StyledThirdPartySignupButton)`
    background-color: ${colors.black};
    color: ${colors.white};

    &&&:hover, &&&:focus {
        background-color: ${colors.white};
        color: ${colors.black};

        .anticon {
            color: ${colors.black};
        }
    }

    .anticon {
        color: ${colors.white};
    }
`;

