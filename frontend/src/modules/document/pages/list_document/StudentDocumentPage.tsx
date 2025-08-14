import React, { useEffect, useState } from "react";
import { Table, Button, Input, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchAllDocuments, searchDocuments } from "../../../teacher/document/stores/DocumentManagerSlice";
import type { DocumentResponse } from "../../../teacher/document/interfaces/DocumentManagerInterface";
import { useNavigate } from "react-router-dom";
import styles from "./StudentDocumentPage.module.scss";

const StudentDocumentPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { documents, loading } = useSelector((state: RootState) => state.documents);
    const [filteredDocuments, setFilteredDocuments] = useState<DocumentResponse[]>([]);
    const [searchKeyword, setSearchKeyword] = useState("");

    useEffect(() => {
        dispatch(fetchAllDocuments());
    }, [dispatch]);

    useEffect(() => {
        setFilteredDocuments(documents);
    }, [documents]);

    const handleSearch = async () => {
        if (!searchKeyword.trim()) {
            setFilteredDocuments(documents);
            return;
        }
        try {
            const resultAction = await dispatch(searchDocuments({ keyword: searchKeyword }));
            if (searchDocuments.fulfilled.match(resultAction)) {
                setFilteredDocuments(resultAction.payload);
            } else {
                message.error("Tìm kiếm thất bại");
            }
        } catch (err) {
            console.error(err);
            message.error("Tìm kiếm thất bại");
        }
    };

    const columns = [
        { title: "Tiêu đề", dataIndex: "title" },
        { title: "Mô tả", dataIndex: "description", ellipsis: true },
        {
            title: "Ngày đăng tải",
            dataIndex: "updatedAt",
            render: (text: string) => new Date(text).toLocaleDateString(),
        },
        {
            title: "Người đăng tải",
            dataIndex: "updatedBy",
            render: (text: string) => text || "Không xác định",
        },
        {
            title: "File",
            dataIndex: "fileUrl",
            render: (_: string, record: DocumentResponse) =>
                record.fileUrl ? (
                    <Button type="link" onClick={() => navigate(`${record.id}`)}>
                        Xem tài liệu
                    </Button>
                ) : (
                    "Không có"
                ),
        },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Tài liệu học tập</h2>
                <div className={styles.searchWrapper}>
                    <Input
                        placeholder="Tìm kiếm tài liệu theo tiêu đề..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onPressEnter={handleSearch}
                        className={styles.searchInput}
                    />
                    <Button onClick={handleSearch} className={styles.searchButton}>
                        Tìm kiếm
                    </Button>
                </div>
            </div>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={filteredDocuments}
                loading={loading}
                bordered
                pagination={{ pageSize: 10 }}
                className={styles.table}
            />
        </div>
    );
};

export default StudentDocumentPage;
