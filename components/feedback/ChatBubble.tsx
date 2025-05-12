"use client"
import React, { useState } from "react";
import { useModal } from "@/hooks/useModal";
import { HelpCircle, Send, X } from "lucide-react";
import { Modal } from "../ui/modal";
import TextArea from "../form/input/TextArea";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";

// Enum to match Prisma schema
export enum FeedbackType {
  BUG = "BUG",
  SUGGESTION = "SUGGESTION", 
  QUESTION = "QUESTION",
  OTHER = "OTHER"
}

// Interface for feedback submission
interface FeedbackSubmission {
  message: string;
  type: FeedbackType;
  name?: string;
  email?: string;
  isAnonymous: boolean;
}

export default function FeedBackChat() {
  const { openModal, isOpen, closeModal } = useModal();
  const [feedback, setFeedback] = useState<FeedbackSubmission>({
    message: "",
    type: FeedbackType.OTHER,
    isAnonymous: true,
    name: "",
    email: ""
  });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async () => {
    // Validate feedback
    if (feedback.message.trim() === "") {
      return;
    }

    setSubmitStatus("sending");
    try {
      // Replace with actual API call to submit feedback
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...feedback,
          // Remove optional fields if anonymous
          ...(feedback.isAnonymous && { name: undefined, email: undefined })
        })
      });

      if (!response.ok) {
        throw new Error("Feedback submission failed");
      }
      
      setSubmitStatus("success");
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFeedback({
          message: "",
          type: FeedbackType.OTHER,
          isAnonymous: true,
          name: "",
          email: ""
        });
        setSubmitStatus("idle");
        closeModal();
      }, 2000);
    } catch (error) {
      setSubmitStatus("error");
      console.error("Error submitting feedback:", error);
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 2000);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 sm:block">
        <button
          onClick={openModal}
          aria-label="Ouvrir le formulaire de feedback"
          className="group inline-flex size-14 items-center justify-center rounded-full bg-brand-500 text-white transition-all duration-300 hover:bg-brand-600 hover:rotate-180"
        >
          <HelpCircle className="size-6 group-hover:animate-pulse" />
        </button>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[584px] p-5 lg:p-10"
      >
        <div className="flex flex-col gap-4 relative">
          <button 
            onClick={closeModal} 
            className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Fermer"
          >
            <X className="size-6" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            Votre Feedback
          </h2>

          {/* Feedback Type Selector */}
          <div className="flex gap-2 flex-wrap">
            {Object.values(FeedbackType).map((type) => (
              <Button
                key={type}
                variant={feedback.type === type ? "primary" : "outline"}
                size="sm"
                onClick={() => setFeedback(prev => ({ ...prev, type }))}
                className="capitalize"
              >
                {type.toLowerCase()}
              </Button>
            ))}
          </div>

          {/* Feedback Message */}
          <TextArea
            value={feedback.message}
            onChangeValue={(value) => setFeedback(prev => ({ ...prev, message: value }))}
            placeholder="Svp laisser vos commentaires et suggestions ici..."
            className={`resize-none h-32 transition-all duration-300 ${
              feedback.message.length > 0 
                ? "border-brand-500 ring-2 ring-brand-100" 
                : "border-gray-300"
            }`}
            disabled={submitStatus === "sending"}
          />

          {/* Anonymous Toggle */}
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="anonymousToggle"
              checked={feedback.isAnonymous}
              onChange={() => setFeedback(prev => ({ 
                ...prev, 
                isAnonymous: !prev.isAnonymous,
                // Clear name and email if switching to anonymous
                ...(prev.isAnonymous ? { name: undefined, email: undefined } : {})
              }))}
              className="form-checkbox text-brand-500 rounded"
            />
            <label htmlFor="anonymousToggle" className="text-sm text-gray-700">
              Envoyer anonymement
            </label>
          </div>

          {/* Optional Personal Details if Not Anonymous */}
          {!feedback.isAnonymous && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                value={feedback.name || ""}
                onChange={(e) => setFeedback(prev => ({ 
                  ...prev, 
                  name: e.target.value 
                }))}
                placeholder="Votre nom"
              />
              <Input 
                type="email"
                value={feedback.email || ""}
                onChange={(e) => setFeedback(prev => ({ 
                  ...prev, 
                  email: e.target.value 
                }))}
                placeholder="Votre email"
              />
            </div>
          )}

          <p className="text-sm text-gray-500">
            Vos retours sont précieux pour nous aider à améliorer notre service.
          </p>

          <Button 
            onClick={handleSubmit}
            disabled={feedback.message.trim() === "" || submitStatus === "sending"}
            className="flex items-center justify-center gap-2"
          >
            {submitStatus === "sending" ? (
              <span className="animate-pulse">Envoi en cours...</span>
            ) : submitStatus === "success" ? (
              <>
                <Send className="size-4 mr-2" /> Merci pour votre feedback!
              </>
            ) : submitStatus === "error" ? (
              "Erreur, réessayez"
            ) : (
              <>
                <Send className="size-4 mr-2" /> Envoyer
              </>
            )}
          </Button>
          {submitStatus === "error" && (
            <p className="text-red-500 text-sm text-center">
              Une erreur est survenue. Veuillez réessayer.
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}