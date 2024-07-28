import styled from "styled-components";
import BackgroundImage from "../assets/images/SignupPageBackground.jpg";
import { ColorBlack, ColorBlue, ColorRed, ColorWhite } from "../assets/themes/color";
import Title from "antd/es/typography/Title";
import type { FormProps } from 'antd';
import { Button, Divider, Form, Input } from 'antd';
import { GoogleOutlined, FacebookOutlined, XOutlined } from "@ant-design/icons";

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

const SignupPage = () => {
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
                            onFinish={onFinish as any}
                            onFinishFailed={onFinishFailed as any}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Create your room's email"
                                name="email"
                                rules={getEmailValidationRules()}
                            >
                                <Input placeholder="example@gmail.com" style={{ height: '5.2vh', width: '100%', border: 'none' }}/>
                            </Form.Item>

                            <Form.Item
                                label="Create your storage password"
                                name="password"
                                rules={getPasswordValidationRules()}
                                style={{ marginTop: '-3%' }}
                            >
                                <Input.Password placeholder="****************" style={{ height: '6vh', width: '100%', border: 'none' }}/>
                            </Form.Item>

                            <Form.Item
                                name="confirm"
                                label="Confirm Password"
                                dependencies={['password']}
                                hasFeedback
                                style={{ marginTop: '-3%' }}
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
                                <Input.Password placeholder="****************" style={{ height: '5.2vh', width: '100%', border: 'none' }}/>
                            </Form.Item>

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
                                <StyledGoogleButton icon={<GoogleOutlined />} />
                                <StyledFacebookButton icon={<FacebookOutlined />} />
                                <StyledTwitterButton icon={<XOutlined />} />
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
    background-color: ${ColorBlack.lightSemiTransparentBlack}; 
    font-family: "Poppins", sans-serif;   
`;

const SignupPageTitle = styled.div`
    margin-bottom: -1rem;
    margin-top: -1.8rem;
    text-align: center;
`;

const StyledTitle = styled(Title)`
    font-size: 3.5rem !important;
    font-weight: 700 !important;
    color: ${ColorWhite.white} !important;
`;

const SignupPageSubtitle = styled.div`
    margin-bottom: 2rem;
    text-align: center;
`;

const StyledSubtitle = styled.div`
    font-size: 0.9rem;
    font-weight: 100;
    color: ${ColorWhite.white};
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
        color: ${ColorWhite.white} !important; 
    }

    .ant-form-item-explain-error {
        color: ${ColorWhite.white}; 
        font-size: 0.8rem;
    }
`;

const SignupPageDivider = styled.div`
    margin-top: -8%;
    margin-bottom: -3%;
`;

const StyledDivider = styled(Divider)`
    width: 100%;
    margin: 1rem 0; /* Adjust spacing around the divider */
    color: ${ColorWhite.white};
    border-color: ${ColorWhite.white};
`;

const StyledDividerText = styled.p`
    color: ${ColorWhite.white} !important;
    text-align: center;
    font-size: 130%;
`;

const GetClutterFreeButton = styled.div`
    margin-bottom: 1rem; 
    display: flex;
    justify-content: center;
`;

const StyledGetClutterFreeButton = styled(Button)`
    width: 100%;
    height: 6vh;
    border-radius: 12px;
    background-color: ${ColorRed.candleAppleRed};
    border: none;
    font-weight: bold;
    font-size: 110%;
    margin-top: 6%;
    &&&:hover {
        background-color: ${ColorWhite.white};
        color: ${ColorRed.candleAppleRed};
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
        color: ${ColorWhite.white};
    }

    &&&:hover, &&&:focus {
        background-color: ${ColorWhite.white};
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
    background-color: ${ColorRed.tomatoRed};
    &&&:hover, &&&:focus {
        .anticon {
            color: ${ColorRed.tomatoRed};
        }
    } 
`;

const StyledFacebookButton = styled(StyledThirdPartySignupButton)`
    background-color: ${ColorBlue.denimBlue};
    &&&:hover, &&&:focus {
        .anticon {
            color: ${ColorBlue.denimBlue};
        }
    }
`;

const StyledTwitterButton = styled(StyledThirdPartySignupButton)`
    background-color: ${ColorBlack.black};
    &&&:hover, &&&:focus {
        .anticon {
            color: ${ColorBlack.black};
        }
    }
`;
