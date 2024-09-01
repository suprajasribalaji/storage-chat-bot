import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const CustomCenterSpinner = () => (
  <SpinContainer>
    <Spin indicator={<StyledLoadingIcon spin />} />
  </SpinContainer>
);

export default CustomCenterSpinner;

const SpinContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledLoadingIcon = styled(LoadingOutlined)`
  font-size: 24px;
  color: #1890ff;
`;