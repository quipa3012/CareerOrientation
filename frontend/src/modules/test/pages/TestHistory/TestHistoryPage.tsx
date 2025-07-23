import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store/store';
import { TestService } from '../../services/TestService';
import type { TestResult } from '../../interfaces/TestInterfaces';
import styles from './TestHistoryPage.module.scss';
import { Table, Tag, Typography } from 'antd';

const { Title } = Typography;

const TestHistoryPage: React.FC = () => {
    const userId = useSelector((state: RootState) => state.user.currentUser?.id);
    const [results, setResults] = useState<TestResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        TestService.getTestHistory(userId)
            .then((data) => setResults(data.reverse()))
            .finally(() => setLoading(false));
    }, [userId]);

    const columns = [
        {
            title: 'Thời gian làm',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleString('vi-VN'),
        },
        {
            title: 'Kết quả dự đoán',
            dataIndex: 'predictedMajor',
            key: 'predictedMajor',
            render: (text: string) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: 'Chi tiết câu trả lời',
            key: 'answers',
            render: (_: any, record: TestResult) => (
                <details className={styles.details}>
                    <summary>Xem</summary>
                    <pre>{JSON.stringify(record.answers, null, 2)}</pre>
                </details>
            ),
        },
    ];

    return (
        <div className={styles.container}>
            <Title level={2} className={styles.title}>Lịch sử làm trắc nghiệm</Title>
            <Table
                dataSource={results}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5 }}
                bordered
            />
        </div>
    );
};

export default TestHistoryPage;
