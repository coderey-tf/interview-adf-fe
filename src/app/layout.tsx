import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import Providers from "@/providers/provider";

export const metadata = {
    title: 'PT. ADIS - Warehouse Management',
    description: 'Warehouse Inventory Management System for PT. ADIS Dimension Footwear',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
            <Providers>
                {children}
                <Toaster />
            </Providers>
        </body>
        </html>
    )
}