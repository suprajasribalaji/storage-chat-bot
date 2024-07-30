import { Button, Input } from "antd";
import { UserOutlined, CloudUploadOutlined, SendOutlined } from '@ant-design/icons';
import styled from "styled-components";
import { ColorBlue, ColorWhite } from "../assets/themes/color";

const HomePage = () => {
    return (
        <StyledHomePage>
            <HomePageNavBar>
                <HomePageHeader>
                    Warehouse
                </HomePageHeader>
                <CircleButton>
                    <UserIcon />
                </CircleButton>
            </HomePageNavBar>
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
}

export default HomePage;

const StyledHomePage = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100vh;
    background-color: ${ColorBlue.paleBlue};
`;

const HomePageNavBar = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${ColorBlue.steelBlue};
    padding: 0.5% 0.9%;
    font-family: cursive;
`;

const HomePageHeader = styled.span`
    font-size: 130%; 
`;

const CircleButton = styled(Button)`
    width: 2.5%;
    height: 5vh;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.5%;
    background-color: ${ColorWhite.white};
    color: ${ColorBlue.deepOceanBlue};
    border: none;
    
    &&&:hover {
        background-color: ${ColorBlue.deepOceanBlue};
        .anticon {
            color: ${ColorWhite.white};
        }
    }
`;

const UserIcon = styled(UserOutlined)`
    font-size: 120%;
    color: ${ColorBlue.deepOceanBlue};
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
    padding-right: 4rem; 
    z-index: 1;
    padding-left: 1.5rem;
    resize: none;
    overflow-y: auto;
    padding-top: 1.8%;

    &::placeholder {
        color: ${ColorBlue.grayishBlue};
        opacity: 1;
        position: absolute;
        top: 50%;
        left: 1.5rem;
        transform: translateY(-50%);
        white-space: nowrap;
    }
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
    color: ${ColorBlue.deepOceanBlue};
    font-size: 1.3rem !important;
`;

const SendIcon = styled(SendOutlined)`
    color: ${ColorBlue.deepOceanBlue};
    font-size: 1.2rem !important;
`;
