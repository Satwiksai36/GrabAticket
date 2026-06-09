import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    CartesianGrid,
    Line
} from 'recharts';
import {
    TrendingUp,
    Utensils,
    ShoppingBag,
    DollarSign,
    ChefHat,
    Loader2
} from 'lucide-react';
import { useFoodAnalytics } from '@/hooks/useFoodAnalytics';

const COLORS = ['#E11D48', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

const AdminFoodAnalytics: React.FC = () => {
    const { data, isLoading } = useFoodAnalytics();

    const categoryData = useMemo(() => {
        if (!data) return [];
        return data.categoryDistribution.map((item, index) => ({
            ...item,
            color: COLORS[index % COLORS.length]
        }));
    }, [data]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!data) return <div>No data available</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent flex items-center gap-2">
                        <Utensils className="h-6 w-6 text-orange-500" />
                        Food & Beverages Insights
                    </h2>
                    <p className="text-sm text-muted-foreground">Real-time performance metrics</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Food Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{data.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground text-green-500 flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +12% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Item</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold truncate">{data.popularItems[0]?.name || 'N/A'}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {data.popularItems[0]?.count || 0} units sold
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Orders Processing</CardTitle>
                        <ChefHat className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.ordersByStatus.find(s => s.status === 'Preparing')?.count || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 text-blue-500">
                            Active in Kitchen
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹350</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Estimated
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

                {/* Popular Items Chart */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Top Selling Items</CardTitle>
                        <CardDescription>Most popular food items by quantity sold</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.popularItems} layout="vertical" margin={{ left: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="count" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Sales by Category</CardTitle>
                        <CardDescription>Revenue split across categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap gap-2 justify-center mt-2">
                            {categoryData.map((item) => (
                                <div key={item.name} className="flex items-center gap-1 text-xs">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-muted-foreground">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminFoodAnalytics;
