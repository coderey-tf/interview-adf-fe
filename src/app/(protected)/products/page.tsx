'use client'

import { useState, useEffect } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { useInbound, useOutbound } from '@/hooks/useTransaction'
import { ProductTable } from '@/components/products/product-table'
import { TransactionDialog } from '@/components/products/transaction-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Package, PackageOpen } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useDebounce } from '@/hooks/use-debounce'

export default function ProductsPage() {
    const [search, setSearch] = useState('')
    const [transactionDialog, setTransactionDialog] = useState({ open: false, type: null, product: null })
    const debouncedSearch = useDebounce(search, 300)
    const router = useRouter()
    const { toast } = useToast()

    const { data: products = [], isLoading } = useProducts(debouncedSearch)
    const inboundMutation = useInbound()
    const outboundMutation = useOutbound()

    const handleTransaction = async (data) => {
        try {
            if (transactionDialog.type === 'inbound') {
                await inboundMutation.mutateAsync({
                    productId: transactionDialog.product.id,
                    quantity: data.quantity,
                    notes: data.notes
                })
                toast({
                    title: 'Success',
                    description: 'Inbound transaction completed successfully'
                })
            } else {
                await outboundMutation.mutateAsync({
                    productId: transactionDialog.product.id,
                    quantity: data.quantity,
                    notes: data.notes
                })
                toast({
                    title: 'Success',
                    description: 'Outbound transaction completed successfully'
                })
            }
            setTransactionDialog({ open: false, type: null, product: null })
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.error || 'Transaction failed',
                variant: 'destructive'
            })
        }
    }

    return (
        <div className="space-y-6 p-12">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Products Management</h1>
                <Button onClick={() => router.push('/products/new')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                </Button>
            </div>

            <div className="flex gap-4 items-center">
                <div className="flex-1">
                    <Input
                        placeholder="Search products by SKU or name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-md"
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            if (products.length > 0) {
                                setTransactionDialog({
                                    open: true,
                                    type: 'inbound',
                                    product: null,
                                    selectProduct: true
                                })
                            }
                        }}
                    >
                        <Package className="mr-2 h-4 w-4" />
                        Quick Inbound
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                            if (products.length > 0) {
                                setTransactionDialog({
                                    open: true,
                                    type: 'outbound',
                                    product: null,
                                    selectProduct: true
                                })
                            }
                        }}
                    >
                        <PackageOpen className="mr-2 h-4 w-4" />
                        Quick Outbound
                    </Button>
                </div>
            </div>

            <ProductTable
                products={products}
                isLoading={isLoading}
                onInbound={(product) => setTransactionDialog({ open: true, type: 'inbound', product })}
                onOutbound={(product) => setTransactionDialog({ open: true, type: 'outbound', product })}
            />

            <TransactionDialog
                open={transactionDialog.open}
                onClose={() => setTransactionDialog({ open: false, type: null, product: null })}
                type={transactionDialog.type}
                product={transactionDialog.product}
                products={transactionDialog.selectProduct ? products : null}
                onSubmit={handleTransaction}
                isLoading={inboundMutation.isPending || outboundMutation.isPending}
            />
        </div>
    )
}