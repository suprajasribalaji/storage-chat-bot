import { Button } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { ColorRed, ColorWhite } from '../../assets/themes/color';

const ProfileSettingsContentModal: React.FC = () => {
    const [profile, setProfile] = useState({
        fullname: 'Supraja Sri',
        callAs: 'Supraja',
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
                    name="fullname"
                    value={profile.fullname}
                    onChange={handleChange}
                />
            </ProfileField>
            <ProfileField>
                <Label>Call As</Label>
                <Input
                    type="text"
                    name="callAs"
                    value={profile.callAs}
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
    background-color: ${ColorRed.wineRed};
    border: none;
    color: ${ColorWhite.white};

    &&&:hover, &&&:focus {
        color: ${ColorRed.wineRed};
        background-color: ${ColorWhite.white};
    }
`;
