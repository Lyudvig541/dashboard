import {
    ResponsiveContainer,
    AreaChart,
    XAxis,
    YAxis,
    Area,
    Tooltip,
    CartesianGrid,
} from "recharts";
import {format, parseISO} from "date-fns";
import {useEffect, useState} from "react";

function Chart({
                   chartColor,
                   action,
                   startDate = new Date().getTime() - 604800000,
                   endDate = new Date().getTime(),
               }) {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        action(startDate, endDate).then(data => setChartData(data));
    }, [startDate, endDate]);
    const formatter = (str) => {
        const date = parseISO(str);
        if (date.getDate() % 1 === 0) {
            return format(date, "dd.M");
        }
        return "";
    }
    return (
        <ResponsiveContainer width="100%" height='100%'>
            <AreaChart data={chartData} type="monotone" dataKey="pv" color={chartColor} stroke={chartColor}
                       strokeWidth={3}>
                <defs>
                    <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={chartColor} stopOpacity={0.5}/>
                        <stop offset="90%" stopColor={chartColor} stopOpacity={0.01}/>
                    </linearGradient>
                </defs>
                <Area dataKey="value" stroke={chartColor} fill={chartColor} type="monotone"/>
                <XAxis
                    dataKey="date"
                    axisLine={true}
                    tickLine={true}
                    tickFormatter={(str)=>formatter(str)}
                />

                <YAxis
                    datakey="value"
                    axisLine={true}
                    tickLine={true}
                    tickFormatter={(number) => `${number.toFixed(0)}`}
                />
                <Tooltip content={<CustomTooltip/>}/>
                <CartesianGrid strokeDasharray="3 3" opacity={0} vertical={false}/>
            </AreaChart>
        </ResponsiveContainer>
    );
}

function CustomTooltip({active, payload}) {
    if (active) {
        return (
            <div style={{
                color: "#ffffff",
                backgroundColor: "#181C2D",
                padding: "8px",
                borderRadius: "12px",
                border: "1px solid rgba(85, 142, 254, 0.3)"
            }}>
                <p>{payload && payload[0] && payload[0].value.toFixed(2)}</p>
            </div>
        );
    }
    return null;
}

export default Chart;