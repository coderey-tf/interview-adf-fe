'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Package, PackageOpen, Calendar } from 'lucide-react'
import { format } from 'date-fns'

export function ProductTable({ products, isLoading, onInbound, onOutbound }) {
    if (isLoading) {
        return (
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>SKU</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }

    if (products.length === 0) {
        return (
            <div className="border rounded-lg p-8 text-center">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No products</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new product.
                </p>
            </div>
        )
    }

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-mono text-sm">
                                {product.sku}
                            </TableCell>
                            <TableCell className="font-medium">
                                {product.name}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={product.stock > 10 ? 'default' : product.stock > 0 ? 'secondary' : 'destructive'}
                                >
                                    {product.stock} units
                                </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                <div className="flex items-center">
                                    <Calendar className="mr-1 h-3 w-3" />
                                    {format(new Date(product.created_at), 'MMM d, yyyy')}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onInbound(product)}
                                    >
                                        <Package className="mr-1 h-3 w-3" />
                                        Inbound
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onOutbound(product)}
                                        disabled={product.stock === 0}
                                    >
                                        <PackageOpen className="mr-1 h-3 w-3" />
                                        Outbound
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}