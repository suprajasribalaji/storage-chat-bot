import { IoMdSettings } from "react-icons/io";
import { AiOutlineLogout } from "react-icons/ai";
import { Button, Input, Menu, Dropdown } from "antd";
import { CloudUploadOutlined, SendOutlined } from '@ant-design/icons';
import styled from "styled-components";
import { colors } from "../assets/themes/color";
import type { MenuProps } from 'antd';
import ProfilePicture from "../assets/images/ProfilePicture.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProfileSettingsModal from "../components/modal/ProfileSettingsModal";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { requestUserLogout } from "../redux/slices/logout";

type MenuItem = Required<MenuProps>['items'][number];

const HomePage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

    const handleMenuItems = async (e: { key: string }) => {
      if(e.key === '1') {
        setIsProfileModalOpen(true);
      }
      if (e.key === '2') {
        await dispatch(requestUserLogout());
        navigate('/login');
      };
    };


    const items: MenuItem[] = [
        {
          key: '1',
          label: 'Settings',
          icon: <IoMdSettings style={{ paddingTop: '6%'}}/>,
          onClick: handleMenuItems,
        },
        {
          key: '2',
          label: 'Logout',
          icon: <AiOutlineLogout style={{ paddingTop: '6%'}}/>,
          onClick: handleMenuItems,
        }
      ];

    const menu = (
        <StyledMenu
            mode="vertical"
            items={items}
        />
    );

    return (
        <StyledHomePage>
            <HomePageNavBar>
                <HomePageHeader>
                    Warehouse
                </HomePageHeader>
                <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                    <CircleButton />
                </Dropdown>
            </HomePageNavBar>
            <ProfileSettingsModal
              isModalOpen={isProfileModalOpen}
              setIsModalOpen={setIsProfileModalOpen}
            />
            <HomePageContent>
                <ChatBoxInput>
                    <StyledChatInput 
                        placeholder="Are you looking to retrieve some data?" 
                        autoSize={{ minRows: 1, maxRows: 6 }}
                    />
                    <UploadButton icon={<UploadIcon />} />
                    <SendButton icon={<SendIcon />} />
                </ChatBoxInput>
            </HomePageContent>
        </StyledHomePage>
    );
};

export default HomePage;

const StyledHomePage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100vh;
  background-color: ${colors.paleBlue};
`;

const StyledMenu = styled(Menu)`
  background-color: ${colors.paleBlue};
  color: ${colors.deepOceanBlue};

  .ant-menu-item:hover {
    background-color: ${colors.deepOceanBlue};
    color: ${colors.paleBlue};
  }
`;

const HomePageNavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${colors.steelBlue};
  padding: 0.5% 0.9%;
  font-family: cursive;
`;

const HomePageHeader = styled.span`
  font-size: 130%;
`;

const CircleButton = styled(Button)`
  width: 3%;
  height: 6vh;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.5%;
  border: none;
  background-image: url(${ProfilePicture});
  background-size: cover;

  &&&:hover, &&&:focus {
    background-image: url(${ProfilePicture});
    background-size: cover;
  }
`;

const HomePageContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  overflow: auto;
`;

const ChatBoxInput = styled.div`
  width: 50%;
  display: flex;
  justify-content: flex-end;
  position: relative;
  margin-bottom: 2%;
`;

const StyledChatInput = styled(Input.TextArea)`
  width: 100%;
  min-height: 7vh !important;
  max-height: 20vh;
  border: none;
  border-radius: 40px;
  padding-right: 6rem; 
  z-index: 1;
  padding-left: 1.5rem;
  resize: none;
  padding-top: 1.8%;

  &::placeholder {
    color: ${colors.grayishBlue};
    opacity: 1;
    position: absolute;
    top: 50%;
    left: 1.5rem;
    transform: translateY(-50%);
    white-space: nowrap;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;

  -ms-overflow-style: none;
`;

const UploadButton = styled(Button)`
  position: absolute;
  right: 4.1rem;
  bottom: 0.45rem;
  background: none;
  border: none;
  z-index: 2;
  padding: 0; 
`;

const SendButton = styled(Button)`
  position: absolute;
  right: 1rem; 
  bottom: 0.45rem;
  border: none;
  background: none;
  z-index: 2;
  padding: 0; 
`;

const UploadIcon = styled(CloudUploadOutlined)`
  color: ${colors.deepOceanBlue};
  font-size: 1.3rem !important;
`;

const SendIcon = styled(SendOutlined)`
  color: ${colors.deepOceanBlue};
  font-size: 1.2rem !important;
`;
