import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
// Transactions API
export const useTransactions = () => {
    return useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const { data } = await api.get('/api/transactions')
            return data
        }
    })
}

export const useInbound = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (transactionData) => {
            const { data } = await api.post('/api/transactions/inbound', transactionData)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
        }
    })
}

export const useOutbound = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (transactionData) => {
            const { data } = await api.post('/api/transactions/outbound', transactionData)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
        }
    })
}