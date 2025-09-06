"use client"
import React, { PropsWithChildren, useEffect } from 'react'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { loadTokens } from '@/lib/BackendConfig/api';


const TansQueryProvider = ({children}:PropsWithChildren) => {
  useEffect(() => {
    loadTokens(); // Charger les tokens au démarrage
  }, []);
const queryClient = new QueryClient(
  {
  }
)
  return (
     <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export default TansQueryProvider
