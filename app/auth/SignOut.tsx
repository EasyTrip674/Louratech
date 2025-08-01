"use client";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";



const SignOutButton = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter();

  const handleSignOut = async () => {
    // Add your sign out logic here
    // Example: signOut(), auth.logout(), etc.
    await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/auth/signin"); // redirect to login page
          },
        },
      });
    closeModal();
  };

  return (
    <>
   
   <button
            onClick={openModal}
        className="flex items-center text-red-500 gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
        <svg
            className="fill-gray-500 group-hover:fill-gray-700 dark:group-hover:fill-gray-300"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
            fill=""
            />
        </svg>
        Deconnexion
        </button>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[584px] p-5 lg:p-10">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full dark:bg-red-900/20">
              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                ></path>
              </svg>
            </div>
          </div>

          <h3 className="mb-2 text-lg font-medium text-center text-gray-900 dark:text-white">
            Déconnexion
          </h3>
          
          <p className="mb-6 text-sm text-center text-gray-500 dark:text-gray-400">
            Êtes-vous sûr de vouloir vous déconnecter de votre compte ?
          </p>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-gray-200 dark:border-gray-700"
              onClick={closeModal}
              size="sm"
            >
              Annuler
            </Button>
            
            <Button
              variant="primary"
              className="flex-1 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
              onClick={handleSignOut}
              size="sm"
            >
              Déconnecter
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SignOutButton;