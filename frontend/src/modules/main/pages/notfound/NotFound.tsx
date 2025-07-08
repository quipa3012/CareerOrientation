import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    const handleBackHome = () => {
        navigate('/');
    };

    return (
        <Result
            status="404"
            title="404"
            subTitle="Xin lỗi, trang bạn tìm kiếm không tồn tại."
            extra={
                <Button type="primary" onClick={handleBackHome}>
                    Quay về Trang Chủ
                </Button>
            }
        />
    );
};

export default NotFound;
