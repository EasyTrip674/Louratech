"use client";

import React from "react";
import { ServiceCardSkeleton } from "./ServiceCardSkeleton";

export default function ServicesCardsSkeleton() {
  // Create an array of 4 items to simulate loading multiple procedure cards
  const skeletonItems = Array(4).fill(0);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2">
      {skeletonItems.map((_, index) => (
        <ServiceCardSkeleton key={index} />
      ))}
    </div>
  );
}