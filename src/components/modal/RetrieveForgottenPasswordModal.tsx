import React from 'react';
import { Modal, Button } from 'antd';
import styled from 'styled-components';
import { ColorBlack, ColorWhite, ColorRed } from '../../assets/themes/color';

type RetrieveForgottenPasswordModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

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
            <p>Access credentials have been delivered to your registered room's email. Keep an eye on your inbox to stay organized and clutter-free!</p>
        </StyledModal>
    );
}

export default RetrieveForgottenPasswordModal;

const StyledModal = styled(Modal)`
    width: 43% !important;

    .ant-modal-content {
        background-color: ${ColorBlack.black} !important;
        color: ${ColorWhite.white};
        border-radius: 1.5rem !important;
    }

    .ant-modal-header {
        background-color: ${ColorBlack.black} !important;
        color: ${ColorWhite.white};
        border-radius: 1.5rem !important;
    }

    .ant-modal-title {
        color: ${ColorWhite.white} !important;
        font-size: 200%;
        font-weight: bold;
    }

    .ant-modal-close-x {
        color: ${ColorWhite.white} !important;
    }

    .ant-modal-body {
        color: ${ColorWhite.white};
        height: 12vh;
        font-size: 115%;
    }

    .ant-modal-footer {
        background-color: ${ColorBlack.black} !important;
        color: ${ColorWhite.white};
        display: flex;
        justify-content: center;
        margin-top: 2%;
        gap: 3%;
        border-radius: 1.5rem !important;
    }
`;

const StyledCancelButton = styled(Button)`
    flex: 1;
    max-width: 40%;
    height: 5.4vh;
    background-color: ${ColorBlack.black} !important;
    border-color: ${ColorWhite.white} !important;
    color: ${ColorWhite.white} !important;

    &&&:hover, &&&:focus {
        background-color: ${ColorWhite.white} !important;
        border-color: ${ColorBlack.black} !important;
        color: ${ColorBlack.black} !important;
    }
`;

const StyledWooHooButton = styled(Button)`
    flex: 1;
    max-width: 40%;
    height: 5.4vh;
    background-color: ${ColorRed.candleAppleRed} !important;
    border-color: ${ColorRed.candleAppleRed} !important;
    color: ${ColorWhite.white} !important;

    &&&:hover, &&&:focus {
        background-color: ${ColorWhite.white} !important;
        border-color: ${ColorBlack.black} !important;
        color: ${ColorBlack.black} !important;
    }
`;
