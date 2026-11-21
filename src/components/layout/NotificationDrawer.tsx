import React from 'react'
import { Drawer, Notification, Button } from '@/components/common'
import { useNotificationStore, useUIStore } from '@/store'
import { BellCheck, Trash2 } from 'lucide-react'

export const NotificationDrawer: React.FC = () => {
  const { notificationDrawerOpen, setNotificationDrawerOpen } = useUIStore()
  const { notifications, markAsRead, markAllAsRead, clearAll, unreadCount } = useNotificationStore()

  const unread = unreadCount()

  return (
    <Drawer
      isOpen={notificationDrawerOpen}
      onClose={() => setNotificationDrawerOpen(false)}
      title="Notifications & Activity"
      description={`${unread} unread update${unread === 1 ? '' : 's'}`}
      size="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            leftIcon={<Trash2 className="w-3.5 h-3.5 text-secondary-text" />}
          >
            Clear All
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={markAllAsRead}
            disabled={unread === 0}
            leftIcon={<BellCheck className="w-3.5 h-3.5" />}
          >
            Mark All Read
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-secondary-text text-sm">
            <p>No notifications at the moment</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <Notification
              key={notif.id}
              notification={notif}
              onMarkAsRead={markAsRead}
            />
          ))
        )}
      </div>
    </Drawer>
  )
}
