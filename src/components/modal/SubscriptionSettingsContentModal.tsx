import { useEffect, useState } from "react";
import { Button, message } from "antd";
import styled from "styled-components";
import { colors } from "../../assets/themes/color";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { requestPaymentVerification, requestPlanSubscription } from "../../redux/slices/user/api";
import { fetchCurrentUserDetails } from "../../helpers/helpers";

type SubscriptionSettingsContentModalProps = {
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setSelectedKey: React.Dispatch<React.SetStateAction<string>>
}

const SubscriptionSettingsContentModal = (props: SubscriptionSettingsContentModalProps) => {
    const { setIsModalOpen, setSelectedKey } = props;
    const [fullName, setFullName] = useState<string>('');
    const [nickName, setNickName] = useState<string>('');
    const [currentPlan, setCurrentPlan] = useState<string>('');
    const [planValidity, setPlanValidity] = useState<Date | null>();
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchUserPlan = async () => {
            try {
                const userData = await fetchCurrentUserDetails();
                if(userData){
                    setCurrentPlan(userData.plan);
                    setFullName(userData.full_name);
                    setNickName(userData.nick_name);
                    setPlanValidity(userData.subscribed_at.toDate() || null);
                } else {
                    message.error('User not found');
                    console.error('User not found');
                }
            } catch (error) {
                console.error("Error fetching user plan: ", error);
            }
        };
        isSubscriptionExpired();
        fetchUserPlan();        
    }, []);

    const handleSubscription = async (subscribeTo: string) => {
        setLoading(true);
        try {
            const response = await dispatch(requestPlanSubscription({ plan: subscribeTo }));
            const { key, orderId, amount, currency, description, prefill, notes, theme } = response.payload;

            var options = {
                key,
                amount,
                currency,
                name: 'WareHouse',
                description,
                order_id: orderId,
                handler: async function(paymentResponse: any) {
                    try {
                        const verificationResponse = await dispatch(requestPaymentVerification({ fullName, nickName, subscribeTo, paymentResponse }));                        
                        if (verificationResponse.payload) {
                            setIsModalOpen(false);
                            setSelectedKey('1');
                            message.success('Invoice send successfully!');
                        } else {
                            message.error('Payment verification failed / Send invoice failed.');
                        }
                    } catch (error) {
                        console.error('Error while processing the payment: ', error);
                        message.error('Payment verification failed.');
                    }
                },
                prefill,
                notes,
                theme,
            };
    
            const payment = new window.Razorpay(options);
            payment.open();
            message.success('Subscription process initiated.');
        } catch (error) {
            message.error('Subscription failed. Please try again.');
            console.error('Error during subscription: ', error);
        } finally {
            setLoading(false);
        }
    };

    const isSubscriptionExpired = () => {
        if (!planValidity) return false;
        const expirationDate = new Date(planValidity.getTime() + 2 * 60 * 1000);     
        return Date.now() > expirationDate.getTime();
    };

    return (
        <SubscriptionSettingsContent>
            <PlanSection>
                <PlanDetails>
                    <Plan>
                        <ButtonWrapper>
                            <StyledButton onClick={() => handleSubscription('Elite')} disabled={loading || (currentPlan === 'Elite' && !isSubscriptionExpired())}>Welcome to Elite</StyledButton>
                        </ButtonWrapper>
                        <FeaturesList>
                            <FeatureItem>Up to 10x more space to store the files</FeatureItem>
                            <FeatureItem>Store files by user choice</FeatureItem>
                            <FeatureItem>Subscription Duration: 28 days</FeatureItem>
                        </FeaturesList>
                    </Plan>
                    <Plan>
                        <ButtonWrapper>
                            <StyledButton onClick={() => handleSubscription('Deluxe')} disabled={loading || (currentPlan === 'Deluxe' && !isSubscriptionExpired())}>Welcome to Deluxe</StyledButton>
                        </ButtonWrapper>
                        <FeaturesList>
                            <FeatureItem>Up to 20x more space to store the files</FeatureItem>
                            <FeatureItem>Store files by user choice</FeatureItem>
                            <FeatureItem>Schedule the file upload and retrieval of files</FeatureItem>
                            <FeatureItem>Subscription Duration: 28 days</FeatureItem>
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

const PlanDetails = styled(PlanSection)`
    gap: 20px;
`;

const Plan = styled.div``;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-bottom: 2%;
`;

const StyledButton = styled(Button)`
    background-color: ${colors.steelBlue};
    border: none;
    border-radius: 50px;
    padding: 4%;
    font-size: 100%;
    color: ${colors.white};

    &&&:hover {
        background-color: ${colors.white};
        color: ${colors.steelBlue};
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
