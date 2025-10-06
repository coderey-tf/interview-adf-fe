'use client'

import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Package, PackageOpen } from 'lucide-react'

export function TransactionDialog({
                                      open,
                                      onClose,
                                      type,
                                      product,
                                      products = null,
                                      onSubmit,
                                      isLoading
                                  }) {
    const [formData, setFormData] = useState({
        productId: '',
        quantity: '',
        notes: ''
    })
    const [error, setError] = useState('')
    const [selectedProduct, setSelectedProduct] = useState(null)

    useEffect(() => {
        if (product) {
            setFormData({
                productId: product.id,
                quantity: '',
                notes: ''
            })
            setSelectedProduct(product)
        } else if (products && open) {
            setFormData({
                productId: '',
                quantity: '',
                notes: ''
            })
            setSelectedProduct(null)
        }
        setError('')
    }, [product, products, open])

    const handleProductChange = (productId) => {
        const selected = products?.find(p => p.id === productId)
        setSelectedProduct(selected)
        setFormData({ ...formData, productId })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')

        if (!formData.productId) {
            setError('Please select a product')
            return
        }

        const quantity = parseInt(formData.quantity)
        if (!quantity || quantity <= 0) {
            setError('Please enter a valid quantity')
            return
        }

        if (type === 'outbound' && selectedProduct && quantity > selectedProduct.stock) {
            setError(`Insufficient stock. Available: ${selectedProduct.stock} units`)
            return
        }

        onSubmit({
            productId: formData.productId,
            quantity,
            notes: formData.notes
        })
    }

    const icon = type === 'inbound' ? Package : PackageOpen
    const title = type === 'inbound' ? 'Inbound Transaction' : 'Outbound Transaction'
    const description = type === 'inbound'
        ? 'Add stock to inventory'
        : 'Remove stock from inventory'

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        {type === 'inbound' ? <Package className="mr-2 h-5 w-5" /> : <PackageOpen className="mr-2 h-5 w-5" />}
                        {title}
                    </DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {products ? (
                        <div className="space-y-2">
                            <Label>Select Product</Label>
                            <Select value={formData.productId} onValueChange={handleProductChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a product" />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map((p) => (
                                        <SelectItem key={p.id} value={p.id}>
                                            <div className="flex justify-between w-full">
                                                <span>{p.sku} - {p.name}</span>
                                                <span className="text-muted-foreground ml-2">Stock: {p.stock}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label>Product</Label>
                            <Input
                                value={product ? `${product.sku} - ${product.name}` : ''}
                                disabled
                                className="bg-muted"
                            />
                        </div>
                    )}

                    {selectedProduct && (
                        <div className="text-sm text-muted-foreground">
                            Current stock: <span className="font-medium">{selectedProduct.stock} units</span>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                            id="quantity"
                            type="number"
                            min="1"
                            placeholder="Enter quantity"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            placeholder="Add notes about this transaction..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="min-h-[80px]"
                        />
                    </div>

                    <DialogFooter className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                `${type === 'inbound' ? 'Add' : 'Remove'} Stock`
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}