import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useForm } from "react-hook-form";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminProfile = () => {
    const { register, handleSubmit, reset } = useForm();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: stats = {} } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin-stats');
            return res.data;
        }
    });

    const onSubmit = async (data) => {
        const tag = { name: data.tag };
        const result = await axiosSecure.post('/tags', tag);
        console.log(result.data);
        toast.success('Tag added successfully');
        reset();
    };

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const data = [
        { name: 'Posts', value: stats.posts || 0 },
        { name: 'Comments', value: stats.comments || 0 },
        { name: 'Users', value: stats.users || 0 },
    ];

    return (
        <div>
            <Helmet>  
                <title>Topic Talk | Admin Profile</title>
            </Helmet>
            <div className="max-w-7xl mx-auto p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-center mb-8">
                    <img src={user.photoURL} alt="Admin" className="rounded-full w-24 h-24 md:w-36 md:h-36 mr-0 md:mr-6 mb-4 md:mb-0" />
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl md:text-3xl font-semibold text-gray-700">{user.displayName}</h3>
                        <p className="text-lg text-gray-600">Email: {user.email}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                    <div className="bg-violet-100 shadow-md rounded-lg p-4 md:p-6 text-center">
                        <div className="text-3xl md:text-4xl font-bold text-gray-700">{stats.posts}</div>
                        <div className="text-base md:text-lg text-gray-500">Posts</div>
                    </div>
                    <div className="bg-violet-100 shadow-md rounded-lg p-4 md:p-6 text-center">
                        <div className="text-3xl md:text-4xl font-bold text-gray-700">{stats.comments}</div>
                        <div className="text-base md:text-lg text-gray-500">Comments</div>
                    </div>
                    <div className="bg-violet-100 shadow-md rounded-lg p-4 md:p-6 text-center">
                        <div className="text-3xl md:text-4xl font-bold text-gray-700">{stats.users}</div>
                        <div className="text-base md:text-lg text-gray-500">Users</div>
                    </div>
                </div>
                <div className="flex justify-center items-center mb-4">
                    <div className="w-full h-64 md:w-1/2 md:h-96">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={110}
                                    md:outerRadius={150}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div>
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Add Tags</h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                        <input {...register('tag')} type="text" placeholder="Enter new tag" className="p-2 mb-4 border border-gray-300 rounded" />
                        <button type="submit" className="p-2 bg-violet-500 text-white rounded hover:bg-violet-400">Add Tag</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
