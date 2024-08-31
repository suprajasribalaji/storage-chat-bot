import styled from "styled-components";
import { colors } from "../assets/themes/color";
import { useEffect, useState } from "react";
import { auth, document } from "../config/firebase.config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { User } from "../utils/utils";

const ContentBeforeStartingChatComponent = () => {
    const user_id = auth.currentUser?.uid;
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        if (!user_id) throw new Error('User not found! Please ensure you are logged in!');

        const getCurrentUserName = () => {
            try {
                const userQuery = query(
                    collection(document, 'Users'),
                    where('email', '==', auth.currentUser?.email)
                );

                const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
                    if (querySnapshot.empty) {
                        console.error("No user found!");
                        return;
                    }

                    querySnapshot.forEach((doc) => {
                        const userData = doc.data() as User;
                        setCurrentUser(userData);
                    });
                });

                return unsubscribe;

            } catch (error) {
                console.error('Error fetching name from database:', error);
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
                {
                    currentUser?.nick_name ? 
                    <>WareHouse family welcomes you, {currentUser?.nick_name}!</> :
                    currentUser?.full_name ?
                    <>WareHouse family welcomes you, {currentUser?.full_name}!</> :
                    <>WareHouse family welcomes you, {currentUser?.email}!</>
                }
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
