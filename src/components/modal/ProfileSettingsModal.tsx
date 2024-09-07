import { useCallback, useEffect, useState } from 'react';
import { Menu, Modal, Spin, Skeleton } from 'antd'; // Import Skeleton
import type { MenuProps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { FaUserLarge } from "react-icons/fa6";
import { MdOutlineManageAccounts } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import styled from 'styled-components';
import { colors } from '../../assets/themes/color';
import { Profile } from '../../utils/utils';
import ProfileSetttingsContentModal from './ProfileSetttingsContentModal';
import AccountSettingsContentModal from './AccountSettingsContentModal';
import SubscriptionSettingsContentModal from './SubscriptionSettingsContentModal';
import { fetchCurrentUserDetails } from '../../helpers/helpers';

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

export const StyledLoadingOutlined = styled(LoadingOutlined)`
    font-size: 18;
`;

const StyledMdOutlineManageAccounts = styled(MdOutlineManageAccounts)`
    font-size: 140%;
`;

type MenuItem = Required<MenuProps>['items'][number];

type ProfileSettingsModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const items: MenuItem[] = [
    { key: '1', icon: <FaUserLarge />, label: 'Profile' },
    { key: '2', icon: <StyledMdOutlineManageAccounts/>, label: 'Account' },
    { key: '3', icon: <RxUpdate />, label: 'Subscription' },    
];

const ProfileSettingsModal = (props: ProfileSettingsModalProps) => {
    const { isModalOpen, setIsModalOpen } = props;
    const [selectedKey, setSelectedKey] = useState<string>('1');
    const [profile, setProfile] = useState<Profile>({
        full_name: '',
        nick_name: '',
        email: '',
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const customSpinIcon = <StyledLoadingOutlined spin />;

    const getUserByEmail = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const userData = await fetchCurrentUserDetails();
            if (userData) {
                setProfile({
                    full_name: userData.full_name || '',
                    nick_name: userData.nick_name || '',
                    email: userData.email || '',
                });
            } else {
                console.log("No user found with that email.");
                setError("No user found with that email.");
            }
        } catch (error) {
            setError("Failed to fetch user data.");
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isModalOpen && selectedKey === '1') {
            getUserByEmail();
        }
    }, [isModalOpen, selectedKey, getUserByEmail]);

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
            <Spin spinning={loading} indicator={customSpinIcon} >
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
                        {error && <div>{error}</div>}
                        <Skeleton loading={loading} active>
                            {selectedKey === '1' && 
                                <ProfileSetttingsContentModal 
                                    profile={profile}
                                    setProfile={setProfile} 
                                />
                            }
                            {selectedKey === '2' && 
                                <AccountSettingsContentModal
                                    profile={profile}
                                    setSelectedKey={setSelectedKey}
                                />
                            }
                            {selectedKey === '3' && 
                                <SubscriptionSettingsContentModal
                                    setIsModalOpen={setIsModalOpen}
                                    setSelectedKey={setSelectedKey}
                                />
                            }
                        </Skeleton>
                    </ProfileSettingsModalContentDetails>
                </ProfileSettingsModalContent>
            </Spin>
        </StyledProfileSettingsModal>
    );
};

export default ProfileSettingsModal;