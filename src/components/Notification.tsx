import { Bell } from "lucide-react";

const Notification = () => {
  return (
    <div className="relative">
      <div className="p-1 rounded-full">
        <Bell className="text-gray-600 w-6 h-6 cursor-pointer" />
      </div>
    </div>
  );
};

export default Notification;