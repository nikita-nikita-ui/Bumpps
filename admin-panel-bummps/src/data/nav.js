import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineCreditCard,
  HiOutlineFlag,
  HiOutlineShieldCheck,
  HiOutlineCash,
  HiOutlineBell,
  HiOutlineCog,
} from "react-icons/hi";

export const navSections = [
  {
    label: "Overview",
    items: [
      { 
        to: "/", 
        label: "Dashboard", 
        icon: HiOutlineViewGrid 
      },
    ],
  },

  {
    label: "Platform",
    items: [
      { 
        to: "/users", 
        label: "Users", 
        icon: HiOutlineUsers 
      },
      { 
        to: "/verification", 
        label: "Verification", 
        icon: HiOutlineShieldCheck 
      },
    ],
  },

  {
    label: "Business",
    items: [
      { 
        to: "/subscriptions", 
        label: "Subscriptions", 
        icon: HiOutlineCreditCard 
      },
      { 
        to: "/payments", 
        label: "Payments", 
        icon: HiOutlineCash 
      },
    ],
  },

  {
    label: "Moderation",
    items: [
      { 
        to: "/reports", 
        label: "Reports", 
        icon: HiOutlineFlag 
      },
      { 
        to: "/notifications", 
        label: "Notifications", 
        icon: HiOutlineBell 
      },
    ],
  },

  {
    label: "System",
    items: [
      { 
        to: "/settings", 
        label: "Settings", 
        icon: HiOutlineCog 
      },
    ],
  },
];