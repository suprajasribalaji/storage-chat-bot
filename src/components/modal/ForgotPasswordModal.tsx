import React from 'react';
import { Modal, Button, Input, Form, notification } from 'antd';
import type { FormProps } from 'antd';
import styled from 'styled-components';
import { colors } from '../../assets/themes/color';
import axios from 'axios';

type RetrieveCredentialsModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type FieldType = {
    email: string;
}

const getEmailValidationRules = () => {
    return [
        { required: true, message: 'Please input your email!' },
        { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Please enter a valid email address!' },
    ];
};

const RetrieveCredentialsModal: React.FC<RetrieveCredentialsModalProps> = ({ isModalOpen, setIsModalOpen }) => {

    const handleSendEmail: FormProps<FieldType>['onFinish'] = async (value) => {
        const { email } = value;
        try {
            const response = await axios.post('http://localhost:5001/send-credentials', { to: email });
            if (response.status === 200) {
                setIsModalOpen(false);
                notification.success({
                    message: 'Success',
                    description: 'Email Sent Successfully!',
                    placement: 'topRight',
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to send email!',
                    placement: 'topRight',
                });
                console.log(response.status + ": " + response.statusText);
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'An error occurred while sending the email.',
                placement: 'topRight',
            });
            console.log(error);
        }
    };

    return (
        <StyledModal
            title="Forgot Password"
            centered
            open={isModalOpen}
            onOk={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
        >
            <RetrieveCredentials>
                <Form
                    name='retrieve-credentials'
                    onFinish={handleSendEmail}
                >
                    <FlexContainer>
                        <Form.Item
                            name="email"
                            rules={getEmailValidationRules()}
                            style={{ flex: 1 }}
                        >
                            <StyledInput placeholder='Enter your registered email' />
                        </Form.Item>
                        <Form.Item style={{ marginLeft: '8px' }}>
                            <StyledButton htmlType='submit'>Send</StyledButton>
                        </Form.Item>
                    </FlexContainer>
                </Form>
            </RetrieveCredentials>
        </StyledModal>
    );
}

export default RetrieveCredentialsModal;

const StyledModal = styled(Modal)`
    width: 37% !important;

    .ant-modal-content {
        background-color: ${colors.lightGray} !important;
        color: ${colors.black};
        border-radius: 30px !important;
    }

    .ant-modal-header {
        background-color: ${colors.lightGray} !important;
        color: ${colors.black};
        border-radius: 1.5rem !important;
    }

    .ant-modal-title {
        color: ${colors.black} !important;
        font-size: 130%;
        font-weight: bold;
    }

    .ant-modal-close-x {
        color: ${colors.black} !important;
    }

    .ant-modal-body {
        color: ${colors.black};
        height: 9vh;
        font-size: 100%;
    }

    .ant-modal-footer {
        background-color: ${colors.lightGray} !important;
        color: ${colors.white};
        display: flex;
        justify-content: center;
        margin-bottom: 1%;
        gap: 3%;
        border-radius: 1.5rem !important;
    }
`;

const RetrieveCredentials = styled.div`
    display: flex;
    gap: 4%;
    margin-top: 6%;
`;

const FlexContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const StyledInput = styled(Input)`
    border: none;
    width: 164%;
`;

const StyledButton = styled(Button)`
    border: none;
    background-color: ${colors.wineRed};
    color: ${colors.white};
    white-space: nowrap;
    margin-left: 200%;

    &&&:hover {
        background-color: ${colors.white};
        color: ${colors.wineRed};
    }
`;
