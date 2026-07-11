import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// ডামি লিডারবোর্ড ডেটা (গ্রুপের বন্ধুদের সাথে তুলনা)
const groupLeaderboardData = [
  { name: 'Faravi (Admin)', avgScore: 132, highest: 145 },
  { name: 'Sajjad', avgScore: 124, highest: 138 },
  { name: 'Nafis', avgScore: 118, highest: 129 },
  { name: 'Tanvir', avgScore: 110, highest: 122 },
  { name: 'Rakib', avgScore: 105, highest: 115 },
];

const PersonalChart = ({ myHistory }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      
      {/* 📈 ব্যক্তিগত অগ্রগতির গ্রাফ (Line Chart) */}
      <div className="card bg-base-100 shadow-lg border border-base-300 p-4">
        <h3 className="font-bold text-lg text-primary mb-4 flex items-center gap-2">
          <span>📈 আপনার ধারাবাহিক অগ্রগতি (Personal Growth)</span>
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={myHistory}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="examName" stroke="#8884d8" fontSize={12} />
              <YAxis domain={[0, 200]} fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1d232a', color: '#fff', borderRadius: '8px' }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="obtained" 
                name="প্রাপ্ত নম্বর (Obtained)" 
                stroke="#570df8" 
                strokeWidth={3}
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="attempted" 
                name="উত্তর করেছেন (Attempted)" 
                stroke="#f3cc30" 
                strokeWidth={2} 
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🏆 গ্রুপ লিডারবোর্ড তুলনা (Bar Chart) */}
      <div className="card bg-base-100 shadow-lg border border-base-300 p-4">
        <h3 className="font-bold text-lg text-secondary mb-4 flex items-center gap-2">
          <span>🏆 গ্রুপ লিডারবোর্ড (বন্ধুদের সাথে তুলনা)</span>
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={groupLeaderboardData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis domain={[0, 200]} fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1d232a', color: '#fff', borderRadius: '8px' }} 
              />
              <Legend />
              <Bar dataKey="highest" name="সর্বোচ্চ নম্বর" fill="#f87272" radius={[4, 4, 0, 0]} />
              <Bar dataKey="avgScore" name="গড় নম্বর (Average)" fill="#36d399" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default PersonalChart;