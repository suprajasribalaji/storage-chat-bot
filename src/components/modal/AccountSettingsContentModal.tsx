import { Button } from "antd";
import styled from "styled-components";
import { colors } from "../../assets/themes/color";

const AccountSettingsContentModal = () => {
    return (
        <AccountSettingsContent>
            <SettingsItem>
                <Label>Multi-factor authentication</Label>
                <StyledEnableExportButton>Enable</StyledEnableExportButton>
            </SettingsItem>
            <SettingsItem>
                <Label>Export data</Label>
                <StyledEnableExportButton>Export</StyledEnableExportButton>
            </SettingsItem>
            <SettingsItem>
                <Label>Delete your account</Label>
                <StyledDeleteButton>Delete</StyledDeleteButton>
            </SettingsItem>
        </AccountSettingsContent>
    );
}

export default AccountSettingsContentModal;

const AccountSettingsContent = styled.div`
    padding: 2%;
`;

const SettingsItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5%;
`;

const Label = styled.div`
    font-size: 100%;
`;

const StyledButton = styled(Button)`
    transform: translateX(-40%);
    border: none;
    &&&:hover, &&&:focus {
        background-color: ${colors.white};
    }
`;

const StyledDeleteButton = styled(StyledButton)`
    background-color: ${colors.wineRed};
    color: ${colors.white};
    &&&:hover, &&&:focus {
        color: ${colors.wineRed};
    }
`;

const StyledEnableExportButton = styled(StyledButton)`
    background-color: ${colors.steelBlue};
    color: ${colors.white};
    &&&:hover, &&&:focus {
        color: ${colors.deepOceanBlue};
    }
`;