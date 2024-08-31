import { IoMdSettings } from "react-icons/io";
import { AiOutlineLogout } from "react-icons/ai";
import { Button, Input, Menu, Dropdown, message } from "antd";
import { CloudUploadOutlined, SendOutlined } from '@ant-design/icons';
import styled from "styled-components";
import { colors } from "../assets/themes/color";
import type { MenuProps } from 'antd';
import ProfilePicture from "../assets/images/ProfilePicture.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ProfileSettingsModal from "../components/modal/ProfileSettingsModal";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { requestUserLogout } from "../redux/slices/logout";
import WallPaper from "../assets/wallpaper/chat-wp.webp";
import UploadFileModal from "../components/modal/UploadFileModal";

type MenuItem = Required<MenuProps>['items'][number];

type Message = {
  content: string;
}

const HomePage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
    const [isUploadFileModalOpen, setIsUploadFileModalOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const webSocket = useRef<WebSocket | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (contentRef.current) {
        contentRef.current.scrollTop = contentRef.current.scrollHeight;
      }
    }, [messages]);

    useEffect(() => {
      webSocket.current = new WebSocket('ws://localhost:8080');
      
      webSocket.current.onopen = () => {
        console.log('Connected to WebSocket server successfully');
      };

      webSocket.current.onmessage = (event) => {
        console.log('Received message:', event.data);
        try {
          const message: Message = JSON.parse(event.data);
          setMessages((prevMessages) => [...prevMessages, message]);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      webSocket.current.onclose = () => {
        console.log('Disconnected from WebSocket server');
      };
      
      return () => {
        if (webSocket.current) {
          webSocket.current.close();
        }
      };
    }, []);

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

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    };
  
    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendButton();
      }
    };

    const handleSendButton = () => {
      if (webSocket.current) {
        const message = { content: input };
        webSocket.current.send(JSON.stringify(message));
        setInput('');
      } else {
        console.error('WebSocket is not connected');
        message.error('Failed to send message. Please try again.');
      }
    };

    const handleUploadButton = () => {
      setIsUploadFileModalOpen(true);
    };

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
      <Content ref={contentRef}>
        {messages.map((msg, index) => (
          <Message key={index} isCurrentUser={true}>
            <UserMessage>{msg.content}</UserMessage>
          </Message>
        ))}
      </Content>

      <HomePageContent>
        <ChatBoxInput>
          <StyledChatInput 
            placeholder="Are you looking to retrieve some data?" 
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            autoSize={{ minRows: 1, maxRows: 6 }}
          />
          <UploadButton icon={<UploadIcon />} onClick={handleUploadButton}/>
          <SendButton icon={<SendIcon />} onClick={handleSendButton}/>
        </ChatBoxInput>
      </HomePageContent>
      <ProfileSettingsModal
        isModalOpen={isProfileModalOpen}
        setIsModalOpen={setIsProfileModalOpen}
      />
      <UploadFileModal
        isModalOpen={isUploadFileModalOpen}
        setIsModalOpen={setIsUploadFileModalOpen}
      />
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

const Content = styled.div`
  display: flex;
  color: white;
  align-items: center;
  flex-direction: column;
  overflow-y: auto;
  height: 80.8vh;
  width: 52%;
  margin-left: 23.9%;
  margin-right: 26.1%;
  border-radius: 0.5rem;
  scroll-behavior: smooth;
  background-image: url(${WallPaper});
`;

const Message = styled.div<{ isCurrentUser: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isCurrentUser ? 'flex-end' : 'flex-start'};
  padding: 1%;
  max-width: 50%;
  word-wrap: break-word; 
  overflow-wrap: break-word;
  align-self: ${props => props.isCurrentUser ? 'flex-end' : 'flex-start'};
  background-color: ${colors.semiTransparentBlack};
  border-radius: 2rem;
  padding: 2% 2.5%;
  margin-top: 2%;
  margin-bottom: 2%;
  margin-right: 3%;
`;

const UserMessage = styled.div`
  word-wrap: break-word;
`;

const ChatBoxInput = styled.div`
  width: 50%;
  display: flex;
  justify-content: flex-end;
  position: relative;
  margin-bottom: 0.8%;
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