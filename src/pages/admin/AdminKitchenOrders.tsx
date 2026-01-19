import React from 'react';
import KitchenDashboard from '@/pages/KitchenDashboard';

const AdminKitchenOrders: React.FC = () => {
    return (
        <div className="h-full w-full">
            {/* We render the KitchenDashboard directly. 
                Since KitchenDashboard has its own specific dark UI tailored for KDS screens,
                we allow it to take over the content area. 
             */}
            <KitchenDashboard />
        </div>
    );
};

export default AdminKitchenOrders;
