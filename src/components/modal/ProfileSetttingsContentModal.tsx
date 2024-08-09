import { Button } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { colors } from '../../assets/themes/color';

const ProfileSettingsContentModal: React.FC = () => {
    const [profile, setProfile] = useState({
        fullName: 'Supraja Sri',
        nickName: 'Supraja',
        email: 'suprajasrirb@gmail.com',
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setProfile({
            ...profile,
            [name]: value,
        });
    };

    return (
        <ProfileSettingsContent>
            <ProfileField>
                <Label>Full Name</Label>
                <Input
                    type="text"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleChange}
                />
            </ProfileField>
            <ProfileField>
                <Label>Nick Name</Label>
                <Input
                    type="text"
                    name="nickName"
                    value={profile.nickName}
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
                <StyledUpdateButton>Update</StyledUpdateButton>
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
    background-color: ${({ disabled }) => (disabled ? '#f5f5f5' : 'white')};

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

    &&&:hover, &&&:focus {
        color: ${colors.wineRed};
        background-color: ${colors.white};
    }
`;
