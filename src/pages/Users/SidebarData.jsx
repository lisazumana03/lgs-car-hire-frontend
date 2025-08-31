import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import BackpackIcon from "@mui/icons-material/Backpack";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import PaymentIcon from "@mui/icons-material/Payment";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HistoryIcon from "@mui/icons-material/History";
// List of sidebar items
const SidebarData = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: HomeIcon,
  },
  {
    title: "Bookings",
    path: "/bookings",
    icon: BackpackIcon,
  },
  {
    title: "Cars",
    path: "/cars",
    icon: DirectionsCarIcon,
  },
  {
    title: "Notifications",
    path: "/notifications",
    icon: NotificationsIcon,
  },
  {
    title: "Profile",
    path: "/profile",
    icon: PersonIcon,
  },
  {
    title: "History",
    path: "/history",
    icon: HistoryIcon,
  },
  {
    title: "Payments",
    path: "/payment",
    icon: PaymentIcon,
  },
];

export default SidebarData;
