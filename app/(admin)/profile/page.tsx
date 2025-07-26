
import UserCredentialsManage from "@/components/user/ChangePasswordFormModal";
import { UserElementInfo } from "@/components/user/UserElementInfo";
import UserProfileCard from "@/components/user/UserProfileCard";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { headers } from "next/headers";
import { authorizationService } from "@/lib/services";



export default async function profilePage() {
    const user = await auth.api.getSession({
      headers: await headers()
    });

    if (!user) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Non authentifié</h1>
            <p className="text-gray-600">Vous devez être connecté pour accéder à cette page</p>
          </div>
        </div>
      );
    }

    // Vérifier les autorisations
    const canViewProfile = await authorizationService.checkUserPermission(user.userDetails.id, "canCreateAdmin");
    if (!canViewProfile) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h1>
            <p className="text-gray-600">Vous n&apos;avez pas les autorisations nécessaires</p>
          </div>
        </div>
      );
    }

    return (
      <div className="profile-data" data-user={JSON.stringify(user)}>
        <div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
              <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
              Mon Profil
              </h3>
              <div className="space-y-6">

              <UserProfileCard
                  role={user.userDetails?.role as Role}
                  email={user.user.email}
                  firstName={user?.userDetails?.firstName || ""}
                  lastName={user.userDetails?.lastName || ""}
                  phone={user.userDetails.admin?.phone || ""}
                  address={user.userDetails.admin?.address || ""}
                  imageSrc={user.user.image || ""}
              />
                  <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
              <div>
              <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
                  Informations Personnelles
              </h4>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                  <UserElementInfo 
                  label="First Name" 
                  value={user.userDetails?.firstName} 
                  />

                  <UserElementInfo 
                  label="Last Name" 
                  value={user.userDetails?.lastName} 
                  />

                  <UserElementInfo 
                  label="Email address" 
                  value={user.user.email} 
                  />

                  <UserElementInfo 
                  label="Phone" 
                  value={user.userDetails.admin?.phone} 
                  />

          
              
                  <UserElementInfo 
                  label="Address" 
                  value={user.userDetails.admin?.address} 
                  />
              </div>
              </div>

              {/* <Edituser.userDetailsFormModal user.userDetails={user.userDetails} inPageProfile={true} /> */}
          
          </div>

              </div>
              <UserCredentialsManage
              canEditPassword={true}
              role={user.userDetails?.role as Role}
              userId={user.user.id} email={user.user.email} active={user.userDetails?.active} />
              </div>

          
          </div>
        </div>
      </div>
    );

}