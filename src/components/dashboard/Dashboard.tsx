"use client";

import React, { useState, useCallback, useRef, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  BarChart3,
  FileSpreadsheet,
  MessageSquare,
  Settings,
  Table2,
  Search,
  ChevronDown,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Share2,
  LayoutDashboard,
  Database,
  Layers,
  Eye,
  GripVertical,
  X,
  Check,
  RefreshCw,
  FileUp,
  Image,
  FileText,
  Move,
  MousePointer,
  AlertCircle,
  Loader2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  Cell,
  PieChart,
  Pie,
  Area,
  Legend,
  ComposedChart,
  Brush,
  ReferenceLine
} from 'recharts';

// Full Dataset - Insurance Industry (Default demo data)
const defaultData = {
  monthly: [
    { month: 'Jan', premium: 420000, claims: 280000, policies: 1200, region: 'Dubai', product: 'Comprehensive' },
    { month: 'Feb', premium: 380000, claims: 220000, policies: 980, region: 'Dubai', product: 'Third Party' },
    { month: 'Mar', premium: 520000, claims: 310000, policies: 1450, region: 'Abu Dhabi', product: 'Comprehensive' },
    { month: 'Apr', premium: 490000, claims: 290000, policies: 1380, region: 'Abu Dhabi', product: 'Agency Repair' },
    { month: 'May', premium: 580000, claims: 350000, policies: 1620, region: 'Sharjah', product: 'Comprehensive' },
    { month: 'Jun', premium: 610000, claims: 380000, policies: 1750, region: 'Dubai', product: 'Third Party' },
    { month: 'Jul', premium: 550000, claims: 320000, policies: 1500, region: 'Dubai', product: 'Comprehensive' },
    { month: 'Aug', premium: 480000, claims: 290000, policies: 1320, region: 'Sharjah', product: 'Agency Repair' },
    { month: 'Sep', premium: 620000, claims: 400000, policies: 1800, region: 'Abu Dhabi', product: 'Comprehensive' },
    { month: 'Oct', premium: 700000, claims: 420000, policies: 1950, region: 'Dubai', product: 'Third Party' },
    { month: 'Nov', premium: 680000, claims: 390000, policies: 1850, region: 'Dubai', product: 'Comprehensive' },
    { month: 'Dec', premium: 750000, claims: 450000, policies: 2100, region: 'Abu Dhabi', product: 'Comprehensive' },
  ],
  dealers: [
    { name: 'Al Futtaim Motors', premium: 850000, claims: 420000, policies: 2400, lossRatio: 49.4, region: 'Dubai', product: 'Comprehensive' },
    { name: 'Juma Al Majid', premium: 720000, claims: 380000, policies: 1980, lossRatio: 52.8, region: 'Dubai', product: 'Third Party' },
    { name: 'Trading Enterprises', premium: 680000, claims: 290000, policies: 1850, lossRatio: 42.6, region: 'Abu Dhabi', product: 'Comprehensive' },
    { name: 'Al Nabooda Auto', premium: 590000, claims: 350000, policies: 1620, lossRatio: 59.3, region: 'Sharjah', product: 'Agency Repair' },
    { name: 'Al Rostamani', premium: 540000, claims: 280000, policies: 1480, lossRatio: 51.9, region: 'Dubai', product: 'Comprehensive' },
    { name: 'Gargash Enterprises', premium: 480000, claims: 310000, policies: 1320, lossRatio: 64.6, region: 'Abu Dhabi', product: 'Third Party' },
    { name: 'Emirates Motor', premium: 420000, claims: 240000, policies: 1150, lossRatio: 57.1, region: 'Sharjah', product: 'Comprehensive' },
    { name: 'Al Tayer Motors', premium: 780000, claims: 390000, policies: 2200, lossRatio: 50.0, region: 'Dubai', product: 'Agency Repair' },
  ],
  claimTypes: [
    { name: 'Collision', value: 45, amount: 1800000, color: '#3b82f6' },
    { name: 'Theft', value: 18, amount: 720000, color: '#8b5cf6' },
    { name: 'Total Loss', value: 12, amount: 480000, color: '#ef4444' },
    { name: 'Windscreen', value: 15, amount: 600000, color: '#10b981' },
    { name: 'Third Party', value: 10, amount: 400000, color: '#f59e0b' },
  ],
  products: [
    { product: 'Comprehensive', count: 4500, premium: 2100000, claims: 1200000 },
    { product: 'Third Party', count: 3200, premium: 640000, claims: 380000 },
    { product: 'Agency Repair', count: 2800, premium: 1680000, claims: 920000 },
    { product: 'Extended Warranty', count: 1500, premium: 450000, claims: 180000 },
  ],
  regions: [
    { region: 'Dubai', premium: 3200000, claims: 1800000, policies: 8500, dealers: 12 },
    { region: 'Abu Dhabi', premium: 2100000, claims: 1200000, policies: 5600, dealers: 8 },
    { region: 'Sharjah', premium: 980000, claims: 580000, policies: 2800, dealers: 5 },
    { region: 'Ajman', premium: 320000, claims: 180000, policies: 900, dealers: 2 },
    { region: 'RAK', premium: 180000, claims: 95000, policies: 480, dealers: 1 },
  ],
};

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string; dataKey: string }>; label?: string }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl p-3 min-w-[180px]">
      <p className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2 mb-2">{label}</p>
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center justify-between gap-4 py-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs text-gray-600">{entry.name}</span>
          </div>
          <span className="text-xs font-bold text-gray-900">
            {entry.dataKey === 'policies' ? entry.value.toLocaleString() : `$${(entry.value / 1000).toFixed(0)}k`}
          </span>
        </div>
      ))}
    </div>
  );
};

// Widget order
const initialWidgetOrder = [
  'kpi-premium', 'kpi-loss', 'kpi-claims', 'kpi-policies',
  'chart-trend', 'chart-pie',
  'chart-region', 'chart-products',
  'table-dealers'
];

// Uploaded file type
interface UploadedFile {
  name: string;
  data: Record<string, unknown>[];
  columns: string[];
}

export default function ClarityDashboard() {
  const [activeView, setActiveView] = useState('Report');
  const [showFilters, setShowFilters] = useState(true);
  const [showFieldPane, setShowFieldPane] = useState(true);
  const [fullData, setFullData] = useState(defaultData);

  // Interactive Filters
  const [activeFilters, setActiveFilters] = useState({
    dateRange: 'All Time',
    region: 'All Regions',
    dealer: 'All Dealers',
    product: 'All Products',
  });

  const [widgetOrder, setWidgetOrder] = useState(initialWidgetOrder);
  const [isEditing, setIsEditing] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: "Welcome! Upload Excel/CSV files or use the demo data. Click filters on the left to update charts instantly." }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState<string | null>(null);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get unique values for filters from data
  const filterOptions = useMemo(() => {
    const regions = new Set<string>(['All Regions']);
    const dealers = new Set<string>(['All Dealers']);
    const products = new Set<string>(['All Products']);

    fullData.monthly.forEach(d => {
      if (d.region) regions.add(d.region);
      if (d.product) products.add(d.product);
    });
    fullData.dealers.forEach(d => {
      if (d.name) dealers.add(d.name);
      if (d.region) regions.add(d.region);
      if (d.product) products.add(d.product);
    });

    return {
      dateRange: ['All Time', 'Last 30 Days', 'Last 3 Months', 'Last 6 Months', 'Last Year'],
      region: Array.from(regions),
      dealer: Array.from(dealers),
      product: Array.from(products),
    };
  }, [fullData]);

  // Apply filters to data
  const filteredData = useMemo(() => {
    let monthly = [...fullData.monthly];
    let dealers = [...fullData.dealers];
    let regions = [...fullData.regions];
    let products = [...fullData.products];

    // Region filter
    if (activeFilters.region !== 'All Regions') {
      monthly = monthly.filter(d => d.region === activeFilters.region);
      dealers = dealers.filter(d => d.region === activeFilters.region);
      regions = regions.filter(d => d.region === activeFilters.region);
    }

    // Product filter
    if (activeFilters.product !== 'All Products') {
      monthly = monthly.filter(d => d.product === activeFilters.product);
      dealers = dealers.filter(d => d.product === activeFilters.product);
      products = products.filter(d => d.product === activeFilters.product);
    }

    // Dealer filter
    if (activeFilters.dealer !== 'All Dealers') {
      dealers = dealers.filter(d => d.name === activeFilters.dealer);
    }

    // Date range filter
    if (activeFilters.dateRange !== 'All Time') {
      const monthsMap: Record<string, number> = {
        'Last 30 Days': 1,
        'Last 3 Months': 3,
        'Last 6 Months': 6,
        'Last Year': 12,
      };
      const keep = monthsMap[activeFilters.dateRange] || 12;
      monthly = monthly.slice(-keep);
    }

    return { monthly, dealers, regions, products, claimTypes: fullData.claimTypes };
  }, [activeFilters, fullData]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalPremium = filteredData.monthly.reduce((sum, d) => sum + (d.premium || 0), 0);
    const totalClaims = filteredData.monthly.reduce((sum, d) => sum + (d.claims || 0), 0);
    const totalPolicies = filteredData.monthly.reduce((sum, d) => sum + (d.policies || 0), 0);
    const lossRatio = totalPremium > 0 ? (totalClaims / totalPremium) * 100 : 0;

    return { premium: totalPremium, claims: totalClaims, policies: totalPolicies, lossRatio: lossRatio.toFixed(1) };
  }, [filteredData]);

  // Handle filter change
  const handleFilterChange = useCallback((filterType: keyof typeof activeFilters, value: string) => {
    setActiveFilters(prev => ({ ...prev, [filterType]: value }));
    setChatMessages(prev => [...prev, {
      role: 'assistant',
      content: `✅ Filter applied: ${filterType} = "${value}". Charts updated.`
    }]);
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setActiveFilters({
      dateRange: 'All Time',
      region: 'All Regions',
      dealer: 'All Dealers',
      product: 'All Products',
    });
    setSelectedElement(null);
    setChatMessages(prev => [...prev, { role: 'assistant', content: '🔄 All filters cleared.' }]);
  }, []);

  // Handle chart click for drill-down
  const handleChartClick = useCallback((data: Record<string, unknown>) => {
    if (data.region && typeof data.region === 'string') {
      handleFilterChange('region', data.region);
      setSelectedElement(data.region);
    } else if (data.product && typeof data.product === 'string') {
      handleFilterChange('product', data.product);
      setSelectedElement(data.product);
    } else if (data.name && typeof data.name === 'string') {
      const dealerNames = fullData.dealers.map(d => d.name);
      if (dealerNames.includes(data.name)) {
        handleFilterChange('dealer', data.name);
        setSelectedElement(data.name);
      }
    }
  }, [handleFilterChange, fullData.dealers]);

  // Parse uploaded Excel/CSV file
  const parseFile = useCallback(async (file: File): Promise<UploadedFile | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
          const columns = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];

          resolve({ name: file.name, data: jsonData, columns });
        } catch {
          resolve(null);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback(async (files: FileList | File[]) => {
    setIsLoading(true);
    const fileArray = Array.from(files);
    const parsed: UploadedFile[] = [];

    for (const file of fileArray) {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.csv') || file.name.endsWith('.xls')) {
        const result = await parseFile(file);
        if (result) {
          parsed.push(result);
        }
      }
    }

    if (parsed.length > 0) {
      setUploadedFiles(prev => [...prev, ...parsed]);

      // Try to auto-map data to charts
      const firstFile = parsed[0];
      if (firstFile.data.length > 0) {
        const cols = firstFile.columns.map(c => c.toLowerCase());

        // Check if it looks like monthly data
        if (cols.some(c => c.includes('month') || c.includes('date')) &&
          cols.some(c => c.includes('premium') || c.includes('amount') || c.includes('sales'))) {
          // Map to monthly structure
          const mappedMonthly = firstFile.data.map((row, idx) => ({
            month: (row['month'] || row['Month'] || row['date'] || row['Date'] || `Row ${idx + 1}`) as string,
            premium: Number(row['premium'] || row['Premium'] || row['amount'] || row['Amount'] || row['sales'] || row['Sales'] || 0),
            claims: Number(row['claims'] || row['Claims'] || row['cost'] || row['Cost'] || 0),
            policies: Number(row['policies'] || row['Policies'] || row['count'] || row['Count'] || 0),
            region: (row['region'] || row['Region'] || 'Unknown') as string,
            product: (row['product'] || row['Product'] || row['type'] || row['Type'] || 'Unknown') as string,
          }));

          setFullData(prev => ({ ...prev, monthly: mappedMonthly }));
          setChatMessages(prev => [...prev, {
            role: 'assistant',
            content: `📊 Loaded "${firstFile.name}" with ${firstFile.data.length} rows. Charts updated automatically!`
          }]);
        } else {
          setChatMessages(prev => [...prev, {
            role: 'assistant',
            content: `📁 Loaded "${firstFile.name}" (${firstFile.data.length} rows, ${firstFile.columns.length} columns). Data available for analysis.`
          }]);
        }
      }
    }

    setIsLoading(false);
    setIsDraggingFile(false);
  }, [parseFile]);

  // Handle file drop
  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);

    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  }, [handleFileUpload]);

  // Handle chat submit
  const handleChatSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const input = chatInput.toLowerCase();
    if (input.includes('dubai')) handleFilterChange('region', 'Dubai');
    else if (input.includes('abu dhabi')) handleFilterChange('region', 'Abu Dhabi');
    else if (input.includes('sharjah')) handleFilterChange('region', 'Sharjah');
    else if (input.includes('comprehensive')) handleFilterChange('product', 'Comprehensive');
    else if (input.includes('third party')) handleFilterChange('product', 'Third Party');
    else if (input.includes('clear') || input.includes('reset')) clearAllFilters();
    else {
      setChatMessages(prev => [...prev,
      { role: 'user', content: chatInput },
      { role: 'assistant', content: 'Try: "Show Dubai", "Filter Comprehensive", or "Clear filters"' }
      ]);
    }
    setChatInput('');
  }, [chatInput, handleFilterChange, clearAllFilters]);

  // Drag and drop for widgets
  const handleWidgetDragStart = (widgetId: string) => { if (isEditing) setDraggedWidget(widgetId); };
  const handleWidgetDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedWidget || draggedWidget === targetId) return;
    const currentIdx = widgetOrder.indexOf(draggedWidget);
    const targetIdx = widgetOrder.indexOf(targetId);
    if (currentIdx !== -1 && targetIdx !== -1) {
      const newOrder = [...widgetOrder];
      newOrder.splice(currentIdx, 1);
      newOrder.splice(targetIdx, 0, draggedWidget);
      setWidgetOrder(newOrder);
    }
  };
  const handleWidgetDragEnd = () => setDraggedWidget(null);

  // Export functions
  const exportToPDF = async (elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 10, 10, 280, (canvas.height * 280) / canvas.width);
    pdf.save(`clarity-${elementId}.pdf`);
    setExportMenuOpen(null);
  };

  const exportToImage = async (elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(element, { scale: 2 });
    const link = document.createElement('a');
    link.download = `clarity-${elementId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setExportMenuOpen(null);
  };

  const exportFullDashboard = async () => {
    if (!dashboardRef.current) return;
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');
    const canvas = await html2canvas(dashboardRef.current, { scale: 2 });
    const pdf = new jsPDF('l', 'mm', 'a4');
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 280, (canvas.height * 280) / canvas.width);
    pdf.save('clarity-dashboard.pdf');
  };

  const hasActiveFilters = activeFilters.dateRange !== 'All Time' || activeFilters.region !== 'All Regions' || activeFilters.dealer !== 'All Dealers' || activeFilters.product !== 'All Products';

  // Widget definitions
  const widgets: Record<string, { title: string; span: string; content: React.ReactNode }> = {
    'kpi-premium': { title: 'Total Premium', span: 'col-span-1', content: <KPIContent label="Premium" value={`$${(kpis.premium / 1000000).toFixed(2)}M`} change="+12.5%" trend="up" color="#3b82f6" /> },
    'kpi-loss': { title: 'Loss Ratio', span: 'col-span-1', content: <KPIContent label="Loss Ratio" value={`${kpis.lossRatio}%`} change="-3.2%" trend="up" color="#10b981" /> },
    'kpi-claims': { title: 'Total Claims', span: 'col-span-1', content: <KPIContent label="Claims" value={`$${(kpis.claims / 1000000).toFixed(2)}M`} change="+8.1%" trend="down" color="#ef4444" /> },
    'kpi-policies': { title: 'Policies Sold', span: 'col-span-1', content: <KPIContent label="Policies" value={kpis.policies.toLocaleString()} change="+15.3%" trend="up" color="#8b5cf6" /> },
    'chart-trend': {
      title: 'Premium vs Claims Trend',
      span: 'col-span-2',
      content: (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={filteredData.monthly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="premiumGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="claimsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={500000} stroke="#94a3b8" strokeDasharray="3 3" />
              <Area type="monotone" dataKey="premium" name="Premium" fill="url(#premiumGrad)" stroke="#3b82f6" strokeWidth={2} />
              <Area type="monotone" dataKey="claims" name="Claims" fill="url(#claimsGrad)" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="policies" name="Policies" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} yAxisId={0} />
              <Brush dataKey="month" height={20} stroke="#3b82f6" fill="#f1f5f9" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )
    },
    'chart-pie': {
      title: 'Claims by Type',
      span: 'col-span-2 lg:col-span-1',
      content: (
        <div className="h-64 flex flex-col">
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={filteredData.claimTypes} innerRadius="45%" outerRadius="75%" paddingAngle={3} dataKey="value" onClick={(d) => handleChartClick({ name: d.name })} style={{ cursor: 'pointer' }}>
                  {filteredData.claimTypes.map((entry, idx) => <Cell key={idx} fill={entry.color} stroke={selectedElement === entry.name ? '#000' : 'transparent'} strokeWidth={2} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1 px-2">
            {filteredData.claimTypes.map(t => (
              <div key={t.name} className="flex items-center gap-1.5 text-[10px] cursor-pointer hover:bg-gray-100 p-1 rounded" onClick={() => handleChartClick({ name: t.name })}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="text-gray-600 truncate">{t.name}</span>
                <span className="font-bold text-gray-800 ml-auto">{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    'chart-region': {
      title: 'Performance by Region',
      span: 'col-span-2 lg:col-span-1',
      content: (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData.regions} layout="vertical" style={{ cursor: 'pointer' }}>
              <CartesianGrid strokeDasharray="3 3" horizontal stroke="#e5e7eb" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={(v) => `$${v / 1000000}M`} />
              <YAxis type="category" dataKey="region" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#374151' }} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="premium" name="Premium" fill="#3b82f6" radius={[0, 4, 4, 0]} onClick={(data) => handleChartClick({ region: (data as unknown as { region: string }).region })}>
                {filteredData.regions.map((e, i) => <Cell key={i} fill={selectedElement === e.region ? '#1d4ed8' : '#3b82f6'} />)}
              </Bar>
              <Bar dataKey="claims" name="Claims" fill="#ef4444" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    },
    'chart-products': {
      title: 'Product Distribution',
      span: 'col-span-2 lg:col-span-1',
      content: (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData.products} style={{ cursor: 'pointer' }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="product" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#374151' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="premium" name="Premium" fill="#3b82f6" radius={[4, 4, 0, 0]} onClick={(data) => handleChartClick({ product: (data as unknown as { product: string }).product })}>
                {filteredData.products.map((e, i) => <Cell key={i} fill={selectedElement === e.product ? '#1d4ed8' : '#3b82f6'} />)}
              </Bar>
              <Bar dataKey="claims" name="Claims" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    },
    'table-dealers': {
      title: 'Dealer Performance',
      span: 'col-span-2 lg:col-span-4',
      content: (
        <div className="max-h-64 overflow-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b-2 border-gray-200 sticky top-0 bg-gray-50">
              <th className="text-left py-2 px-3 font-bold text-gray-700">Dealer</th>
              <th className="text-left py-2 px-3 font-bold text-gray-700">Region</th>
              <th className="text-right py-2 px-3 font-bold text-gray-700">Premium</th>
              <th className="text-right py-2 px-3 font-bold text-gray-700">Claims</th>
              <th className="text-right py-2 px-3 font-bold text-gray-700">Loss Ratio</th>
            </tr></thead>
            <tbody>
              {filteredData.dealers.map(d => (
                <tr key={d.name} className={`border-b border-gray-100 hover:bg-blue-50 cursor-pointer ${selectedElement === d.name ? 'bg-blue-100' : ''}`} onClick={() => handleChartClick({ name: d.name })}>
                  <td className="py-2 px-3 font-semibold text-gray-900">{d.name}</td>
                  <td className="py-2 px-3 text-gray-600"><span className="bg-gray-100 px-2 py-0.5 rounded-full text-[10px]">{d.region}</span></td>
                  <td className="py-2 px-3 text-right font-medium">${(d.premium / 1000).toFixed(0)}k</td>
                  <td className="py-2 px-3 text-right font-medium">${(d.claims / 1000).toFixed(0)}k</td>
                  <td className="py-2 px-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${d.lossRatio > 55 ? 'bg-red-100 text-red-700' : d.lossRatio > 50 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{d.lossRatio}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    },
  };

  return (
    <div className="flex h-screen bg-[#f3f2f1] font-sans overflow-hidden">
      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx,.xls,.csv" multiple onChange={handleFileInputChange} />

      {/* Left Nav */}
      <aside className="w-12 bg-[#1b1b1b] flex flex-col items-center py-2 gap-1">
        <div className="w-8 h-8 bg-[#f2c811] rounded flex items-center justify-center mb-4"><span className="text-black font-bold text-sm">C</span></div>
        <NavIcon icon={<LayoutDashboard size={18} />} active={activeView === 'Report'} onClick={() => setActiveView('Report')} tooltip="Report" />
        <NavIcon icon={<Table2 size={18} />} active={activeView === 'Data'} onClick={() => setActiveView('Data')} tooltip="Data" />
        <NavIcon icon={<Database size={18} />} active={activeView === 'Model'} onClick={() => setActiveView('Model')} tooltip="Model" />
        <div className="flex-1" />
        <NavIcon icon={<Settings size={18} />} tooltip="Settings" />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <header className="h-12 bg-white border-b border-gray-200 flex items-center px-3 gap-2 shrink-0">
          <div className="flex items-center gap-1 border-r border-gray-200 pr-3 mr-2">
            <ToolbarButton icon={<Plus size={14} />} label="New" />
            <ToolbarButton icon={<FileUp size={14} />} label="Upload" onClick={() => fileInputRef.current?.click()} />
          </div>
          <div className="flex items-center gap-1 border-r border-gray-200 pr-3 mr-2">
            <ToolbarButton icon={<Filter size={14} />} label="Filters" active={showFilters} onClick={() => setShowFilters(!showFilters)} />
            <ToolbarButton icon={<Layers size={14} />} label="Fields" active={showFieldPane} onClick={() => setShowFieldPane(!showFieldPane)} />
            <ToolbarButton icon={<Move size={14} />} label="Edit" active={isEditing} onClick={() => setIsEditing(!isEditing)} />
          </div>
          {hasActiveFilters && (
            <div className="flex items-center gap-2 px-2 py-1 bg-blue-50 rounded-lg">
              <AlertCircle size={12} className="text-blue-600" />
              <span className="text-xs text-blue-700 font-medium">Filters active</span>
              <button onClick={clearAllFilters} className="text-xs text-blue-600 hover:text-blue-800 font-bold underline">Clear</button>
            </div>
          )}
          <div className="flex-1" />
          <button onClick={exportFullDashboard} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50"><Download size={12} />Export</button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f2c811] text-black rounded text-xs font-semibold hover:bg-[#e0b800]"><Share2 size={12} />Publish</button>
        </header>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Filter Pane */}
          {showFilters && (
            <aside className="w-60 bg-white border-r border-gray-200 flex flex-col shrink-0 shadow-sm">
              <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2"><Filter size={14} className="text-gray-600" /><span className="text-xs font-bold text-gray-700 uppercase">Filters</span></div>
                <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowFilters(false)}><X size={14} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                <FilterDropdown label="Date Range" value={activeFilters.dateRange} options={filterOptions.dateRange} onChange={(v) => handleFilterChange('dateRange', v)} />
                <FilterDropdown label="Region" value={activeFilters.region} options={filterOptions.region} onChange={(v) => handleFilterChange('region', v)} />
                <FilterDropdown label="Dealer" value={activeFilters.dealer} options={filterOptions.dealer} onChange={(v) => handleFilterChange('dealer', v)} />
                <FilterDropdown label="Product" value={activeFilters.product} options={filterOptions.product} onChange={(v) => handleFilterChange('product', v)} />
              </div>
              {/* Data Sources */}
              <div className="border-t border-gray-200 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-700 uppercase">Data Sources</span>
                  <button className="text-blue-600 hover:text-blue-700" onClick={() => fileInputRef.current?.click()}><Plus size={12} /></button>
                </div>
                <div className="space-y-1">
                  {uploadedFiles.length === 0 ? (
                    <div className="text-xs text-gray-500 italic">Demo data loaded. Upload files to analyze your data.</div>
                  ) : (
                    uploadedFiles.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 p-1.5 bg-gray-50 rounded border border-gray-200 text-xs">
                        <FileSpreadsheet size={12} className="text-green-600" />
                        <span className="truncate flex-1">{f.name}</span>
                        <span className="text-gray-400">{f.data.length} rows</span>
                        <Check size={10} className="text-green-500" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </aside>
          )}

          {/* Canvas */}
          <main
            className={`flex-1 p-4 overflow-auto relative ${isDraggingFile ? 'bg-blue-50' : 'bg-[#f5f5f5]'}`}
            onDragOver={(e) => { e.preventDefault(); if (!draggedWidget) setIsDraggingFile(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDraggingFile(false); }}
            onDrop={handleFileDrop}
            ref={dashboardRef}
          >
            {/* File Drop Overlay */}
            {isDraggingFile && !draggedWidget && (
              <div className="absolute inset-4 border-2 border-dashed border-blue-400 bg-blue-50/90 rounded-lg flex items-center justify-center z-50">
                <div className="text-center">
                  <FileUp size={48} className="mx-auto text-blue-500 mb-2" />
                  <p className="text-lg font-semibold text-blue-700">Drop Excel or CSV files here</p>
                  <p className="text-sm text-blue-500">Files will be auto-analyzed</p>
                </div>
              </div>
            )}

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
                <Loader2 size={32} className="animate-spin text-blue-600" />
                <span className="ml-2 text-gray-700 font-medium">Processing files...</span>
              </div>
            )}

            {isEditing && (
              <div className="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-2 flex items-center gap-2">
                <Move size={14} className="text-blue-600" />
                <span className="text-xs text-blue-700 font-medium">Edit Mode: Drag cards to rearrange.</span>
                <button onClick={() => setIsEditing(false)} className="ml-auto text-xs bg-blue-600 text-white px-2 py-1 rounded">Done</button>
              </div>
            )}

            {/* Hint Bar */}
            <div className="mb-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-3 flex items-center gap-3 text-white shadow-lg">
              <MousePointer size={20} />
              <div>
                <p className="text-sm font-bold">Interactive Dashboard</p>
                <p className="text-xs opacity-90">Click any chart bar/slice or table row to filter. Use filters on the left for more control.</p>
              </div>
              {hasActiveFilters && <button onClick={clearAllFilters} className="ml-auto bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-xs font-bold">Reset</button>}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {widgetOrder.map((id) => {
                const w = widgets[id];
                if (!w) return null;
                return (
                  <div key={id} id={id} className={`${w.span} ${isEditing ? 'cursor-move' : ''} ${draggedWidget === id ? 'opacity-50' : ''}`}
                    draggable={isEditing} onDragStart={() => handleWidgetDragStart(id)} onDragOver={(e) => handleWidgetDragOver(e, id)} onDragEnd={handleWidgetDragEnd}>
                    <Card id={id} title={w.title} isEditing={isEditing} exportMenuOpen={exportMenuOpen} setExportMenuOpen={setExportMenuOpen} onExportPDF={() => exportToPDF(id)} onExportImage={() => exportToImage(id)}>
                      {w.content}
                    </Card>
                  </div>
                );
              })}
            </div>
          </main>

          {/* Right Pane */}
          {showFieldPane && (
            <aside className="w-72 bg-white border-l border-gray-200 flex flex-col shrink-0">
              <div className="flex-1 flex flex-col border-b border-gray-200 min-h-0">
                <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                  <span className="text-xs font-bold text-gray-700 uppercase">Fields</span>
                  <Search size={14} className="text-gray-400" />
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  <div className="mb-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1.5 px-1"><ChevronDown size={12} /><span>Measures</span></div>
                    {['Premium Amount', 'Claims Amount', 'Policy Count', 'Loss Ratio'].map(f => <FieldItem key={f} name={f} icon="💰" />)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1.5 px-1"><ChevronDown size={12} /><span>Dimensions</span></div>
                    {['Dealer Name', 'Region', 'Product Type', 'Month'].map(f => <FieldItem key={f} name={f} icon="📊" />)}
                  </div>
                </div>
              </div>
              {/* Chat */}
              <div className="h-80 flex flex-col bg-slate-50">
                <div className="p-3 border-b border-gray-200 flex items-center gap-2 bg-white">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center"><MessageSquare size={12} className="text-white" /></div>
                  <span className="text-xs font-bold text-gray-800">Clarity AI</span>
                  <span className="ml-auto text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">Online</span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`text-xs leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white ml-4 rounded-2xl rounded-br-sm p-2.5' : 'bg-white border border-gray-200 mr-4 rounded-2xl rounded-bl-sm p-2.5 text-gray-700'}`}>{m.content}</div>
                  ))}
                </div>
                <form onSubmit={handleChatSubmit} className="p-3 border-t border-gray-200 bg-white">
                  <div className="relative">
                    <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Try: 'Show Dubai' or 'Clear'" className="w-full pl-3 pr-10 py-2 bg-gray-100 border-none rounded-xl text-xs outline-none" />
                    <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700"><ArrowUpRight size={12} /></button>
                  </div>
                </form>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-components
function NavIcon({ icon, active, onClick, tooltip }: { icon: React.ReactNode; active?: boolean; onClick?: () => void; tooltip?: string }) {
  return <button onClick={onClick} className={`w-10 h-10 flex items-center justify-center rounded ${active ? 'bg-[#f2c811] text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`} title={tooltip}>{icon}</button>;
}

function ToolbarButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return <button onClick={onClick} className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${active ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>{icon}<span className="hidden sm:inline">{label}</span></button>;
}

function FilterDropdown({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const isActive = value !== options[0];
  return (
    <div className={`rounded-lg border overflow-hidden ${isActive ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50">
        <div><span className="text-[10px] text-gray-500 uppercase font-bold block">{label}</span><span className={`text-sm font-semibold ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>{value}</span></div>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="border-t border-gray-100 p-2 space-y-0.5 max-h-48 overflow-y-auto bg-white">
          {options.map(o => (
            <button key={o} onClick={() => { onChange(o); setOpen(false); }} className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg ${value === o ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}>
              {value === o && <Check size={12} />}<span className={value === o ? '' : 'ml-5'}>{o}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FieldItem({ name, icon }: { name: string; icon: string }) {
  return <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-blue-50 cursor-grab text-xs text-gray-700"><span className="text-sm">{icon}</span><span className="flex-1">{name}</span><Eye size={12} className="text-gray-300" /></div>;
}

function Card({ id, title, children, isEditing, exportMenuOpen, setExportMenuOpen, onExportPDF, onExportImage }: { id: string; title: string; children: React.ReactNode; isEditing: boolean; exportMenuOpen: string | null; setExportMenuOpen: (v: string | null) => void; onExportPDF: () => void; onExportImage: () => void }) {
  return (
    <div className={`h-full bg-white rounded-xl border ${isEditing ? 'border-blue-300 shadow-lg ring-2 ring-blue-100' : 'border-gray-200 shadow-sm'} overflow-hidden flex flex-col`}>
      <div className={`flex items-center justify-between px-3 py-2.5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white ${isEditing ? 'cursor-move' : ''}`}>
        {isEditing && <GripVertical size={14} className="text-gray-400 mr-2" />}
        <span className="text-xs font-bold text-gray-800 flex-1 truncate">{title}</span>
        <div className="relative">
          <button className="p-1.5 hover:bg-gray-100 rounded-lg" onClick={(e) => { e.stopPropagation(); setExportMenuOpen(exportMenuOpen === id ? null : id); }}><Download size={12} className="text-gray-500" /></button>
          {exportMenuOpen === id && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 min-w-[140px]">
              <button onClick={(e) => { e.stopPropagation(); onExportPDF(); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"><FileText size={12} />Export PDF</button>
              <button onClick={(e) => { e.stopPropagation(); onExportImage(); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"><Image size={12} />Export Image</button>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 p-3 overflow-hidden">{children}</div>
    </div>
  );
}

function KPIContent({ label, value, change, trend, color }: { label: string; value: string; change: string; trend: 'up' | 'down'; color: string }) {
  return (
    <div className="h-full flex flex-col justify-center">
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      <span className={`text-[10px] font-bold mt-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>{trend === 'up' ? '↑' : '↓'} {change}</span>
    </div>
  );
}
