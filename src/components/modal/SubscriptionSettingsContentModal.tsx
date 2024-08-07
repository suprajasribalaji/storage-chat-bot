import { Button } from "antd";
import styled from "styled-components";
import { ColorGreen, ColorWhite } from "../../assets/themes/color";

const SubscriptionSettingsContentModal = () => {
    return (
        <SubscriptionSettingsContent>
            <PlanSection>
                <PlanDetails>
                    <Plan>
                        <ButtonWrapper>
                            <StyledButton>Welcome to Elite</StyledButton>
                        </ButtonWrapper>
                        <FeaturesList>
                            <FeatureItem>Up to 10x more space to store the files</FeatureItem>
                            <FeatureItem>Store files by user choice</FeatureItem>
                        </FeaturesList>
                    </Plan>
                    <Plan>
                        <ButtonWrapper>
                            <StyledButton>Welcome to Deluxe</StyledButton>
                        </ButtonWrapper>
                        <FeaturesList>
                            <FeatureItem>Up to 20x more space to store the files</FeatureItem>
                            <FeatureItem>Store files by user choice</FeatureItem>
                            <FeatureItem>Schedule the file upload and retrieval of files</FeatureItem>
                        </FeaturesList>
                    </Plan>
                </PlanDetails>
            </PlanSection>
        </SubscriptionSettingsContent>
    );
}

export default SubscriptionSettingsContentModal;

const SubscriptionSettingsContent = styled.div``;

const PlanSection = styled.div`
    display: flex;
    flex-direction: column;
`;

const PlanDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Plan = styled.div``;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-bottom: 2%;
`;

const StyledButton = styled(Button)`
    background-color: ${ColorGreen.oliveGreen};
    border: none;
    border-radius: 50px;
    padding: 4%;
    font-size: 100%;
    color: ${ColorWhite.white};

    &&&:hover, &&&:focus {
        background-color: ${ColorWhite.white};
        color: ${ColorGreen.oliveGreen};
    }
`;

const FeaturesList = styled.ul`
    list-style-type: disc;
    margin-left: 2%;
`;

const FeatureItem = styled.li`
    font-size: 100%;
    margin-bottom: 1.5%;
`;
