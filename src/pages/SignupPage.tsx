import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Title from "antd/es/typography/Title";
import type { FormProps } from 'antd';
import { Button, Divider, Form, message } from 'antd';
import { GoogleOutlined, GithubOutlined } from "@ant-design/icons";
import BackgroundImage from "../assets/images/SignupPageBackground.jpg";
import { colors } from "../assets/themes/color";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { requestUserLoginByGithub, requestUserLoginByGoogle } from "../redux/slices/user/login";
import { requestUserSignup } from "../redux/slices/user/signup";
import { CenteringTheDiv, StyledGithubButton, StyledGoogleButton, StyledInput, StyledPasswordInput } from "./LoginPage";
import { FieldType } from "../utils/utils";
import { getEmailValidationRules, getPasswordValidationRules } from "../utils/validation";
import { useState } from "react";

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Form submission failed. Please check the fields and try again.');
};

const SignupPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [isSignupLoading, setIsSignupLoading] = useState<boolean>(false);
    const [isGoogleProviderLoading, setIsGoogleProviderLoading] = useState<boolean>(false);
    const [isGithubProviderLoading, setIsGithubProviderLoading] = useState<boolean>(false);

    const handleSignupButton: FormProps<FieldType>['onFinish'] = async (values: FieldType) => {
        console.log('Success:', values);
        const { email, password } = values;
        setIsSignupLoading(true);
        try {
            const response = await dispatch(requestUserSignup({email, password})).unwrap();
            navigate('/home');
            console.log(response, "this is the response ====>")
            message.success('Signed up successfully!!');
        } catch (error) {
            console.error('Signup failed:', error);
            message.error('Signup failed. Please check your credentials.');
        } finally {
            setIsSignupLoading(false);
          }
    };

    const handleLoginByProvider = async (provider: string, setLoading: (loading: boolean) => void) => {
        setLoading(true);
        try {
          if(provider==='google') await dispatch(requestUserLoginByGoogle());
          else if(provider==='github') await dispatch(requestUserLoginByGithub());
          navigate('/home');
          message.success('Logged in successfully!');
        } catch (error) {
          console.error('Login failed:', error);
          message.error('Login failed. Please check your credentials.');
          navigate('/login');
        } finally {
          setLoading(false);
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
                            name="signup-form"
                            layout="vertical"
                            initialValues={{ remember: true }}
                            onFinish={handleSignupButton as any}
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
                                <SignupButton>
                                    <StyledSignupButton type="primary" htmlType="submit" loading={isSignupLoading}>
                                        SIGN UP
                                    </StyledSignupButton>
                                </SignupButton>
                            </Form.Item>

                            <SignupPageDivider>
                                <StyledDivider plain><StyledDividerText>or</StyledDividerText></StyledDivider>
                            </SignupPageDivider>

                            <SignupButtonGroups>
                                <StyledGoogleSignupButton icon={<GoogleOutlined />} onClick={() => handleLoginByProvider('google', setIsGoogleProviderLoading)} loading={isGoogleProviderLoading}/>
                                <StyledGithubSignupButton icon={<GithubOutlined />} onClick={() => handleLoginByProvider('github', setIsGithubProviderLoading)} loading={isGithubProviderLoading}/>
                            </SignupButtonGroups>
                        </StyledSignupPageForm>
                    </StyledForm>
                </SignupPageForm>
            </SignupPageContent>
        </StyledSigupPage>
    );
};

export default SignupPage;

const StyledSigupPage = styled(CenteringTheDiv)`
    height: 100vh;
    width: 100%;
    background-image: url(${BackgroundImage});
    background-size: cover;
    background-position: center;
`;

const SignupPageContent = styled(CenteringTheDiv)`
    width: 42%;
    height: 90vh;
    flex-direction: column;
    border-radius: 30px;
    margin-left: 38%;
    background-color: ${colors.lightSemiTransparentBlack}; 
    font-family: "Poppins", sans-serif;   
`;

const SignupPageTitle = styled.div`
    margin: -1.8rem 0 -1rem 0;
    text-align: center;
`;

const StyledTitle = styled(Title)`
    font-size: 2.8rem !important;
    font-weight: 700 !important;
    color: ${colors.white} !important;
`;

const SignupPageSubtitle = styled.div`
    margin: 0.2rem 0 2rem 0;
    text-align: center;
`;

const StyledSubtitle = styled.div`
    font-size: 0.9rem;
    font-weight: 100;
    color: ${colors.white};
`;

const SignupPageForm = styled(CenteringTheDiv)`
    width: 100%;
    flex-direction: column;
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

const SignupPageDivider = styled.div`
    margin: -8% 0 -3% 0;
`;

const StyledDivider = styled(Divider)`
    width: 100%;
    margin: 1rem 0;
    color: ${colors.white};
    border-color: ${colors.white};
`;

const StyledDividerText = styled.p`
    color: ${colors.white} !important;
    text-align: center;
    font-size: 130%;
`;

const SignupButton = styled(CenteringTheDiv)`
    margin-bottom: 0.2rem;
`;

const StyledSignupButton = styled(Button)`
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

const SignupButtonGroups = styled(CenteringTheDiv)`
    gap: 6%;
    width: 100%;
`;

const StyledGoogleSignupButton = styled(StyledGoogleButton)`
    width: 45% !important;
`;

const StyledGithubSignupButton = styled(StyledGithubButton)`
    width: 45% !important;
`;

