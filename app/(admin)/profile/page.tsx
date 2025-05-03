
import UserCredentialsManage from "@/components/user/ChangePasswordFormModal";
import { UserElementInfo } from "@/components/user/UserElementInfo";
import UserProfileCard from "@/components/user/UserProfileCard";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { headers } from "next/headers";


export default async function  profilePage() {
    const user = await auth.api.getSession({
        headers: await headers() //some endpoint might require headers
    });

    if (!user) {
        throw new Error("Non authentifié");
    }

    const phone = user.userDetails?.admin ? user.userDetails.admin.phone : user.userDetails?.client?.phone || "";
    const address = user.userDetails?.admin ? user.userDetails.admin.address : user.userDetails?.client?.address || "";

    console.log("User", user);
    return (
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
            phone={phone || ""}
            address={address || ""}
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
              value={phone} 
            />

            <UserElementInfo 
              label="Birth Date" 
              value={user.userDetails?.client?.birthDate?.toLocaleDateString()} 
            />

         {user.userDetails?.client?.passport && (
            <UserElementInfo 
              label="Passport" 
              value={user.userDetails?.client?.passport}
            />
          )}
          {user.userDetails?.client?.fatherFirstName && (
            <UserElementInfo 
              label="Father's Name" 
              value={`${user.userDetails?.client?.fatherFirstName} ${user.userDetails?.client?.fatherLastName}`}
            />
          )}
          {user.userDetails?.client?.motherFirstName && (
            <UserElementInfo 
              label="Mother's Name" 
              value={`${user.userDetails?.client?.motherFirstName} ${user.userDetails?.client?.motherLastName}`}
            />
          )}
          
            <UserElementInfo 
              label="Address" 
              value={address} 
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
    )
}