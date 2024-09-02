import styled from "styled-components"
import BackgroundImage from "../assets/images/AccessPageBackground.jpg"
import Title from "antd/es/typography/Title"
import { Button } from "antd"
import { LoginOutlined } from "@ant-design/icons"
import { colors } from "../assets/themes/color"
import { useNavigate } from "react-router-dom"

const AccessPage = () => {
    const navigate = useNavigate();
    
    const handleNavigation = (path: string) => {
        try {
            navigate(path);
        } catch (error) {
            console.error("Navigation error:", error);
        }
    };

    return (
        <StyledAccessPage>
            <AccessPageBackground1>
                <AccessPageBackground2>
                    <AccessPageContent>
                        <AccessPageTitle>
                            <StyledTitle>Tidy Spaces, Tidy Minds - Where Your Belongings</StyledTitle>
                        </AccessPageTitle>
                        <AccessPageSubtitle>
                            <StyledSubtitle>Safeguard and organized for clutter free spaces</StyledSubtitle>
                        </AccessPageSubtitle>
                        <StyledGetStartedButton>
                            <StyledGSButton onClick={() => handleNavigation('/login')} icon={<LoginOutlined />}>Get Started</StyledGSButton>
                        </StyledGetStartedButton>
                        <JoinNow>
                            <NewToOurPlatform>
                                New to our platform?
                            </NewToOurPlatform>
                            <JoinNowButtonDiv>
                                <StyledJoinNowButton onClick={() => handleNavigation('/signup')} type="link">Join Now</StyledJoinNowButton>
                            </JoinNowButtonDiv>
                        </JoinNow>
                    </AccessPageContent>
                </AccessPageBackground2>
            </AccessPageBackground1>
        </StyledAccessPage>
    )
}

export default AccessPage;

const StyledAccessPage = styled.div`
    width: 100%;
    height: 100vh;
    font-family: "Poppins", sans-serif;
`;

export const CenterDiv= styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const AccessPageBackground1 = styled(CenterDiv)`
    background-image: url(${BackgroundImage});
    background-size: cover;
    background-position: center;
    height: 100vh;
`;

const AccessPageBackground2 = styled(CenterDiv)`
    width: 30%;
    height: 72vh;
    border-radius: 1em;
    background-color: ${colors.lightGray};
`;

const AccessPageContent = styled(CenterDiv)`
    flex-direction: column;
    text-align: center;
    width: 100%;
`;

const AccessPageTitle = styled(CenterDiv)`
    width: 80%;
`;

const StyledTitle = styled(Title)`
    font-size: 2.5em !important;
    font-weight: 800 !important;
    margin-top: 0.1em;
    color: ${colors.charcoalBlack};
`;

const AccessPageSubtitle = styled.div`
    margin-bottom: 2em;
`;

const StyledSubtitle = styled.div`
    font-size: 0.9em;
    color: ${colors.ashGray};
`;

const StyledGetStartedButton = styled(CenterDiv)`
    margin-top: 1.6em;
`;

const StyledButton = styled(Button)`
    color: ${colors.white};
    border: none;
`;

const StyledGSButton = styled(StyledButton)`
    width: 19em;
    height: 3.2em;
    border-radius: 1.5em;
    background-color: ${colors.raisinBlack};
    font-weight: bold;

    &&&:hover {
        color: ${colors.raisinBlack};
        background-color: ${colors.white};
    }
`;

const JoinNow = styled(CenterDiv)`
    font-size: 0.92em;
    margin-top: 0.8em;
`;

const NewToOurPlatform = styled.div`
    margin: 0.3em 0 0 8em;
    color: ${colors.charcoalBlack};
`;

const JoinNowButtonDiv = styled.div`
    margin: 0.2em 0 0 -0.5em;    
`;

const StyledJoinNowButton = styled(StyledButton)`
    font-size: 0.9em;
    color: ${colors.charcoalBlack};
    font-weight: 800;

    &&&:hover, &&&:focus {
        color: ${colors.semiTransparentBlack};
    }
`;
