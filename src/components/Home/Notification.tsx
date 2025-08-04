import React, { useState } from 'react';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    Badge,
    NavbarItem,
} from "@heroui/react";
import { BsBell } from "react-icons/bs";
import { format } from "timeago.js";

// Interface cho thông báo (giả định từ WebSocket)
interface Notification {
    id: number;
    message: string;
    isRead: boolean;
    createdAt: string;
}

const NotificationDropdown: React.FC = () => {
    // Placeholder cho dữ liệu thông báo (sẽ được thay bằng WebSocket)
    const [notifications, setNotifications] = useState<Notification[]>([
        // Dữ liệu mẫu
        { id: 1, message: "Người dùng A đã theo dõi câu hỏi của bạn", isRead: false, createdAt: new Date().toISOString() },
        { id: 2, message: "Người dùng B đã trả lời câu hỏi của bạn", isRead: true, createdAt: new Date(Date.now() - 3600000).toISOString() },
    ]);

    // Số lượng thông báo chưa đọc
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    // Hàm xử lý đánh dấu đã đọc (placeholder, bạn có thể gửi qua WebSocket)
    const handleMarkAsRead = (notificationId: number) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
        );
        // Gửi yêu cầu qua WebSocket nếu cần (ví dụ: { type: "mark_read", notificationId })
    };

    return (
        <Popover placement="bottom-end" offset={10}>
            <PopoverTrigger>
                <NavbarItem className="mx-2">
                    <Badge content={unreadCount > 0 ? unreadCount : null} color="danger" size="sm">
                        <BsBell className="h-6 w-6 cursor-pointer" />
                    </Badge>
                </NavbarItem>
            </PopoverTrigger>
            <PopoverContent className="p-3 bg-content1 rounded-md max-w-[300px] shadow-lg">
                <div className="flex flex-col gap-y-2">
                    <h3 className="font-semibold text-sm text-foreground">Thông báo</h3>
                    {notifications.length === 0 ? (
                        <p className="text-xs text-gray-500">Không có thông báo nào</p>
                    ) : (
                        <div className="max-h-[200px] overflow-y-auto">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-2 rounded-md text-xs cursor-pointer transition-colors ${notification.isRead ? 'opacity-60 hover:bg-content2' : 'bg-content2 hover:bg-content3'
                                        }`}
                                    onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                                >
                                    <p className="text-foreground">{notification.message}</p>
                                    <span className="text-gray-500">{format(new Date(notification.createdAt))}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationDropdown;
