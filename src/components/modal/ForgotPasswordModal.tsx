import React, { useCallback } from 'react';
import { Modal, Button, Input, Form, notification } from 'antd';
import type { FormProps } from 'antd';
import styled from 'styled-components';
import { colors } from '../../assets/themes/color';
import { FieldType } from '../../utils/utils';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { requestResetPassword } from '../../redux/slices/user/api';
import { getEmailValidationRules } from '../../utils/validation';

type RetrieveCredentialsModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const RetrieveCredentialsModal = ( props: RetrieveCredentialsModalProps ) => {
    const { isModalOpen, setIsModalOpen } = props;
    const dispatch = useAppDispatch();
    
    const handleSendEmail: FormProps<FieldType>['onFinish'] = useCallback(async (value: any) => {
        const { email } = value;
        try {
            const response = await dispatch(requestResetPassword({ email }));
            if (response.meta.requestStatus === 'fulfilled') {
                setIsModalOpen(false);
                notification.success({
                    message: 'Success',
                    description: 'Email Sent Successfully!',
                    placement: 'topRight',
                });
            } else {
                throw new Error('Failed to send email');
            }
        } catch (error: any) {
            notification.error({
                message: 'Error',
                description: error.message || 'An error occurred while sending the email.',
                placement: 'topRight',
            });
        }
    }, [dispatch, setIsModalOpen]);

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
                        <StyledFormItem
                            name="email"
                            rules={getEmailValidationRules()}
                            
                        >
                            <StyledInput placeholder='Enter your registered email' />
                        </StyledFormItem>
                        <StyledFormItem>
                            <StyledButton htmlType='submit'>Send</StyledButton>
                        </StyledFormItem>
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

const StyledFormItem = styled(Form.Item)`
    flex: 1;
`;

const StyledInput = styled(Input)`
    border: none;
    width: 240%;
`;

const StyledButton = styled(Button)`
    border: none;
    background-color: ${colors.wineRed};
    color: ${colors.white};
    white-space: nowrap;
    margin-left: 150%;

    &&&:hover {
        background-color: ${colors.white};
        color: ${colors.wineRed};
    }
`;
