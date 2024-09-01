import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button, message, Typography } from "antd";
import axios from "axios";
import { auth } from "../config/firebase.config";
import { colors } from "../assets/themes/color";

const OTPVerificationPage = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorIndex, setErrorIndex] = useState<number | null>(null);
    const inputRefs = useRef<HTMLInputElement[]>([]);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        const newOtp = [...otp];
        newOtp[index] = value.slice(0, 1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const otpString = otp.join("");
            console.log('otp:: ', otpString);
            
            const response = await axios.post('http://localhost:5002/verify-otp', { email: auth.currentUser?.email, otp: otpString });
            if (response.data.success) {
                navigate('/home');
            } else {
                message.error(response.data.message);
                setErrorIndex(response.data.errorIndex);
                setOtp(["", "", "", "", "", ""]);
            }
        } catch (error) {
            message.error('Error verifying OTP');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/login');
    };

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    return (
        <OTPVerification>
            <OTPContainerOuterSpace>
                <OTPContainerInnerSpace>
                    <Header>
                        <Title level={2}>Verification Code</Title>
                    </Header>
                    <Subtitle>We have sent the verification code to your registered email address</Subtitle>
                    <OTPContainer>
                        {otp.map((value, index) => (
                            <OTPInput
                                key={index}
                                type="text"
                                value={value}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => el && (inputRefs.current[index] = el)}
                                maxLength={1}
                                isError={index === errorIndex}
                            />
                        ))}
                    </OTPContainer>
                    <ButtonsContainer>
                        <CancelButton onClick={handleCancel}>Cancel</CancelButton>
                        <VerifyButton type="primary" onClick={handleSubmit} loading={isSubmitting}>Verify</VerifyButton>
                    </ButtonsContainer>
                </OTPContainerInnerSpace>
            </OTPContainerOuterSpace>
        </OTPVerification>
    );
};

export default OTPVerificationPage;

const OTPVerification = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100%;
    background-color: ${colors.silverGray};
`;

const OTPContainerOuterSpace = styled.div`
    background-color: ${colors.lightWhite};
    width: 27%;
    height: 37vh;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 2rem;
    border-radius: 2rem;
    box-shadow: 0px 14px 12px ${colors.veryLightBlack};
`;

const OTPContainerInnerSpace = styled.div`
    margin: 3%;
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 0.3rem;
`;

const Title = styled(Typography.Title)`
    margin: 0;
    line-height: 1 !important;
    font-weight: bold !important;
    margin-left: -1%;
`;

const Subtitle = styled(Typography.Text)`
    font-size: 1rem;
    text-align: left;
    color: ${colors.ashGray};
`;

const OTPContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-top: 7%;
    justify-content: flex-start;
`;

const OTPInput = styled.input<{ isError?: boolean }>`
    width: 2rem;
    height: 2rem;
    text-align: center;
    font-size: 1rem;
    border-radius: 0.5rem;
    border: 1px solid ${props => props.isError ? colors.red : colors.softGray};
    outline: none;
    &:focus {
        border-color: ${colors.grayishBlue};
        box-shadow: 0 0 0 2px ${colors.lightGray};
    }
`;

const ButtonsContainer = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    width: 100%;
    justify-content: center;
`;

const ActionButton = styled(Button)`
    width: 40%;
    border-radius: 3rem;
    font-size: 1rem;
    border: none;
    height: 6vh;
    color: ${colors.white};
    &&&:hover{
        background-color: ${colors.lightGray};
    }
`;

const VerifyButton = styled(ActionButton)`
    background-color: ${colors.wineRed};
    &&&:hover{
        color: ${colors.wineRed};
    }
`;

const CancelButton = styled(ActionButton)`
    background-color: ${colors.denimBlue};
    &&&:hover{
        color: ${colors.denimBlue};
    }
`;
