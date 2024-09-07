import { Button, message, Popconfirm, Spin, Skeleton } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import styled, { createGlobalStyle } from "styled-components";
import { colors } from "../../assets/themes/color";
import { collection, deleteDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth, database } from "../../config/firebase.config";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "firebase/auth";
import { useEffect, useState } from "react";
import { Profile } from "../../utils/utils";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { requestExportFiles } from "../../redux/slices/user/api";
import { fetchCurrentUserDetails, fetchCurrentUserReferrence } from "../../helpers/helpers";

type AccountSettingsContentModalProps = {
    profile: Profile;
    setSelectedKey: React.Dispatch<React.SetStateAction<string>>;
};

const AccountSettingsContentModal = (props: AccountSettingsContentModalProps) => {
    const { setSelectedKey } = props;
    const user_id = auth.currentUser?.uid;
    const [fileDownloadURL, setFileDownloadURL] = useState<string[]>([]);
    const [fileNames, setFileNames] = useState<string[]>([]);
    const [currentPlan, setCurrentPlan] = useState<string>('');
    const [is2FAEnable, setIs2FAEnable] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true); // New state for data loading
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (user_id) {
            fetchDataOfCurrentUser(user_id).finally(() => setDataLoading(false)); // Update loading state
        }
    }, [user_id]);

    useEffect(() => {
        fetchCurrentUserPlan().finally(() => setDataLoading(false)); // Update loading state
    }, []);

    const fetchCurrentUserPlan = async () => {
        try {
            const userData = await fetchCurrentUserDetails();
            if(userData) {
                setCurrentPlan(userData.plan);
                setIs2FAEnable(userData.is_2fa_enabled); 
            }
            return;
        } catch (error) {
            console.error("Error fetching user plan: ", error);
        }
    };

    const fetchDataOfCurrentUser = async (user_id: string | undefined) => {
        try {
            const userQuery = query(collection(database, "Files"), where("user_id", "==", user_id));
            const querySnapshot = await getDocs(userQuery);

            if (!querySnapshot.empty) {
                const urls: string[] = [];
                const names: string[] = [];

                querySnapshot.forEach((doc) => {
                    const fileDetails = doc.data();
                    const downloadURL = fileDetails.url;
                    const fileName = fileDetails.file_detail.name + '.' + (fileDetails.file_detail.ext || '');

                    if (!urls.includes(downloadURL)) {
                        urls.push(downloadURL);
                    }

                    if (!names.includes(fileName)) {
                        names.push(fileName);
                    }
                });

                setFileDownloadURL(urls);
                setFileNames(names);
            } else {
                console.log('No data found for this user!');
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const handleExportButton = async () => {
        setLoading(true);
        try {
            if (fileDownloadURL.length === 0 || fileNames.length === 0) {
                message.warning('No files available to export.');
                return;
            }
    
            const exportFileResponse = await dispatch(requestExportFiles({ fileDownloadURL, fileNames }));
            
            if (!exportFileResponse.payload) throw new Error('No data returned from the export API.');
    
            const blob = new Blob([exportFileResponse.payload], { type: 'application/zip' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'warehouse_files.zip';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
    
            message.success('Files exported successfully. Check your downloads.');
        } catch (error) {
            console.error("Error during export process:", error);
            message.error('An error occurred during the export process.');
        } finally {
            setLoading(false);
        }
    };
    
    const handle2FAEnableButton = async () => {
        try {
            if (!user_id) throw new Error('User not logged in');
            const userRef = await fetchCurrentUserReferrence();
            if (userRef) {
                await updateDoc(userRef, {
                    is_2fa_enabled: true,
                });      
                setIs2FAEnable(true);         
                message.success(`Enabled Multi-Factor Authentication!`);
            } else {
                message.error('User not found');
                console.log("No user found with that email.");
            }
        } catch (error) {
            message.error('MFA was not enabled!');
            console.error('Error enabling MFA:', error);
        }
    };

    const handleDeleteButton = async () => {
        try {
            const userRef = await fetchCurrentUserReferrence();
            if (userRef) {
                await deleteDoc(userRef);
                const user = auth.currentUser;
                if (user) {
                    await deleteUser(user);
                    message.success('User account deleted successfully');
                    navigate('/signup');
                } else {
                    message.error('User not found. No account deleted.');
                }
            } else {
                message.error('Check the credentials imported!');
            }
        } catch (error) {
            message.error('User account could not be deleted');
            console.log(error);
        }
    };

    const handleSubscriptionUpdate = () => {
        setSelectedKey('3');
    };

    const customSpinIcon = <LoadingOutlined style={{ fontSize: 18 }} spin />;

    return (
        <Skeleton loading={dataLoading} active>
            <AccountSettingsContent>
                <SettingsItem>
                    <Label>Two-factor authentication</Label>
                    <StyledEnableExportButton onClick={handle2FAEnableButton} disabled={is2FAEnable}>{is2FAEnable ? 'Enabled' : 'Enable'}</StyledEnableExportButton>
                </SettingsItem>
                <SettingsItem>
                    <Label>Export data</Label>
                    <StyledEnableExportButton onClick={handleExportButton} disabled={loading} icon={loading ? <Spin spinning={loading} indicator={customSpinIcon} /> : undefined}>{loading ? 'Exporting' : 'Export'}</StyledEnableExportButton>
                </SettingsItem>
                <SettingsItem>
                    <Label>Current Plan : {currentPlan}</Label>
                    <StyledEnableExportButton onClick={handleSubscriptionUpdate}>Update</StyledEnableExportButton>
                </SettingsItem>
                <SettingsItem>
                    <Label>Delete your account</Label>
                    <Popconfirm
                        title="Delete Account"
                        description="Make sure you exported all data before deleting account. Once you deleted then can't backup stored data."
                        okText="Yes"
                        cancelText="No"
                        onConfirm={handleDeleteButton}
                        okButtonProps={{ className: 'custom-yes-button' }}
                        cancelButtonProps={{ className: 'custom-no-button' }}
                    >
                        <StyledDeleteButton>Delete</StyledDeleteButton>
                    </Popconfirm>
                </SettingsItem>
                <GlobalStyle />
            </AccountSettingsContent>
        </Skeleton>
    );
};

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
    width: 20%;
    transform: translateX(-40%);
    border: none;
    color: ${colors.white};
    &&&:hover, &&&:focus {
        background-color: ${colors.white};
    }
`;

const StyledDeleteButton = styled(StyledButton)`
    background-color: ${colors.wineRed};
    &&&:hover, &&&:focus {
        color: ${colors.wineRed};
    }
`;

const StyledEnableExportButton = styled(StyledButton)`
    background-color: ${colors.steelBlue};
    &&&:hover {
        color: ${colors.deepOceanBlue};
    }
`;

const GlobalStyle = createGlobalStyle`
    .custom-yes-button {
        background-color: ${colors.steelBlue};
        color: ${colors.white};
        border: none;
        &&&:hover, &&&:focus {
            background-color: ${colors.white};
            color: ${colors.steelBlue};
            border: none;
        }
    }

    .custom-no-button {
        background-color: ${colors.wineRed};
        color: ${colors.white};
        border: none;
        &&&:hover, &&&:focus {
            background-color: ${colors.white};
            color: ${colors.wineRed};
            border: none;
        }
    }
`;
