import React from "react";
import { IconClock, IconMessageDots, IconBell } from "@tabler/icons-react";

const NotificationComponent = ({ data }: any) => {
  // Format the date properly using the createdAt timestamp
  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.round(diffMs / 60000);
      const diffHours = Math.round(diffMins / 60);
      const diffDays = Math.round(diffHours / 24);

      if (diffMins < 60) {
        return `${diffMins} minutes ago`;
      } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      } else {
        return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
      }
    } catch (error) {
      return "recently";
    }
  };

  return (
    <div
      key={data.id}
      className={`rounded-xl p-4 md:p-6 ${
        !data.isRead ? "bg-primary/10" : "bg-primary/5 dark:bg-bg3"
      } mb-4 flex flex-wrap items-start gap-4 border border-n30 last:mb-0 dark:border-n500 md:gap-6`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <IconBell size={24} />
      </div>
      <div className="grow">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 md:gap-4">
          <p className="text-xl font-medium">{data.title}</p>
          <span className="text-sm text-n100 dark:text-n50">
            {formatTimeAgo(data.createdAt)}
          </span>
        </div>
        <div className="bb-dashed mb-5 flex gap-1 pb-5">
          <IconMessageDots className="mt-1 flex-shrink-0 text-primary" />
          <div className="flex flex-wrap items-center gap-1 text-sm">
            <span>{data.message}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-n100 dark:text-n50">
          <IconClock size={16} className="flex-shrink-0" />
          <div className="flex items-center gap-2">
            <p className="text-sm">
              {new Date(data.createdAt).toLocaleDateString()}
            </p>
            <span className="text-xs">
              {new Date(data.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationComponent;
