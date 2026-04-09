import { Paper, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { mockMonthlyMargins } from '../../data/mockBillingEngine';

const COLORS = {
  buyingCost: '#6366f1',
  sellingRevenue: '#22c55e',
  netWin: '#a78bfa',
  marginLine: '#f59e0b',
};

const euroKLabel = (value: unknown): string => {
  const v = typeof value === 'number' ? value : 0;
  if (v === 0) return '€0k';
  return `€${(v / 1000).toFixed(1)}k`;
};

const pctLabel = (value: unknown): string => `${value ?? 0}%`;

const MonthlyMarginChart = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid #e8ebf0',
        borderRadius: 3,
        bgcolor: '#fff',
        p: 3,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Monthly Margin
      </Typography>

      <Box sx={{ width: '100%', minWidth: 0 }}>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart
            data={mockMonthlyMargins}
            margin={{ top: 20, right: 20, bottom: 5, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e8ebf0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e8ebf0' }}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tickFormatter={(v: number) => `€${v / 1000}k`}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              domain={[0, 18000]}
              ticks={[0, 3000, 6000, 9000, 12000, 15000, 18000]}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(v: number) => `${v}%`}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              domain={[0, 30]}
              ticks={[0, 5, 10, 15, 20, 25, 30]}
            />
            <Legend
              verticalAlign="bottom"
              iconType="square"
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            />
            <Bar
              yAxisId="left"
              dataKey="buyingCost"
              name="Buying Cost"
              fill={COLORS.buyingCost}
              radius={[3, 3, 0, 0]}
              barSize={18}
            >
              <LabelList
                dataKey="buyingCost"
                position="top"
                formatter={euroKLabel}
                style={{ fontSize: 9, fill: COLORS.buyingCost, fontWeight: 600 }}
              />
            </Bar>
            <Bar
              yAxisId="left"
              dataKey="sellingRevenue"
              name="Selling Revenue"
              fill={COLORS.sellingRevenue}
              radius={[3, 3, 0, 0]}
              barSize={18}
            >
              <LabelList
                dataKey="sellingRevenue"
                position="top"
                formatter={euroKLabel}
                style={{ fontSize: 9, fill: COLORS.sellingRevenue, fontWeight: 600 }}
              />
            </Bar>
            <Bar
              yAxisId="left"
              dataKey="netWin"
              name="Net Win"
              fill={COLORS.netWin}
              radius={[3, 3, 0, 0]}
              barSize={12}
            >
              <LabelList
                dataKey="netWin"
                position="top"
                formatter={euroKLabel}
                style={{ fontSize: 9, fill: COLORS.netWin, fontWeight: 600 }}
              />
            </Bar>
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="marginPct"
              name="Margin %"
              stroke={COLORS.marginLine}
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={{ r: 4, fill: COLORS.marginLine, stroke: '#fff', strokeWidth: 2 }}
            >
              <LabelList
                dataKey="marginPct"
                position="top"
                formatter={pctLabel}
                style={{ fontSize: 10, fill: COLORS.marginLine, fontWeight: 600 }}
              />
            </Line>
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default MonthlyMarginChart;
