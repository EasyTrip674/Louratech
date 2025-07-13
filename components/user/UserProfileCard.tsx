"use client";
import React from "react";
import Image from "next/image";
import { Role } from "@prisma/client";

export default function UserProfileCard({
  firstName,
  lastName,
  address,
  imageSrc,
  role = Role.CLIENT,
  email,
  phone
}: {
  email?:string | null;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  imageSrc?: string;
  role: Role;
}) {
  const getInitials = () => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return first + last || '?';
  };

  const getRoleColor = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case Role.CLIENT:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 dark:border-gray-800 dark:bg-gray-900 dark:hover:shadow-gray-900/20">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:to-gray-800/30" />
      
      <div className="relative z-10">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner transition-transform duration-200 group-hover:scale-105 dark:border-gray-700 dark:from-gray-700 dark:to-gray-800 sm:h-20 sm:w-20">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={`${firstName} ${lastName}`}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-semibold text-white sm:text-xl">
                  {getInitials()}
                </div>
              )}
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-400 dark:border-gray-900" />
          </div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg leading-tight">
                {firstName} {lastName}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {email}
              </p>
            </div>

            {/* Role Badge */}
            <div className="mb-3 flex justify-center sm:justify-start">
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getRoleColor(role)}`}>
                {role}
              </span>
            </div>

            {/* Contact Details */}
            <div className="space-y-2 text-sm">
              {phone && (
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 sm:justify-start">
                  <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{phone}</span>
                </div>
              )}
              {address && (
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 sm:justify-start">
                  <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}