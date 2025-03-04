"use client"
import React, { PropsWithChildren } from 'react'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'


const TansQueryProvider = ({children}:PropsWithChildren) => {
const queryClient = new QueryClient()
  return (
     <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export default TansQueryProvider
