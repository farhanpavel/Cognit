"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Home,
  Settings,
  CreditCard,
  Bell,
  FileText,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  AlarmClock,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Residebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "schedule", label: "Schedule", icon: AlarmClock },
  ];
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarVariants = {
    expanded: { width: "280px" },
    collapsed: { width: "80px" },
  };

  const userInfoVariants = {
    expanded: { opacity: 1, height: "auto" },
    collapsed: { opacity: 0, height: 0 },
  };

  const labelVariants = {
    expanded: { opacity: 1, x: 0, display: "block" },
    collapsed: { opacity: 0, x: -10, transitionEnd: { display: "none" } },
  };

  const SidebarContent = () => (
    <motion.div
      className="h-full flex flex-col bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 overflow-hidden"
      initial="expanded"
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header with toggle button */}
      <div className="flex items-center justify-between p-4">
        <div></div>
        <motion.div
          className="flex items-center justify-center gap-3"
          variants={labelVariants}
        >
          <img src="/images/Group.jpg" alt="Logo" className="h-8" />
        </motion.div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-tertiary hover:bg-[#7657ff]/10"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {/* User Profile Section */}

      <Separator className="my-2" />

      {/* Navigation Menu */}
      <div className="flex-1 overflow-hidden py-2 px-3">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <TooltipProvider key={item.id} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/researchdashboard/${item.id}`}
                    onClick={() => setActiveItem(item.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md group relative ${
                      activeItem === item.id
                        ? "bg-tertiary/10 text-tertiary"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <item.icon
                        size={20}
                        className={
                          activeItem === item.id ? "text-tertiary" : ""
                        }
                      />
                    </motion.div>

                    <motion.span
                      className="text-sm font-medium flex-1"
                      variants={labelVariants}
                    >
                      {item.label}
                    </motion.span>

                    {item.badge && (
                      <motion.div variants={labelVariants}>
                        <Badge className="bg-tertiary hover:bg-tertiary/90">
                          {item.badge}
                        </Badge>
                      </motion.div>
                    )}

                    {activeItem === item.id && (
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary rounded-r-md"
                        layoutId="activeIndicator"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    {item.label}
                    {item.badge && ` (${item.badge})`}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
      </div>

      <Separator className="my-2" />

      {/* Logout Button */}
      <div className="p-4">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/">
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600 ${
                    isCollapsed ? "px-3" : ""
                  }`}
                >
                  <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LogOut size={20} />
                  </motion.div>
                  <motion.span
                    variants={labelVariants}
                    className="text-sm font-medium"
                  >
                    Logout
                  </motion.span>
                </Button>
              </Link>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">Logout</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-screen sticky top-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed top-4 left-4 z-40"
            >
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px]">
            <div className="h-full">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
