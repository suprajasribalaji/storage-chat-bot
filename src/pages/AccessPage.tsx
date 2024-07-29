import styled from "styled-components"
import BackgroundImage from "../assets/images/AccessPageBackground.jpg"
import Title from "antd/es/typography/Title"
import { Button, Divider } from "antd"
import { HomeFilled, LoginOutlined } from "@ant-design/icons"
import { ColorBlack, ColorGray, ColorWhite } from "../assets/themes/color"

const AccessPage = () => {
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
                            <StyledGSButton>Get Started</StyledGSButton>
                        </StyledGetStartedButton>
                        <StyledDivider plain>explor</StyledDivider>
                        <StyledButtonsGroup>
                            <StyledLoginHomeButton icon={<LoginOutlined />}></StyledLoginHomeButton>
                            <StyledLoginHomeButton icon={<HomeFilled />}></StyledLoginHomeButton>
                        </StyledButtonsGroup>
                        <JoinNow>
                            <NewToOurPlatform>
                                New to our platform?
                            </NewToOurPlatform>
                            <JoinNowButtonDiv>
                                <StyledJoinNowButton type="link">Join Now</StyledJoinNowButton>
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
    background-color: ${ColorGray.lightGray};
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
    color: ${ColorBlack.charcoalBlack};
`;

const AccessPageSubtitle = styled.div`
    margin-top: 1%;
    margin-bottom: 6%;
`;

const StyledSubtitle = styled.div`
    font-size: 0.9rem;
    color: ${ColorGray.ashGray};
`;

const StyledGetStartedButton = styled.div`
    margin-top: 4%;
    margin-right: 45%;
`;

const StyledGSButton = styled(Button)`
    width: 302%;
    height: 6.5vh;
    border-radius: 14px;
    background-color: ${ColorBlack.raisinBlack};
    color: ${ColorWhite.white};
    font-weight: bold;
    border: none;

    &&&:hover {
        color: ${ColorBlack.raisinBlack};
        background-color: ${ColorWhite.white};
    }
`;

const StyledDivider = styled(Divider)`
    color: ${ColorBlack.charcoalBlack} !important;
`;

const StyledButtonsGroup = styled.div`
    display: flex;
    gap: 2.5rem;
    margin-bottom: 1rem;
`;

const StyledLoginHomeButton = styled(Button)`
    height: 5.5vh;
    width: 5rem !important;
    border-radius: 10px;
    background-color: ${ColorBlack.raisinBlack};
    border: none;
    .anticon {
        color: ${ColorWhite.white};
    }

    &&&:hover, &&&:focus {
        background-color: ${ColorWhite.white};
        .anticon {
            color: ${ColorBlack.raisinBlack};
        }
    }
`;

const JoinNow = styled.div`
    display: flex;
    align-items: center;
    margin-top: -2%;
    font-size: 90%;
`;

const NewToOurPlatform = styled.div`
    margin-left: 5.5rem;
    color: ${ColorBlack.charcoalBlack};
`;

const JoinNowButtonDiv = styled.div`
    margin-left: -0.5rem;
`;

const StyledJoinNowButton = styled(Button)`
    font-size: 90%;
    color: ${ColorBlack.charcoalBlack};
    font-weight: 800;
    border: none;

    &&&:hover, &&&:focus {
        color: ${ColorBlack.semiTransparentBlack};
    }
`;
