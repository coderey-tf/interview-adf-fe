// Laravel backend configuration
export const config = {
    // Laravel backend URL - change this to match your Laravel development server
    apiUrl: process.env.NEXT_PUBLIC_LARAVEL_URL || 'http://localhost:8000',

    // API endpoints
    endpoints: {
        // Authentication
        csrf: '/sanctum/csrf-cookie',
        login: '/login',
        register: '/register',
        logout: '/logout',
        user: '/api/user',

        // Products
        products: '/api/products',

        // Transactions
        transactions: '/api/transactions',
        inbound: '/api/transactions/inbound',
        outbound: '/api/transactions/outbound'
    }
}

export default config