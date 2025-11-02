/**
 * Refactored Feedback Component
 * Simplified main component with extracted sub-components
 */

"use client";

import React from "react";
import { HelpCircle, MessageSquare, X } from "lucide-react";
import { useFeedbackForm } from "./hooks/useFeedbackForm";
import { FeedbackTypeSelector } from "./components/FeedbackTypeSelector";
import { FeedbackFormStep } from "./components/FeedbackFormStep";
import { ThankYouMessage } from "./components/ThankYouMessage";

/**
 * Main Feedback Component
 * Refactored for improved maintainability and reduced complexity
 */
export default function ImprovedFeedbackComponent() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const {
    step,
    setStep,
    isSubmitting,
    isSuccess,
    showThankYou,
    feedback,
    validationErrors,
    characterCount,
    isTyping,
    handleSubmit,
    resetForm,
    handleMessageChange,
    handleTypeChange,
    updateField
  } = useFeedbackForm();

  // Handler for type selection (moves to step 2)
  const handleTypeSelect = (type: typeof feedback.type) => {
    handleTypeChange(type);
    setStep(2);
  };

  // Handler for closing modal
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(resetForm, 300);
  };

  // Render step content
  const renderStepContent = (): React.ReactNode => {
    if (showThankYou) {
      return <ThankYouMessage />;
    }

    switch (step) {
      case 1:
        return <FeedbackTypeSelector onSelect={handleTypeSelect} />;

      case 2:
        return (
          <FeedbackFormStep
            feedback={feedback}
            validationErrors={validationErrors}
            characterCount={characterCount}
            isTyping={isTyping}
            isSubmitting={isSubmitting}
            isSuccess={isSuccess}
            onBack={() => setStep(1)}
            onSubmit={handleSubmit}
            onMessageChange={handleMessageChange}
            updateField={updateField}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Floating action button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-200"
        >
          <HelpCircle className="w-7 h-7 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:rotate-12 transition-transform duration-300" />

          {/* Notification badge */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            !
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Donnez-nous votre avis
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 dark:text-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="sticky top-0 border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Votre Feedback</h2>
              </div>

              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              {renderStepContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
