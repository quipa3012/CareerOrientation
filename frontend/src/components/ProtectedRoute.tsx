import React, { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { message } from "antd";
import type { RootState } from "../store/store";

type ProtectedRouteProps = {
    children: React.ReactNode;
    roles?: string[];
};

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
    const { authenticated, role } = useSelector((state: RootState) => state.auth);
    const location = useLocation();
    const warned = useRef(false);

    useEffect(() => {
        if (warned.current) return;
        if (!authenticated) {
            message.warning("Bạn cần đăng nhập để tiếp tục");
            warned.current = true;
        } else if (roles && role && !roles.includes(role)) {
            message.error("Bạn không có quyền truy cập trang này");
            warned.current = true;
        }
    }, [authenticated, role, roles]);

    if (!authenticated) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    if (roles && role && !roles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
}
