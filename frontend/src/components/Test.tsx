import React from "react";
import { Button, message } from "antd";

const Test: React.FC = () => {
    const openMessage = () => {
        message.success("This is a success message");
    };

    return (
        <div>
            <h1>Hello World</h1>
            <Button type="primary" variant="filled" onClick={openMessage}>
                Show Message
            </Button>
        </div>
    );
};
export default Test;