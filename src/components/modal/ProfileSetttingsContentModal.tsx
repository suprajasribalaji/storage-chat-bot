import { Button, message } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';
import { colors } from '../../assets/themes/color';
import { auth, document } from '../../config/firebase.config';
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { Profile } from '../../utils/utils';

type ProfileSettingsContentModalProps = {
    profile: Profile;
    setProfile: React.Dispatch<React.SetStateAction<Profile>>;
}

const ProfileSettingsContentModal = ( props: ProfileSettingsContentModalProps ) => {
    const { profile, setProfile } = props;
    const [isChanged, setIsChanged] = useState<boolean>(false);
    
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setIsChanged(true);
        setProfile({
            ...profile,
            [name]: value,
        });
    };

    const handleUpdateButton = async () => {
        if(!auth.currentUser?.email){
            message.error('User is not logged in!');
            return;
        }
        try {
            setIsChanged(false);
            const userQuery = query(collection(document, "Users"), where("email", "==", profile.email));
            const querySnapshot = await getDocs(userQuery);
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userRef = userDoc.ref; 
                await updateDoc(userRef, {
                    full_name: profile.full_name,
                    nick_name: profile.nick_name,
                });
                message.success('Profile updated successfully!');                
            } else {
                message.error('User not found');
                console.log("No user found with that email.");
            }
        } catch (error) {
            console.log(error);
            setIsChanged(false);
        }
    };

    return (
        <ProfileSettingsContent>
            <ProfileField>
                <Label>Full Name</Label>
                <Input
                    type="text"
                    name="full_name"
                    value={profile.full_name}
                    onChange={handleChange}
                />
            </ProfileField>
            <ProfileField>
                <Label>Nick Name</Label>
                <Input
                    type="text"
                    name="nick_name"
                    value={profile.nick_name}
                    onChange={handleChange}
                />
            </ProfileField>
            <ProfileField>
                <Label>Email</Label>
                <Input
                    type="email"
                    name="email"
                    value={profile.email}
                    disabled
                />
            </ProfileField>
            <UpdateButton>
                <StyledUpdateButton onClick={handleUpdateButton} disabled={!isChanged}>Update</StyledUpdateButton>
            </UpdateButton>
        </ProfileSettingsContent>
    );
}

export default ProfileSettingsContentModal;


const ProfileSettingsContent = styled.div`
    padding-left: 2%;
    padding-right: 14%;
`;

const ProfileField = styled.div`
    margin-bottom: 3%;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 1.5%;
`;

const Input = styled.input`
    width: 100%;
    padding: 3%;
    border-radius: 4px;
    border: none;
    outline: none;
    background-color: ${({ disabled }) => (disabled ? '#f5f5f5' : 'white')}; // dont use hexa values directly 

    &:focus {
        border: none;
    }
`;

const UpdateButton = styled.div`
    display: flex;
    margin-top: 5%;
`;

const StyledUpdateButton = styled(Button)`
    background-color: ${colors.wineRed};
    border: none;
    color: ${colors.white};

    &&&:hover {
        color: ${colors.wineRed};
        background-color: ${colors.white};
    }
`;
