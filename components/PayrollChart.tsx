
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PAYROLL_HISTORY_DATA } from '../constants';
import { PayrollHistoryData } from '../types';

interface PayrollChartProps {
    data: PayrollHistoryData[];
}

const PayrollChart: React.FC<PayrollChartProps> = ({ data }) => {
  const formatCurrency = (value: number) => `DOP ${new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value)}`;
  
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={formatCurrency} tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'DOP' }).format(value)}
            contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(4px)',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb',
            }}
          />
          <Legend wrapperStyle={{fontSize: "14px"}} />
          <Area type="monotone" dataKey="totalCost" name="Costo Total" stackId="1" stroke="#0A2540" fill="#0A2540" fillOpacity={0.8} />
          <Area type="monotone" dataKey="taxes" name="Impuestos" stackId="1" stroke="#F39C12" fill="#F39C12" fillOpacity={0.7} />
          <Area type="monotone" dataKey="baseSalary" name="Salario Base" stackId="1" stroke="#2ECC71" fill="#2ECC71" fillOpacity={0.6}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// We need to make Recharts available to the component.
// In a real project, this would be handled by a bundler.
// We are adding it to the window scope for this sandbox environment.
const script = document.createElement('script');
script.src = "https://unpkg.com/recharts/umd/Recharts.min.js";
script.async = true;
script.onload = () => {
    // Re-render components that use recharts once it's loaded if necessary
    window.dispatchEvent(new Event('rechartsLoaded'));
};
document.body.appendChild(script);

export default PayrollChart;