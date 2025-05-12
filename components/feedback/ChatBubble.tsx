"use client";
import { useModal } from "@/hooks/useModal";
import { HelpCircle } from "lucide-react";
import React from "react";
import { Modal } from "../ui/modal";

export default function FeedBackChat() {
  const {openModal,isOpen,closeModal} = useModal()
  return (
  <>
    <div className="fixed bottom-6 right-6 z-50  sm:block">
    <button
    onClick={openModal}
      className="inline-flex size-14 items-center justify-center rounded-full bg-brand-500 text-white transition-colors hover:bg-brand-600"
    >
      <HelpCircle />
    </button>
    </div>

      <Modal
      isOpen={isOpen}
      onClose={closeModal}

      >

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Feedback</h2>
        <textarea
          className="w-full h-32 p-2 border rounded"
          placeholder="Write your feedback here..."
        ></textarea>
        <button
          className="px-4 py-2 text-white bg-blue-500 rounded"
          onClick={closeModal}
        >
          Submit
        </button>
      </div>
      </Modal>
        </>
  );
}


