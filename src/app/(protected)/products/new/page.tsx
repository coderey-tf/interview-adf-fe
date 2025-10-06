'use client'

import { ProductForm } from '@/components/products/product-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NewProductPage() {
    const router = useRouter()

    return (
        <div className="space-y-6 p-12">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <h1 className="text-3xl font-bold">Add New Product</h1>
            </div>

            <div className="max-w-2xl">
                <ProductForm />
            </div>
        </div>
    )
}