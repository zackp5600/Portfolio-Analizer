"use client";

import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const fallbackPortfolio = {
  owner: "Alex Morgan",
  totalValue: 128640.42,
  dailyChange: 1248.73,
  dailyChangePercent: 0.98,
  returns: 18.4,
  dividendYield: 1.84,
  riskScore: "Moderate",
  chart: [
    { month: "Oct", value: 102400 }, { month: "Nov", value: 106800 }, { month: "Dec", value: 105100 },
    { month: "Jan", value: 111400 }, { month: "Feb", value: 115600 }, { month: "Mar", value: 119300 },
    { month: "Apr", value: 117900 }, { month: "May", value: 122500 }, { month: "Jun", value: 126100 }, { month: "Now", value: 128640 }
  ],
  allocation: [
    { name: "Technology", value: 38, color: "#6D5DFB" }, { name: "ETFs", value: 26, color: "#33C58D" },
    { name: "Financials", value: 16, color: "#F0B34D" }, { name: "Healthcare", value: 12, color: "#F27E7E" }, { name: "Cash", value: 8, color: "#9AA4B2" }
  ],
  holdings: [
    { symbol: "AAPL", name: "Apple Inc.", shares: 82, price: 227.16, change: 1.21, allocation: 14.5 },
    { symbol: "VOO", name: "Vanguard S&P 500 ETF", shares: 74, price: 522.49, change: 0.72, allocation: 30.1 },
    { symbol: "MSFT", name: "Microsoft Corp.", shares: 54, price: 448.98, change: 1.48, allocation: 18.8 },
    { symbol: "JPM", name: "JPMorgan Chase & Co.", shares: 65, price: 202.14, change: -0.34, allocation: 10.2 }
  ]
};

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function Metric({ label, value, detail, positive }) {
  return <article className="metric-card"><p>{label}</p><strong>{value}</strong><span className={positive === false ? "negative" : positive ? "positive" : ""}>{detail}</span></article>;
}

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState(fallbackPortfolio);
  const [activeTab, setActiveTab] = useState("Overview");
  const [range, setRange] = useState("1Y");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/portfolio`)
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then(setPortfolio)
      .catch(() => {});
  }, []);

  const invested = useMemo(() => portfolio.holdings.reduce((sum, holding) => sum + holding.shares * holding.price, 0), [portfolio]);

  return <main className="shell">
    <aside className="sidebar">
      <div className="brand"><i>✦</i><span>northstar</span></div>
      <nav>{["Overview", "Holdings", "Activity", "Insights"].map(item => <button key={item} onClick={() => setActiveTab(item)} className={activeTab === item ? "active" : ""}><b>{item === "Overview" ? "⌂" : item === "Holdings" ? "◈" : item === "Activity" ? "↗" : "◌"}</b>{item}</button>)}</nav>
      <div className="sidebar-bottom"><div className="avatar">AM</div><div><strong>{portfolio.owner}</strong><small>Individual account</small></div><span>⌄</span></div>
    </aside>

    <section className="content">
      <header><div><p className="eyebrow">WELCOME BACK</p><h1>Good morning, {portfolio.owner.split(" ")[0]}.</h1><p className="subhead">Here’s how your money is working for you.</p></div><button className="add-button">＋ Add transaction</button></header>
      <div className="tabs"><button className="selected">{activeTab}</button><span>Updated just now <i /></span></div>
      <section className="metrics">
        <Metric label="Portfolio value" value={money.format(portfolio.totalValue)} detail={`↑ ${money.format(portfolio.dailyChange)} today`} positive />
        <Metric label="Total return" value={`+${portfolio.returns}%`} detail="Since inception" positive />
        <Metric label="Dividend yield" value={`${portfolio.dividendYield}%`} detail="Est. $2,367 / year" />
        <Metric label="Risk profile" value={portfolio.riskScore} detail="Well balanced" />
      </section>
      <section className="grid-main">
        <article className="panel performance"><div className="panel-title"><div><h2>Portfolio performance</h2><p>{money.format(portfolio.totalValue)} <span className="positive">+{portfolio.dailyChangePercent}%</span></p></div><div className="range-picker">{["1M", "3M", "6M", "1Y", "ALL"].map(item => <button onClick={() => setRange(item)} className={range === item ? "range-active" : ""} key={item}>{item}</button>)}</div></div>
          <div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={portfolio.chart}><defs><linearGradient id="portfolioFill" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#6d5dfb" stopOpacity={.28}/><stop offset="95%" stopColor="#6d5dfb" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#87909e", fontSize: 12 }} dy={12}/><YAxis hide domain={[95000, 135000]}/><Tooltip formatter={(value) => money.format(value)} contentStyle={{ borderRadius: 10, border: "1px solid #e7e8ed" }}/><Area type="monotone" dataKey="value" stroke="#6d5dfb" strokeWidth={3} fill="url(#portfolioFill)"/></AreaChart></ResponsiveContainer></div>
        </article>
        <article className="panel allocation"><div className="panel-title"><div><h2>Asset allocation</h2><p>By sector</p></div><button className="dots">•••</button></div><div className="allocation-body"><div className="donut"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={portfolio.allocation} dataKey="value" innerRadius={52} outerRadius={73} paddingAngle={3} stroke="none">{portfolio.allocation.map(slice => <Cell key={slice.name} fill={slice.color}/>)}</Pie></PieChart></ResponsiveContainer><div><strong>100%</strong><span>Invested</span></div></div><div className="legend">{portfolio.allocation.slice(0, 4).map(item => <p key={item.name}><i style={{ background: item.color }}/>{item.name}<b>{item.value}%</b></p>)}</div></div></article>
      </section>
      <article className="panel holdings"><div className="panel-title"><div><h2>Top holdings</h2><p>{money.format(invested)} across {portfolio.holdings.length} positions</p></div><button className="view-all">View all holdings →</button></div><div className="holding-head"><span>ASSET</span><span>SHARES</span><span>PRICE</span><span>DAY</span><span>ALLOCATION</span></div>{portfolio.holdings.map((holding, index) => <div className="holding" key={holding.symbol}><div className="asset"><em className={`logo logo-${index}`}>{holding.symbol.slice(0, 1)}</em><div><strong>{holding.symbol}</strong><span>{holding.name}</span></div></div><span>{holding.shares}</span><span>{money.format(holding.price)}</span><span className={holding.change < 0 ? "negative" : "positive"}>{holding.change > 0 ? "+" : ""}{holding.change}%</span><span>{holding.allocation}%</span></div>)}</article>
    </section>
  </main>;
}
