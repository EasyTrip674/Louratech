import Image from "next/image";
import React from "react";

export default function SidebarWidget() {
  return (
    <div
      className={`
        mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]`}
    >
      <Image
        src="/a/2.png"
        alt="Illustration"
        width={300}
        height={300}
        className="mx-auto mb-4 h-full w-full max-w-[200px] rounded-2xl object-cover object-center dark:opacity-80 lg:max-w-[300px]"
       />
    </div>
  );
}
