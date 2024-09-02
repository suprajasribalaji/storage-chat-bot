import styled from "styled-components";
import { colors } from "../assets/themes/color";
import { useEffect, useState } from "react";
import { auth, database } from "../config/firebase.config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { User } from "../utils/utils";
import { StyledLoadingOutlined } from "./modal/ProfileSettingsModal";

const ContentBeforeStartingChatComponent = () => {
    const user_id = auth.currentUser?.uid;
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user_id) {
            setError('User not found! Please ensure you are logged in!');
            return;
        }

        const getCurrentUserName = () => {
            try {
                const userQuery = query(
                    collection(database, 'Users'),
                    where('email', '==', auth.currentUser?.email)
                );

                const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
                    if (querySnapshot.empty) {
                        setError("No user found!");
                        return;
                    }

                    querySnapshot.forEach((doc) => {
                        const userData = doc.data() as User;
                        setCurrentUser(userData);
                    });
                }, (error) => {
                    console.error('Error fetching name from database:', error);
                    setError('Error fetching name from database');
                });

                return unsubscribe;

            } catch (error) {
                console.error('Error fetching name from database:', error);
                setError('Error fetching name from database');
            }
        };

        const unsubscribe = getCurrentUserName();

        return () => {
            if (unsubscribe) unsubscribe();
        };

    }, [user_id]);

    return (
        <ContentBeforeStartingChat>
            <Content>
                {error ? (
                    <>{error}</>
                ) : currentUser ? (
                    <>WareHouse family welcomes you, {currentUser.nick_name || currentUser.full_name || currentUser.email}!</>
                ) : (
                    <StyledLoadingOutlined spin />
                )}
            </Content>
        </ContentBeforeStartingChat>
    );
};

export default ContentBeforeStartingChatComponent;

const ContentBeforeStartingChat = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70vh;
    width: 100%;
`;

const Content = styled.p`
    font-weight: bold;
    font-size: 280%;
    color: ${colors.deepOceanBlue};
    font-family: "Grey Qo", cursive;
    font-style: normal;
    text-align: center;
`;