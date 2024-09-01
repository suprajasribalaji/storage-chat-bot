import { useEffect, useState } from 'react';
import { Menu, Modal, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { FaUserLarge } from "react-icons/fa6";
import { MdOutlineManageAccounts } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import { colors } from '../../assets/themes/color';
import styled from 'styled-components';
import type { MenuProps } from 'antd';
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, document } from '../../config/firebase.config';
import ProfileSetttingsContentModal from './ProfileSetttingsContentModal';
import AccountSettingsContentModal from './AccountSettingsContentModal';
import SubscriptionSettingsContentModal from './SubscriptionSettingsContentModal';
import { Profile } from '../../utils/utils';

type MenuItem = Required<MenuProps>['items'][number];

type ProfileSettingsModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const items: MenuItem[] = [
    { key: '1', icon: <FaUserLarge />, label: 'Profile' },
    { key: '2', icon: <MdOutlineManageAccounts style={{ fontSize: '140%' }} />, label: 'Account' },
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

    const customSpinIcon = <LoadingOutlined style={{ fontSize: 18 }} spin />;

    useEffect(() => {
        if (isModalOpen && selectedKey === '1') {
            getUserByEmail();
        }
    }, [isModalOpen, selectedKey]);

    const handleMenuClick = (e: { key: string }) => {
        setSelectedKey(e.key);
    };

    const getUserByEmail = async () => {
        setLoading(true);
        try {
            const userQuery = query(collection(document, "Users"), where("email", "==", auth.currentUser?.email));
            const querySnapshot = await getDocs(userQuery);
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const userData = doc.data() as Profile;
                    setProfile({
                        full_name: userData.full_name || '',
                        nick_name: userData.nick_name || '',
                        email: userData.email || '',
                    });
                });
            } else {
                console.log("No user found with that email.");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
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
                    </ProfileSettingsModalContentDetails>
                </ProfileSettingsModalContent>
            </Spin>
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