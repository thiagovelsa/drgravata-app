import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  name: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ name }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex items-center">
      <Avatar className="w-8 h-8 mr-2">
        <AvatarFallback className="bg-primary text-white">{getInitials(name)}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">{name}</span>
      <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
    </div>
  );
};

export default UserAvatar;
