"use client";
import { formatDistanceToNow } from 'date-fns';

interface ChatBubbleProps {
  message: string;
  isStaff: boolean;
  authorName?: string;
  timestamp: Date;
}

export default function ChatBubble({ message, isStaff, authorName, timestamp }: ChatBubbleProps) {
  return (
    <div className={`absolute w-full ${isStaff ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isStaff ? 'bg-gray-200 text-gray-800' : 'bg-blue-600 text-white'
        }`}
      >
        {authorName && <p className="mb-1 text-xs font-semibold">{authorName}</p>}
        <p className="text-sm">{message}</p>
        <p className="mt-1 text-right text-xs opacity-70">
          {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}