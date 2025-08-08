"use client";
import React, { useState, useRef } from "react";
import { logoutUserAction } from "@/capabilities/users/actions/logoutUserAction";
import { useClickOutside } from "@/capabilities/users/hooks/useClickOutside";

interface UserMenuProps {
  userName: string;
  profileUrl: string;
}

export const UserMenu = ({ userName, profileUrl }: UserMenuProps) => {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
      <div className="px-4 py-2 text-gray-700">
        <p className="text-sm">Hi, {userName}!</p>
      </div>
      <a
        href={profileUrl}
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        Profile
      </a>
      <button
        onClick={logoutUserAction}
        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 hover:rounded-md"
      >
        Logout
      </button>
    </div>
  );
};

interface UserProfileProps {
  userName: string;
}

export const UserProfileDropdown = ({ userName }: UserProfileProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setMenuOpen(false));

  return (
    <div className="mx-auto my-auto relative" ref={dropdownRef}>
      <div
        className="flex rounded-full bg-white w-10 h-10 shadow-md items-center justify-center cursor-pointer"
        onClick={() => setMenuOpen((open) => !open)}
        tabIndex={0}
        aria-label="User menu"
      >
        <span className="block text-2xl font-bold text-gray-700">
          {userName[0]}
        </span>
      </div>
      {menuOpen && <UserMenu userName={userName} profileUrl={`/profile`} />}
    </div>
  );
};
