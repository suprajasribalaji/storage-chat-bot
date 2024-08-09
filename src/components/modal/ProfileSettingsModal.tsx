import React, { useState } from 'react';
import { Menu, Modal } from 'antd';
import { FaUserLarge } from "react-icons/fa6";
import { MdOutlineManageAccounts } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import { colors } from '../../assets/themes/color';
import styled from 'styled-components';
import type { MenuProps } from 'antd';
import ProfileSetttingsContentModal from './ProfileSetttingsContentModal';
import AccountSettingsContentModal from './AccountSettingsContentModal';
import SubscriptionSettingsContentModal from './SubscriptionSettingsContentModal';

type MenuItem = Required<MenuProps>['items'][number];

type ProfileSettingsModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const items: MenuItem[] = [
    { key: '1', icon: <FaUserLarge />, label: 'Profile' },
    { key: '2', icon: <MdOutlineManageAccounts style={{ fontSize: '140%' }}/>, label: 'Account' },
    { key: '3', icon: <RxUpdate />, label: 'Subscription' },    
];

const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ isModalOpen, setIsModalOpen }) => {
    const [selectedKey, setSelectedKey] = useState<string>('1');

    const handleMenuClick = (e: { key: string }) => {
        setSelectedKey(e.key);
    };

    return (
    <StyledProfileSettingsModal
        title="Settings"
        centered
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
    >
        <ProfileSettingsModalContent>
            <ProfileSettingsModalContentMenu>
            <StyledMenu
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['1']}
                items={items}
                selectedKeys={[selectedKey]}
                onClick={handleMenuClick}
            />
            </ProfileSettingsModalContentMenu>
            <ProfileSettingsModalContentDetails>
                {selectedKey === '1' && <ProfileSetttingsContentModal />}
                {selectedKey === '2' && <AccountSettingsContentModal />}
                {selectedKey === '3' && <SubscriptionSettingsContentModal />}
            </ProfileSettingsModalContentDetails>
        </ProfileSettingsModalContent>
    </StyledProfileSettingsModal>
  );
};

export default ProfileSettingsModal;

const StyledProfileSettingsModal = styled(Modal)`
    width: 56% !important;

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
        margin-top: 1.5%;
        margin-left: 1%;
    }

    .ant-modal-close-x {
        color: ${colors.black} !important;
    }

    .ant-modal-body {
        color: ${colors.black};
        height: 60vh;
        font-size: 100%;
        margin-top: 2.5%;
    }
`;

const ProfileSettingsModalContent = styled.div`
    display: flex;
`;

const ProfileSettingsModalContentMenu = styled.div`
    width: 20%;
`;

const StyledMenu = styled(Menu)`
    background-color: ${colors.lightGray} !important;
    border-right: none !important;
    color: ${colors.black};

    .ant-menu-item-selected {
        background-color: ${colors.softDustyGray} !important;
    }

    .ant-menu-item {
        color: ${colors.black} !important;
    }

    .ant-menu-item:hover {
        background-color: ${colors.softDustyGray} !important;
    }
`;

const ProfileSettingsModalContentDetails = styled.div`
    width: 80%;
    padding-left: 3.5%;
    margin-top: 0.6%;
`;
