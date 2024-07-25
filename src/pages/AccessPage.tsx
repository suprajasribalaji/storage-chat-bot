import styled from "styled-components"
import BackgroundImage from "../assets/images/login.jpg"
import Title from "antd/es/typography/Title"
import { Button, Divider } from "antd"
import { HomeFilled, LoginOutlined } from "@ant-design/icons"

const AccessPage = () => {
    return (
        <LoginPage>
            <LoginPageBackground1>
                <LoginPageBackground2>
                    <LoginPageContent>
                        <LoginPageTitle>
                            <StyledTitle>Tidy Spaces, Tidy Minds - Where Your Belongings</StyledTitle>
                        </LoginPageTitle>
                        <LoginPageSubtitle>
                            <StyledSubtitle>Safeguard and organized for clutter free Spaces</StyledSubtitle>
                        </LoginPageSubtitle>
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
                    </LoginPageContent>
                </LoginPageBackground2>
            </LoginPageBackground1>
        </LoginPage>
    )
}

export default AccessPage

const LoginPage = styled.div`
    width: 100%;
    height: 100vh;
    font-family: "Poppins", sans-serif;
`;

const LoginPageBackground1 = styled.div`
    background-image: url(${BackgroundImage});
    background-size: cover;
    background-position: center;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const LoginPageBackground2 = styled.div`
    width: 30%;
    height: 80vh;
    border-radius: 10px;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const LoginPageContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 100%;
`;

const LoginPageTitle = styled.div`
    width: 60%;
    margin-top: -5%;
`;

const StyledTitle = styled(Title)`
    font-size: 2.5rem !important;
    font-weight: 800 !important;
    margin-top: 2%;
    color: #1D1D1F;
`;

const LoginPageSubtitle = styled.div`
    margin-top: 1%;
    margin-bottom: 6%;
`;

const StyledSubtitle = styled.div`
    font-size: 0.9rem;
    color: #5D5D5B;
`;

const StyledGetStartedButton = styled.div`
    margin-top: 4%;
    margin-right: 45%;
`;

const StyledGSButton = styled(Button)`
    width: 302%;
    height: 6.5vh;
    border-radius: 14px;
    background-color: #000000;
    color: #FFFFFF;
    font-weight: bold;
    border: none;

    &&&:hover, &&&:focus {
        color: #FFFFFF;
        background-color: #000000;
    }
`;

const StyledDivider = styled(Divider)`
    color: #1D1D1F !important;
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
    background-color: #000000;
    border: none;
    .anticon {
        color: #FFFFFF;
    }

    &&&:hover, &&&:focus {
        background-color: #FFFFFF;
        .anticon {
            color: #000000;
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
    color: #1D1D1F;
`;

const JoinNowButtonDiv = styled.div`
    margin-left: -0.5rem;
`;

const StyledJoinNowButton = styled(Button)`
    font-size: 90%;
    color: #1D1D1F;
    font-weight: 800;
    border: none;

    &&&:hover, &&&:focus {
        color: #00000080;
    }
`;
