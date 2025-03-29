"use client";
import { authClient } from '@/lib/auth-client';
import React from 'react';

const Temp =  () => {
    const { 
        data: session, 
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = authClient.useSession();
    
    console.log(session);

    return (
        <div>
          
        </div>
    );
};

export default Temp;