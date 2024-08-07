import { Button } from "antd";
import styled from "styled-components";
import { ColorBlue, ColorRed, ColorWhite } from "../../assets/themes/color";

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
`;

const StyledDeleteButton = styled(StyledButton)`
    background-color: ${ColorRed.wineRed};
    border: none;
    color: ${ColorWhite.white};

    &&&:hover, &&&:focus {
        color: ${ColorRed.wineRed};
        background-color: ${ColorWhite.white};
    }
`;

const StyledEnableExportButton = styled(StyledButton)`
    background-color: ${ColorBlue.steelBlue};
    color: ${ColorWhite.white};
    border: none;
    &&&:hover, &&&:focus {
        background-color: ${ColorWhite.white};
        color: ${ColorBlue.deepOceanBlue};
    }
`;