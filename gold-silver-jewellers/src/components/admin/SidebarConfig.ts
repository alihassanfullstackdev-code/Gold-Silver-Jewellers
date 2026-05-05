import { 
    LayoutDashboard, 
    TrendingUp, 
    Layers, 
    Gem, 
    ShoppingCart, 
    MessageSquare 
} from 'lucide-react';

export const sidebarLinks = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Metal Rates', icon: TrendingUp, path: '/admin/rates' },
    { label: 'Categories', icon: Layers, path: '/admin/categories' },
    { label: 'Products', icon: Gem, path: '/admin/products' }, 
    { label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
    { label: 'Customer Inquiries', icon: MessageSquare, path: '/admin/inquiries' },
];