'use client'

import React, { useState } from 'react'
import { useCreateProduct } from '@/hooks/useProducts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import {NewProduct} from "@/lib/models/product";

export function ProductForm() {
    const [formData, setFormData] = useState<NewProduct>({
        sku: '',
        name: '',
        stock: 0
    })
    const [errors, setErrors] = useState<Partial<Record<keyof NewProduct, string>>>({})

    const router = useRouter()
    const { toast } = useToast()
    const createProductMutation = useCreateProduct()

    const validateForm = () => {
        const newErrors: Partial<Record<keyof NewProduct, string>> = {}

        if (!formData.sku.trim()) {
            newErrors.sku = 'SKU is required'
        }

        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required'
        }

        if (formData.stock < 0) {
            newErrors.stock = 'Stock cannot be negative'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            await createProductMutation.mutateAsync({
                sku: formData.sku.trim(),
                name: formData.name.trim(),
                stock: Number.isFinite(formData.stock) ? formData.stock : 0,

            })

            toast({
                title: 'Success',
                description: 'Product created successfully'
            })

            router.push('/products')
        } catch (error:any) {
            toast({
                title: 'Error',
                description: error.response?.data?.error || 'Failed to create product',
                variant: 'destructive'
            })
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="sku">SKU *</Label>
                        <Input
                            id="sku"
                            type="text"
                            placeholder="e.g. ADI-001"
                            value={formData.sku}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            className={errors.sku ? 'border-red-500' : ''}
                        />
                        {errors.sku && (
                            <p className="text-sm text-red-500">{errors.sku}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name *</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="e.g. Running Shoes"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="stock">Initial Stock</Label>
                        <Input
                            id="stock"
                            type="number"
                            min="0"
                            placeholder="0"
                            value={formData.stock}
                            onChange={(e) => {
                                const value = e.target.value
                                // allow empty field to avoid forcing 0 while typing
                                setFormData({ ...formData, stock: value === '' ? 0 : Number(value) })
                            }}                            className={errors.stock ? 'border-red-500' : ''}
                        />
                        {errors.stock && (
                            <p className="text-sm text-red-500">{errors.stock}</p>
                        )}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={createProductMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={createProductMutation.isPending}
                        >
                            {createProductMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Product'
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}