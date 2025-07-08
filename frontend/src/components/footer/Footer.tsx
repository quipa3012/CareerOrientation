import React from 'react';
import { Layout, Row, Col, Typography } from 'antd';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

const Footer: React.FC = () => {
    return (
        <AntFooter className={styles.footer}>
            <Row justify="space-between" align="middle">
                <Col>
                    <Text className={styles.logo}>CareerConnect</Text>
                    <Text className={styles.copyRight}>
                        © {new Date().getFullYear()} CareerConnect. All rights reserved.
                    </Text>
                </Col>

                <Col>
                    <Row gutter={[16, 8]} className={styles.links}>
                        <Col><Link to="/about">Giới thiệu</Link></Col>
                        <Col><Link to="/contact">Liên hệ</Link></Col>
                        <Col><Link to="/policy">Chính sách</Link></Col>
                    </Row>
                </Col>
            </Row>
        </AntFooter>
    );
};

export default Footer;
