import React, { useEffect, useState } from "react";
import { Button, message, Skeleton } from "antd";
import styled from "styled-components";
import { colors } from "../../assets/themes/color";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { requestPaymentVerification, requestPlanSubscription } from "../../redux/slices/user/api";
import { fetchCurrentUserDetails } from "../../helpers/helpers";
import { addDoc, collection } from "firebase/firestore";
import { database } from "../../config/firebase.config";

type SubscriptionSettingsContentModalProps = {
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedKey: React.Dispatch<React.SetStateAction<string>>;
}

interface PaymentVerificationPayload {
    amount: number;
    name: string;
    email: string;
    order_id: string;
    payment_id: string;
    payment_method: string;
    subscribedTo: string;
    created_at: string | Date;
}

const SubscriptionSettingsContentModal: React.FC<SubscriptionSettingsContentModalProps> = ({ setIsModalOpen, setSelectedKey }) => {
    const [fullName, setFullName] = useState<string>('');
    const [nickName, setNickName] = useState<string>('');
    const [currentPlan, setCurrentPlan] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [processingSubscription, setProcessingSubscription] = useState<boolean>(false);
    const [dataLoading, setDataLoading] = useState<boolean>(true); // New state for data loading
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchUserPlan = async () => {
            try {
                const userData = await fetchCurrentUserDetails();
                if(userData){
                    setCurrentPlan(userData.plan);
                    setFullName(userData.full_name);
                    setNickName(userData.nick_name);
                } else {
                    message.error('User not found');
                    console.error('User not found');
                }
            } catch (error) {
                console.error("Error fetching user plan: ", error);
            } finally {
                setDataLoading(false); // Set data loading to false after fetching data
            }
        };
    
        fetchUserPlan();
    }, []);

    const handleSubscription = async (subscribeTo: string) => {
        setLoading(true);
        setProcessingSubscription(true);
        try {
            const response = await dispatch(requestPlanSubscription({ plan: subscribeTo }));
            const { key, orderId, amount, currency, description, prefill, notes, theme } = response.payload;
    
            const options = {
                key,
                amount,
                currency,
                name: 'WareHouse',
                description,
                order_id: orderId,
                handler: async function(paymentResponse: any) {
                    try {
                        console.log('Payment Response:', paymentResponse);
                        const verificationResponse = await dispatch(requestPaymentVerification({ fullName, nickName, subscribeTo, paymentResponse }));
                        console.log('Verification Response:', verificationResponse);
    
                        if (verificationResponse.meta.requestStatus === 'fulfilled') {
                            const payload = verificationResponse.payload as PaymentVerificationPayload;
                            console.log('Payload:', payload);
    
                            const {
                                amount,
                                name,
                                email,
                                order_id,
                                payment_id,
                                payment_method,
                                subscribedTo,
                                created_at
                            } = payload;
    
                            if (payload) {
                                try {
                                    const transactionRef = await addDoc(collection(database, "Transaction"), {
                                        email,
                                        full_name: name,
                                        order_id,
                                        payment_id,
                                        payment_method,
                                        plan: subscribedTo,
                                        amount,
                                        created_at
                                    });
    
                                    console.log(transactionRef.id, 'Updated in database and invoice sent successfully');
                                    setIsModalOpen(false);
                                    setSelectedKey('1');
                                    message.success('Invoice sent successfully!');
                                } catch (error) {
                                    console.error('Error adding document: ', error);
                                    message.error('Failed to save transaction data.');
                                }
                            } else {
                                console.error('Missing data:', {
                                    amount,
                                    name,
                                    email,
                                    order_id,
                                    payment_id,
                                    payment_method,
                                    subscribeTo,
                                    created_at
                                });
                                throw new Error('Incomplete payment verification data.');
                            }
                        } else {
                            message.error('Payment verification failed / Send invoice failed.');
                        }
                    } catch (error) {
                        console.error('Error while processing the payment: ', error);
                        if (error instanceof Error) {
                            message.error(`Payment verification failed: ${error.message}`);
                        } else {
                            message.error('Payment verification failed due to an unknown error.');
                        }
                    } finally {
                        setProcessingSubscription(false);
                    }

                },
                prefill,
                notes,
                theme,
            };
    
            const payment = new (window as any).Razorpay(options);
            payment.open();
            message.success('Subscription process initiated.');
        } catch (error) {
            message.error('Subscription failed. Please try again.');
            console.error('Error during subscription: ', error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <SubscriptionSettingsContent>
            <Skeleton active loading={dataLoading}> {/* Wrap content with Skeleton */}
                <PlanSection>
                    <PlanDetails>
                        <Plan>
                            <ButtonWrapper>
                                <StyledButton onClick={() => handleSubscription('Elite')} loading={processingSubscription} disabled={loading || (currentPlan === 'Elite')}>Welcome to Elite</StyledButton>
                            </ButtonWrapper>
                            <FeaturesList>
                                <FeatureItem>Up to 10x more space to store the files</FeatureItem>
                                <FeatureItem>Store files by user choice</FeatureItem>
                                <FeatureItem>Subscription Duration: 28 days</FeatureItem>
                            </FeaturesList>
                        </Plan>
                        <Plan>
                            <ButtonWrapper>
                                <StyledButton onClick={() => handleSubscription('Deluxe')} loading={processingSubscription} disabled={loading || (currentPlan === 'Deluxe')}>Welcome to Deluxe</StyledButton>
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
            </Skeleton>
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
