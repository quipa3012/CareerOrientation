import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spin } from "antd";
import styles from "./DocumentViewPage.module.scss";
import { DocumentManagerService } from "../../../teacher/document/services/DocumentManagerService";
import type { DocumentResponse } from "../../../teacher/document/interfaces/DocumentManagerInterface";

const DocumentViewPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [document, setDocument] = useState<DocumentResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        DocumentManagerService.getDocumentById(Number(id))
            .then(res => {
                setDocument(res);
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className={styles.container}>
                <Spin />
            </div>
        );
    }

    if (!document) {
        return (
            <div className={styles.container}>
                <p>Không tìm thấy tài liệu</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Button onClick={() => navigate(-1)}>⬅ Quay lại</Button>
                <h2>{document.title}</h2>
            </div>
            <div className={styles.viewer}>
                <iframe
                    src={document.fileUrl}
                    title="PDF Viewer"
                    width="100%"
                    height="100%"
                />
            </div>
        </div>
    );
};

export default DocumentViewPage;
