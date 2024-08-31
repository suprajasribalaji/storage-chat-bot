import { useState } from "react";
import { Modal, message, Upload, Spin, Button } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import styled from "styled-components";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, document, storage } from '../../config/firebase.config';
import { colors } from "../../assets/themes/color";
import { addDoc, collection } from "firebase/firestore";

const { Dragger } = Upload;

type UploadFileModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadFileModal = ( prop: UploadFileModalProps ) => {
    const { isModalOpen, setIsModalOpen } = prop;
    const [fileList, setFileList] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);

    const props = {
        name: 'file',
        multiple: true,
        fileList,
        beforeUpload: (file: any) => {
            setFileList((prev) => [...prev, file]);
            return false;
        },
        onRemove: (file: any) => {
            setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
        },
        onDrop(e: any) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const addNewFileDetails = async (fileDownloadURL: string, fileName: string) => {
        try {
            const email = auth.currentUser?.email;
            const uid = auth.currentUser?.uid;
    
            if (!email || !uid) {
                throw new Error("User is not authenticated");
            }
    
            const fileRef = await addDoc(collection(document, "Files"), {
                user_id: uid,
                email: email,
                url: fileDownloadURL,
                file_detail: {
                    ext: fileName.split('.').pop() || '',
                    name: fileName.split('.')[0] || '',
                }
            });
            console.log(fileRef.id, ' ------->>> Document added successfully');
        } catch (error) {
            console.log("Error adding file details:", error);
        }
    };

    const handleUpload = () => {
        if (fileList.length === 0) {
            message.warning('Please select at least one file to upload.');
            return;
        }

        setUploading(true);
        let completedUploads = 0;

        fileList.forEach((file) => {
            const storageRef = ref(storage, `${auth.currentUser?.email}/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    message.error(`${file.name} file upload failed.`);
                    console.error('Upload failed:', error);
                    setUploading(false);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        message.success(`${file.name} file uploaded successfully.`);
                        console.log('File available at', downloadURL);
                        addNewFileDetails(downloadURL, file.name);
                        completedUploads++;

                        if (completedUploads === fileList.length) {
                            setUploading(false);
                            setIsModalOpen(false);
                            setFileList([]);                            
                        }
                    });
                }
            );
        });
    };

    return (
        <StyledModal
            title='Upload File'
            open={isModalOpen}
            onCancel={() => {
                if (!uploading) {
                    setIsModalOpen(false);
                    setFileList([]);
                }
            }}
            footer={[
                <CancelButton 
                    key="cancel" 
                    onClick={() => {
                        if (!uploading) {
                            setIsModalOpen(false);
                            setFileList([]);
                        }
                    }}
                    disabled={uploading}
                >
                    Cancel
                </CancelButton>,
                <UploadButton
                    key="upload"
                    onClick={handleUpload}
                    disabled={uploading}
                    icon={uploading ? <Spin size="small" /> : undefined}
                >
                    {uploading ? 'Uploading...' : 'Upload'}
                </UploadButton>
            ]}
        >
            <FileDragger>
                <Dragger {...props} disabled={uploading}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                        banned files.
                    </p>
                </Dragger>
            </FileDragger>
        </StyledModal>
    );
}

export default UploadFileModal;

const StyledModal = styled(Modal)`
  .ant-modal-header {
    .ant-modal-title {
      font-size: 1.3rem;
    }
  }
  .ant-modal-footer {
    display: flex;
    justify-content: flex-end;
  }
`;

const CancelButton = styled(Button)`
  background-color: ${colors.wineRed};
  color: ${colors.white};
  border: none;
  margin-right: 8px;

  &&&:hover {
    background-color: ${colors.white};
    color: ${colors.wineRed};
  }
`;

const UploadButton = styled(Button)`
  background-color: ${colors.denimBlue};
  color: ${colors.white};
  border: none;
  
  &&&:hover {
    background-color: ${colors.white};
    color: ${colors.denimBlue};
  }

  &:disabled {
    background-color: ${colors.lightGray};
    color: ${colors.darkGray};
  }
`;

const FileDragger = styled.div`
  padding: 4%;
`;