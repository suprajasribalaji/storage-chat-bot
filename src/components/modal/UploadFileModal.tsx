import React, { useState } from "react";
import styled from "styled-components";
import { InboxOutlined } from '@ant-design/icons';
import { Modal, message, Upload, Button } from 'antd';
import type { UploadProps, RcFile } from 'antd/es/upload/interface';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../../config/firebase.config";

const storage = getStorage(app);
const { Dragger } = Upload;

type UploadFileModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const UploadFileModal: React.FC<UploadFileModalProps> = ({ isModalOpen, setIsModalOpen }) => {
  const [selectedFiles, setSelectedFiles] = useState<RcFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    setUploading(true);
    let success = true;

    // link generate aagu adha store paniaka
    try {
      for (const file of selectedFiles) {
        const storageRef = ref(storage, `${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        // await setDoc(do(db, "files", file.name), metadata);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload is ${progress}% done`);
            },
            (error) => {
              console.error("Upload failed:", error);
              message.error(`${file.name} upload failed.`);
              success = false;
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref); 
              console.log('url: ', downloadURL);
              
              console.log("File available at", downloadURL);
              message.success(`${file.name} uploaded successfully.`);
              resolve();
            }
          );
        });
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      message.error('Upload failed.');
      success = false;
    } finally {
      if (success) {
        setIsModalOpen(false);
      }
      setUploading(false);
    }
  };

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    beforeUpload: (file) => {
      setSelectedFiles(prev => [...prev, file]);
      return false;
    },
    onRemove: (file) => {
      setSelectedFiles(prev => prev.filter(item => item.uid !== file.uid));
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <UploadFile>
      <Modal
        title='Upload File'
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="upload" type="primary" onClick={handleUpload} disabled={uploading || selectedFiles.length === 0}>
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>,
        ]}
      >
        <StyledDraggerDropper>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibited from uploading company data or other
              banned files.
            </p>
          </Dragger>
        </StyledDraggerDropper>
      </Modal>
    </UploadFile>
  );
};

export default UploadFileModal;

const UploadFile = styled.div``;

const StyledDraggerDropper = styled.div`
  margin: 5%;
`;
