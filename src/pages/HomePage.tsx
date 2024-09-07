import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Menu, Dropdown, message, Skeleton } from "antd";
import { IoMdSettings } from "react-icons/io";
import { AiOutlineLogout } from "react-icons/ai";
import { CloudUploadOutlined, SendOutlined, ArrowDownOutlined } from '@ant-design/icons';
import styled from "styled-components";
import { colors } from "../assets/themes/color";
import type { MenuProps } from 'antd';
import ProfilePicture from "../assets/images/ProfilePicture.png";
import ProfileSettingsModal from "../components/modal/ProfileSettingsModal";
import UploadFileModal from "../components/modal/UploadFileModal";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { requestUserLogout } from "../redux/slices/user/logout";
import ContentBeforeStartingChatComponent from "../components/ContentBeforeStartingChat";
import { auth, database } from "../config/firebase.config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { formatTimestamp, normalizeString, RespondedMessage } from "../utils/utils";

type MenuItem = Required<MenuProps>['items'][number];

const HomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isUploadFileModalOpen, setIsUploadFileModalOpen] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<string | null>('');
  const [responseMessages, setResponseMessages] = useState<RespondedMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true); // New loading state
  const webSocket = useRef<WebSocket | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const profilePictureURL = auth.currentUser?.photoURL || ProfilePicture;

  useEffect(() => {
    setProfilePicture(profilePictureURL);
  }, [profilePictureURL]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [responseMessages]);

  useEffect(() => {
    connectWebSocket();
    setLoading(false); // Set loading to false after WebSocket connection
    return () => {
      if (webSocket.current) {
        webSocket.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    webSocket.current = new WebSocket('ws://localhost:8080');
    
    webSocket.current.onopen = () => {
      console.log('Connected to WebSocket server successfully');
    };

    webSocket.current.onmessage = (event) => {
      console.log('Received message:', event.data);
      try {
        const receivedMessage: RespondedMessage = JSON.parse(event.data);
        setResponseMessages((prevMessages) => [...prevMessages, receivedMessage]);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    webSocket.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    webSocket.current.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };
  };

  const handleMenuItems = async (e: { key: string }) => {
    try {
      if (e.key === '1') {
        setIsProfileModalOpen(true);
      }
      if (e.key === '2') {
        await dispatch(requestUserLogout());
        navigate('/login');
      }
    } catch (error) {
      console.error('Error handling menu item:', error);
      message.error('An error occurred. Please try again.');
    }
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
    <StyledMenu mode="vertical" items={items} />
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

  const retrieveFileFromDataBase = async (requestedFileName: string, requestedTime: number) => {
    try {
      const fileQuery = query(collection(database, 'Files'), where('user_id', '==', auth.currentUser?.uid));
      const querySnapshot = await getDocs(fileQuery);
      if(querySnapshot.empty) throw new Error('User not found');
  
      const files: RespondedMessage[] = [];
  
      querySnapshot.forEach((doc) => {
        const fileDetails = doc.data();
        const fileName = fileDetails.file_detail.name + '.' + fileDetails.file_detail.ext;
        if (normalizeString(fileName).includes(requestedFileName)) {
          const fileURL = fileDetails.url;
          const newMessage: RespondedMessage = {
            type: 'response',
            file_name: fileName,
            downloadable_url: fileURL,
            timestamp: requestedTime,
            responded_at: Date.now(),
          };
          files.push(newMessage);
        }
      });
  
      if (files.length > 0) {
        setResponseMessages((prevMessages) => [...prevMessages, ...files]);
      } else {
        const newMessage: RespondedMessage = {
          type: 'response',
          file_name: 'No file found',
          timestamp: requestedTime,
          responded_at: Date.now(),
          noFileFound: true,
        };
        files.push(newMessage);
        setResponseMessages((prevMessages) => [...prevMessages, ...files]);
      }
    } catch (error) {
      console.error('Error retrieving file:', error);
      message.error('Failed to retrieve file. Please try again.');
    }
  };

  const handleSendButton = () => {
    if (webSocket.current) {
      const message: RespondedMessage = { 
        type: 'request', 
        content: input, 
        timestamp: Date.now() 
      };
      webSocket.current.send(JSON.stringify(message));
      retrieveFileFromDataBase(normalizeString(input), message.timestamp);
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
        <HomePageHeader>Warehouse</HomePageHeader>
        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
          <CircleButton type="link">
            {
              profilePicture && <StyledProfilePicture src={profilePicture} alt='Profile Picture'/>
            }
          </CircleButton>
        </Dropdown>
      </HomePageNavBar>
      <Skeleton loading={loading} active>
        {responseMessages.length > 0 ? (
          <Content hasContent={true} ref={contentRef}>
            {responseMessages.map((msg, index) => (
              <MessageContainer key={index}>
                {msg.type === 'request' ? (
                  <RequestMessage>
                    <RequestContent>{msg.content}</RequestContent>
                    <RequestTime>{formatTimestamp(msg.timestamp)}</RequestTime>
                  </RequestMessage>
                ) : (
                  <ResponseMessage>
                    <ResponseContent>
                      <FileName>{msg.file_name}</FileName>
                      {!msg.noFileFound && msg.downloadable_url && (
                        <DownloadButton 
                          icon={<ArrowDownOutlined />}
                          onClick={() => window.open(msg.downloadable_url, '_blank')}
                        />
                      )}
                    </ResponseContent>
                    <ResponseTime>{formatTimestamp(msg.responded_at || msg.timestamp)}</ResponseTime>
                  </ResponseMessage>
                )}
              </MessageContainer>
            ))}
          </Content>
        ) : (
          <ContentBeforeStartingChatComponent />
        )}
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
      </Skeleton>
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
  font-family: cursive;
  margin-top: 0.5%;
`;

const HomePageHeader = styled.span`
  font-size: 130%;
  margin-left: 1%;
`;

const CircleButton = styled(Button)`
  width: 5%;
  height: 7vh;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  margin-top: 0.5%;
  background-color: transparent;

  &&&:hover, &&&:focus {
    background-color: transparent;
  }
`;

const StyledProfilePicture = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; 
  border-radius: 50%;
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

const Content = styled.div<{ hasContent: boolean }>`
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    height: 80.8vh;
    width: 50%;
    margin-left: 25%;
    margin-right: 25%;
    border-radius: 0.5rem;
    scroll-behavior: smooth;
`;

const MessageContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    width: 100%;
`;

const RequestMessage = styled.div`
    align-self: flex-end;
    background-color: ${colors.semiTransparentBlack};
    border-radius: 1rem;
    padding: 2%;
    text-align: right;
    margin-bottom: 10px;
    max-width: 70%;
`;

const ResponseMessage = styled.div`
    align-self: flex-start;
    background-color: ${colors.lightSemiTransparentBlack};
    border-radius: 1rem;
    padding: 2%;
    max-width: 70%;
`;

const RequestTime = styled.div`
    font-size: 0.8em;
    color: ${colors.richBlack};
    margin-top: 12%;
    text-align: left;
`;

const ResponseTime = styled.div`
    font-size: 0.8em;
    color: ${colors.richBlack};
    margin-top: 12%;
    text-align: right;
`;

const RequestContent = styled.div`
    color: ${colors.white};
    margin: 2%;
    width: 100%;
    text-align: right;
`;

const ResponseContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${colors.white};
    text-align: left;
`;

const FileName = styled.span`
    word-wrap: break-word;
    overflow-wrap: break-word;
    flex-grow: 1;
    margin-right: 10px;
`;

const DownloadButton = styled(Button)`
    background-color: ${colors.charcoalBlack};
    color: ${colors.paleBlue};
    border: none;
    padding: 0.5rem 1rem;
    
    &&&:hover {
        background-color: ${colors.paleBlue};
        color: ${colors.charcoalBlack};
    }
    
    &&& {
        border-radius: 2rem;
    }
`;