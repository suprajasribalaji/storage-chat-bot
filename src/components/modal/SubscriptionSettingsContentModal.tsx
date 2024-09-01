import { Button, message } from "antd";
import styled from "styled-components";
import { colors } from "../../assets/themes/color";
import axios from "axios";
import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth, database } from "../../config/firebase.config";
import { useEffect, useState } from "react";

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


    useEffect(() => {
        const fetchUserPlan = async () => {
            try {
                const userQuery = query(collection(database, "Users"), where("email", "==", auth.currentUser?.email));
                const querySnapshot = await getDocs(userQuery);
                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    const userData = userDoc.data();
                    setCurrentPlan(userData.plan);
                    setFullName(userData.full_name);
                    setNickName(userData.nick_name);
                    if (userData.subscribed_at && userData.subscribed_at.toDate) {
                        setPlanValidity(userData.subscribed_at.toDate());
                    } else {
                        setPlanValidity(null);
                    }
                }
            } catch (error) {
                console.error("Error fetching user plan: ", error);
            }
        };
        isSubscriptionExpired();

        fetchUserPlan();        
    }, []);

    const handleSubscription = async (subscribeTo: string) => {
        try {
            const response = await axios.post('http://localhost:5002/subscribe', { plan: subscribeTo });
            const { key, orderId, amount, currency, description, prefill, notes, theme } = response.data;
    
            var options = {
                key: key,
                amount: amount,
                currency: currency,
                name: 'WareHouse',
                description: description,
                order_id: orderId,
                handler: async function(paymentResponse: any) {
                    try {
                        const verificationResponse = await axios.post('http://localhost:5002/verify-payment', paymentResponse);
                        const { paymentMethod, amount } = verificationResponse.data.paymentDetails;
                        if (verificationResponse.data.success) {
                            console.log(`Payment successful for ${subscribeTo}:`, paymentResponse);
                            await handleProfileUpdation(subscribeTo);                            
                            const sendInvoiceResponse = await axios.post('http://localhost:5002/send-subscription-invoice', 
                                { subscribedTo: subscribeTo, orderId: paymentResponse.razorpay_order_id, paymentId: paymentResponse.razorpay_payment_id, fullName, nickName, email: auth.currentUser?.email, amount, validity: 28, paymentMethod });
                            console.log('invoice response::: ', sendInvoiceResponse);
                            setIsModalOpen(false);
                            setSelectedKey('1');
                            message.success('Invoice send successfully!');
                            message.success(`${subscribeTo} Subscription Payment ID: ${paymentResponse.razorpay_payment_id}`);
                        } else {
                            message.error('Payment verification failed / Send invoice failed.');
                        }
                    } catch (error) {
                        console.error('Error while processing the payment: ', error);
                        message.error('Payment verification failed.');
                    }
                },
                prefill: prefill,
                notes: notes,
                theme: theme,
            };
    
            let payment = new window.Razorpay(options);
            payment.open();
            message.success('Subscription process initiated.');
        } catch (error) {
            message.error('Subscription failed. Please try again.');
            console.error('Error during subscription: ', error);
        }
    };

    const handleProfileUpdation = async (subscribeTo: string) => {
        try {
            const userQuery = query(collection(database, "Users"), where("email", "==", auth.currentUser?.email));
            const querySnapshot = await getDocs(userQuery);
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userRef = userDoc.ref; 
                await updateDoc(userRef, {
                    plan: subscribeTo,
                    subscribed_at: Date.now()
                });
                message.success('Profile updated successfully!');                
            } else {
                message.error('User not found');
                console.log("No user found with that email.");
            }
        } catch (error) {
            console.error('Error while doing profile updation', error);
        }
    };
    
    const isSubscriptionExpired = () => {
        if (!planValidity || !(planValidity instanceof Date)) return false;
        const expirationDate = new Date(planValidity.getTime() + 2 * 60 * 1000);
        console.log('ed -->  ', expirationDate);
        
        return Date.now() > expirationDate.getTime();
    };

    return (
        <SubscriptionSettingsContent>
            <PlanSection>
                <PlanDetails>
                    <Plan>
                        <ButtonWrapper>
                            <StyledButton onClick={() => handleSubscription('Elite')} disabled={currentPlan === 'Elite' && !isSubscriptionExpired()}>Welcome to Elite</StyledButton>
                        </ButtonWrapper>
                        <FeaturesList>
                            <FeatureItem>Up to 10x more space to store the files</FeatureItem>
                            <FeatureItem>Store files by user choice</FeatureItem>
                            <FeatureItem>Subscription Duration: 28 days</FeatureItem>
                        </FeaturesList>
                    </Plan>
                    <Plan>
                        <ButtonWrapper>
                            <StyledButton onClick={() => handleSubscription('Deluxe')} disabled={currentPlan === 'Deluxe' && !isSubscriptionExpired()}>Welcome to Deluxe</StyledButton>
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
