"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode, useState } from "react";
import {AuthProvider} from "@/lib/authProvider";

export default function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false, // default: true
                    },
                },
            })
    );
    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
         </AuthProvider>
    );
}
