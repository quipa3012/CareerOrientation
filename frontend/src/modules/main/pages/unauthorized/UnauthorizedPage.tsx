import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./UnauthorizedPage.module.scss";

export default function UnauthorizedPage() {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/", { replace: true });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.errorCode}>403</h1>
            <h2 className={styles.message}>
                Bạn không có quyền truy cập trang này
            </h2>
            <Button type="primary" onClick={handleGoHome}>
                Quay về trang chủ
            </Button>
        </div>
    );
}
