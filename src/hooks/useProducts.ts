import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import {NewProduct, Product} from "@/lib/models/product";
// Products API
export const useProducts = (search = '') => {
    return useQuery({
        queryKey: ['products', search],
        queryFn: async () => {
            const { data } = await api.get(`/api/products${search ? `?search=${search}` : ''}`)
            return data
        }
    })
}

export const useProduct = (id:number) => {
    return useQuery({
        queryKey: ['products', id],
        queryFn: async () => {
            const { data } = await api.get(`/api/products/${id}`)
            return data
        },
        enabled: !!id
    })
}

export const useCreateProduct = () => {
    const queryClient = useQueryClient()

    return useMutation<Product, Error, NewProduct>({
        mutationFn: async (productData) => {
            const { data } = await api.post('/api/products', productData)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        }
    })
}

export const useUpdateProduct = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...productData }) => {
            const { data } = await api.put(`/api/products/${id}`, productData)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        }
    })
}

export const useDeleteProduct = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id) => {
            await api.delete(`/api/products/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        }
    })
}