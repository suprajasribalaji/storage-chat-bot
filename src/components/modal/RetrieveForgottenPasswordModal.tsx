import React from 'react';
import { Modal, Button } from 'antd';
import styled from 'styled-components';
import { ColorBlack, ColorWhite, ColorRed, ColorGray } from '../../assets/themes/color';

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
    width: 37% !important;

    .ant-modal-content {
        background-color: ${ColorGray.lightGray} !important;
        color: ${ColorBlack.black};
        border-radius: 30px !important;
    }

    .ant-modal-header {
        background-color: ${ColorGray.lightGray} !important;
        color: ${ColorBlack.black};
        border-radius: 1.5rem !important;
    }

    .ant-modal-title {
        color: ${ColorBlack.black} !important;
        font-size: 150%;
        font-weight: bold;
    }

    .ant-modal-close-x {
        color: ${ColorBlack.black} !important;
    }

    .ant-modal-body {
        color: ${ColorBlack.black};
        height: 9vh;
        font-size: 100%;
    }

    .ant-modal-footer {
        background-color: ${ColorGray.lightGray} !important;
        color: ${ColorWhite.white};
        display: flex;
        justify-content: center;
        margin-bottom: 1%;
        gap: 3%;
        border-radius: 1.5rem !important;
    }
`;

const StyledCancelButton = styled(Button)`
    flex: 1;
    max-width: 40%;
    height: 6.2vh;
    background-color: ${ColorGray.blueGray} !important;
    border-color: ${ColorGray.blueGray} !important;
    color: ${ColorWhite.white} !important;

    &&&:hover, &&&:focus {
        background-color: ${ColorWhite.white} !important;
        border-color: ${ColorWhite.white} !important;
        color: ${ColorBlack.black} !important;
    }
`;

const StyledWooHooButton = styled(Button)`
    flex: 1;
    max-width: 40%;
    height: 6.2vh;
    background-color: ${ColorBlack.raisinBlack} !important;
    border-color: ${ColorBlack.raisinBlack} !important;
    color: ${ColorWhite.white} !important;

    &&&:hover, &&&:focus {
        background-color: ${ColorWhite.white} !important;
        border-color: ${ColorWhite.white} !important;
        color: ${ColorBlack.black} !important;
    }
`;
