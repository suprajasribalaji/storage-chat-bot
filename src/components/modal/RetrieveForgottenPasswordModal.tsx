import React from 'react';
import { Modal, Button } from 'antd';
import styled from 'styled-components';
import { colors } from '../../assets/themes/color';

type RetrieveForgottenPasswordModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// mute panitu thittu 

const RetrieveForgottenPasswordModal: React.FC<RetrieveForgottenPasswordModalProps> = ({ isModalOpen, setIsModalOpen }) => {
    return (
        <StyledModal
            title="Email Sent Successfully"
            centered
            open={isModalOpen}
            onOk={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
            footer={[
                <StyledCancelButton
                    key="cancel"
                    onClick={() => setIsModalOpen(false)}
                >
                    Cancel
                </StyledCancelButton>,
                <StyledWooHooButton
                    key="ok"
                    type="primary"
                    onClick={() => setIsModalOpen(false)}
                >
                    Woo-Hoo
                </StyledWooHooButton>,
            ]}
        >
            <Button>Send Credentials via email</Button>
            <p>Access credentials have been delivered to your registered room's email. Keep an eye on your inbox to stay organized and clutter-free!</p>
        </StyledModal>
    );
}

export default RetrieveForgottenPasswordModal;

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
        font-size: 150%;
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

const StyledButton = styled(Button)`
    flex: 1;
    max-width: 40%;
    height: 6.2vh;
    color: ${colors.white} !important;
    &&&:hover, &&&:focus {
        background-color: ${colors.white} !important;
        border-color: ${colors.white} !important;
        color: ${colors.black} !important;
    }
`;

const StyledCancelButton = styled(StyledButton)`
    background-color: ${colors.blueGray} !important;
    border-color: ${colors.blueGray} !important;
`;

const StyledWooHooButton = styled(StyledButton)`
    background-color: ${colors.raisinBlack} !important;
    border-color: ${colors.raisinBlack} !important;
`;