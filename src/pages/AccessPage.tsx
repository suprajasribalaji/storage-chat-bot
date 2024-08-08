import styled from "styled-components"
import BackgroundImage from "../assets/images/AccessPageBackground.jpg"
import Title from "antd/es/typography/Title"
import { Button } from "antd"
import { LoginOutlined } from "@ant-design/icons"
import { colors } from "../assets/themes/color"
import { useNavigate } from "react-router-dom"

const AccessPage = () => {
    const navigate = useNavigate()
    
    const handleGetStartedButton = () => {
        navigate('/login');
    }

    const handleJoinNowButton = () => {
        navigate('/signup');
    }

    return (
        <StyledAccessPage>
            <AccessPageBackground1>
                <AccessPageBackground2>
                    <AccessPageContent>
                        <AccessPageTitle>
                            <StyledTitle>Tidy Spaces, Tidy Minds - Where Your Belongings</StyledTitle>
                        </AccessPageTitle>
                        <AccessPageSubtitle>
                            <StyledSubtitle>Safeguard and organized for clutter free Spaces</StyledSubtitle>
                        </AccessPageSubtitle>
                        <StyledGetStartedButton>
                            <StyledGSButton onClick={handleGetStartedButton} icon={<LoginOutlined />}>Get Started</StyledGSButton>
                        </StyledGetStartedButton>
                        <JoinNow>
                            <NewToOurPlatform>
                                New to our platform?
                            </NewToOurPlatform>
                            <JoinNowButtonDiv>
                                <StyledJoinNowButton onClick={handleJoinNowButton} type="link">Join Now</StyledJoinNowButton>
                            </JoinNowButtonDiv>
                        </JoinNow>
                    </AccessPageContent>
                </AccessPageBackground2>
            </AccessPageBackground1>
        </StyledAccessPage>
    )
}

export default AccessPage

const StyledAccessPage = styled.div`
    width: 100%;
    height: 100vh;
    font-family: "Poppins", sans-serif;
`;

const AccessPageBackground1 = styled.div`
    background-image: url(${BackgroundImage});
    background-size: cover;
    background-position: center;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const AccessPageBackground2 = styled.div`
    width: 30%;
    height: 80vh;
    border-radius: 10px;
    background-color: ${colors.lightGray};
    display: flex;
    justify-content: center;
    align-items: center;
`;

const AccessPageContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 100%;
`;

const AccessPageTitle = styled.div`
    width: 60%;
    margin-top: -5%;
`;

const StyledTitle = styled(Title)`
    font-size: 2.5rem !important;
    font-weight: 800 !important;
    margin-top: 2%;
    color: ${colors.charcoalBlack};
`;

const AccessPageSubtitle = styled.div`
    margin-top: 1%;
    margin-bottom: 6%;
`;

const StyledSubtitle = styled.div`
    font-size: 0.9rem;
    color: ${colors.ashGray};
`;

const StyledGetStartedButton = styled.div`
    margin-top: 4%;
    margin-right: 40%;
`;

const StyledGSButton = styled(Button)`
    width: 220%;
    height: 6.5vh;
    border-radius: 14px;
    background-color: ${colors.raisinBlack};
    color: ${colors.white};
    font-weight: bold;
    border: none;

    &&&:hover {
        color: ${colors.raisinBlack};
        background-color: ${colors.white};
    }
`;

const JoinNow = styled.div`
    display: flex;
    align-items: center;
    margin-top: -2%;
    font-size: 90%;
    margin-top: 2%;
`;

const NewToOurPlatform = styled.div`
    margin-left: 5.5rem;
    color: ${colors.charcoalBlack};
    margin-top: 2%;
`;

const JoinNowButtonDiv = styled.div`
    margin-left: -0.5rem;
    margin-top: 1%;
    
`;

const StyledJoinNowButton = styled(Button)`
    font-size: 90%;
    color: ${colors.charcoalBlack};
    font-weight: 800;
    border: none;

    &&&:hover, &&&:focus {
        color: ${colors.semiTransparentBlack};
    }
`;
