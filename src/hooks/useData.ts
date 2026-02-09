import { useState, useMemo, useCallback } from "react";
import * as XLSX from "xlsx";
import { useFilters } from "./useFilters";

// Full Dataset - Insurance Industry (Default demo data)
const defaultData = {
  monthly: [
    {
      month: "Jan",
      premium: 420000,
      claims: 280000,
      policies: 1200,
      region: "Dubai",
      product: "Comprehensive",
    },
    {
      month: "Feb",
      premium: 380000,
      claims: 220000,
      policies: 980,
      region: "Dubai",
      product: "Third Party",
    },
    {
      month: "Mar",
      premium: 520000,
      claims: 310000,
      policies: 1450,
      region: "Abu Dhabi",
      product: "Comprehensive",
    },
    {
      month: "Apr",
      premium: 490000,
      claims: 290000,
      policies: 1380,
      region: "Abu Dhabi",
      product: "Agency Repair",
    },
    {
      month: "May",
      premium: 580000,
      claims: 350000,
      policies: 1620,
      region: "Sharjah",
      product: "Comprehensive",
    },
    {
      month: "Jun",
      premium: 610000,
      claims: 380000,
      policies: 1750,
      region: "Dubai",
      product: "Third Party",
    },
    {
      month: "Jul",
      premium: 550000,
      claims: 320000,
      policies: 1500,
      region: "Dubai",
      product: "Comprehensive",
    },
    {
      month: "Aug",
      premium: 480000,
      claims: 290000,
      policies: 1320,
      region: "Sharjah",
      product: "Agency Repair",
    },
    {
      month: "Sep",
      premium: 620000,
      claims: 400000,
      policies: 1800,
      region: "Abu Dhabi",
      product: "Comprehensive",
    },
    {
      month: "Oct",
      premium: 700000,
      claims: 420000,
      policies: 1950,
      region: "Dubai",
      product: "Third Party",
    },
    {
      month: "Nov",
      premium: 680000,
      claims: 390000,
      policies: 1850,
      region: "Dubai",
      product: "Comprehensive",
    },
    {
      month: "Dec",
      premium: 750000,
      claims: 450000,
      policies: 2100,
      region: "Abu Dhabi",
      product: "Comprehensive",
    },
  ],
  dealers: [
    {
      name: "Al Futtaim Motors",
      premium: 1250000,
      claims: 620000,
      policies: 3200,
      lossRatio: 49.6,
      region: "Dubai",
      product: "Comprehensive",
    },
    {
      name: "Juma Al Majid",
      premium: 980000,
      claims: 510000,
      policies: 2100,
      lossRatio: 52.0,
      region: "Dubai",
      product: "Third Party",
    },
    {
      name: "Trading Enterprises",
      premium: 850000,
      claims: 320000,
      policies: 1900,
      lossRatio: 37.6,
      region: "Abu Dhabi",
      product: "Comprehensive",
    },
    {
      name: "Al Nabooda Auto",
      premium: 720000,
      claims: 410000,
      policies: 1500,
      lossRatio: 56.9,
      region: "Sharjah",
      product: "Agency Repair",
    },
    {
      name: "Al Rostamani",
      premium: 640000,
      claims: 280000,
      policies: 1400,
      lossRatio: 43.8,
      region: "Dubai",
      product: "Comprehensive",
    },
    {
      name: "Gargash Enterprises",
      premium: 580000,
      claims: 350000,
      policies: 1250,
      lossRatio: 60.3,
      region: "Abu Dhabi",
      product: "Third Party",
    },
    {
      name: "Emirates Motor",
      premium: 520000,
      claims: 240000,
      policies: 1100,
      lossRatio: 46.2,
      region: "Sharjah",
      product: "Comprehensive",
    },
    {
      name: "Al Tayer Motors",
      premium: 890000,
      claims: 420000,
      policies: 2300,
      lossRatio: 47.2,
      region: "Dubai",
      product: "Agency Repair",
    },
    {
      name: "Galadari Automobiles",
      premium: 450000,
      claims: 190000,
      policies: 950,
      lossRatio: 42.2,
      region: "Abu Dhabi",
      product: "Comprehensive",
    },
    {
      name: "AW Rostamani",
      premium: 710000,
      claims: 330000,
      policies: 1800,
      lossRatio: 46.5,
      region: "Sharjah",
      product: "Third Party",
    },
  ],
  claimTypes: [
    { name: "Collision", value: 42, amount: 2100000, color: "#3b82f6" },
    { name: "Theft", value: 15, amount: 750000, color: "#8b5cf6" },
    { name: "Natural Calamity", value: 18, amount: 900000, color: "#10b981" },
    { name: "Windscreen", value: 12, amount: 600000, color: "#f59e0b" },
    { name: "Liability", value: 13, amount: 650000, color: "#ec4899" },
  ],
  products: [
    {
      product: "Comprehensive",
      count: 5200,
      premium: 3100000,
      claims: 1500000,
    },
    { product: "Third Party", count: 4100, premium: 820000, claims: 410000 },
    { product: "Agency Repair", count: 3200, premium: 1920000, claims: 960000 },
    {
      product: "Roadside Assist",
      count: 4500,
      premium: 450000,
      claims: 120000,
    },
    { product: "GAP Insurance", count: 1200, premium: 360000, claims: 80000 },
  ],
  regions: [
    {
      region: "Dubai",
      premium: 4500000,
      claims: 2100000,
      policies: 12000,
      dealers: 15,
    },
    {
      region: "Abu Dhabi",
      premium: 3200000,
      claims: 1600000,
      policies: 8500,
      dealers: 10,
    },
    {
      region: "Sharjah",
      premium: 1500000,
      claims: 800000,
      policies: 4200,
      dealers: 8,
    },
    {
      region: "Ajman",
      premium: 450000,
      claims: 220000,
      policies: 1100,
      dealers: 3,
    },
    {
      region: "RAK",
      premium: 320000,
      claims: 150000,
      policies: 800,
      dealers: 2,
    },
    {
      region: "Fujairah",
      premium: 250000,
      claims: 110000,
      policies: 600,
      dealers: 2,
    },
  ],
  recentClaims: [
    {
      id: "CL-9081",
      policy: "POL-7721",
      region: "Dubai",
      product: "Comprehensive",
      amount: 45000,
      date: "2024-02-05",
      status: "Approved",
    },
    {
      id: "CL-8822",
      policy: "POL-3490",
      region: "Abu Dhabi",
      product: "Third Party",
      amount: 12500,
      date: "2024-02-04",
      status: "Pending",
    },
    {
      id: "CL-8710",
      policy: "POL-1102",
      region: "Dubai",
      product: "Agency Repair",
      amount: 28000,
      date: "2024-02-03",
      status: "Approved",
    },
    {
      id: "CL-8544",
      policy: "POL-9908",
      region: "Sharjah",
      product: "Comprehensive",
      amount: 5500,
      date: "2024-02-02",
      status: "Under Review",
    },
    {
      id: "CL-8401",
      policy: "POL-6651",
      region: "Ajman",
      product: "Third Party",
      amount: 9800,
      date: "2024-02-01",
      status: "Approved",
    },
    {
      id: "CL-8390",
      policy: "POL-4412",
      region: "Dubai",
      product: "Comprehensive",
      amount: 15200,
      date: "2024-01-30",
      status: "Paid",
    },
    {
      id: "CL-8211",
      policy: "POL-2233",
      region: "Abu Dhabi",
      product: "Agency Repair",
      amount: 32000,
      date: "2024-01-28",
      status: "Approved",
    },
    {
      id: "CL-8152",
      policy: "POL-5561",
      region: "Fujairah",
      product: "Comprehensive",
      amount: 6700,
      date: "2024-02-06",
      status: "Pending",
    },
    {
      id: "CL-8099",
      policy: "POL-8822",
      region: "Dubai",
      product: "Roadside Assist",
      amount: 1200,
      date: "2024-02-07",
      status: "Approved",
    },
  ],
};

export interface UploadedFile {
  name: string;
  data: Record<string, unknown>[];
  columns: string[];
}

export function useData(filters: ReturnType<typeof useFilters>["filters"]) {
  const [fullData, setFullData] = useState(defaultData);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Apply filters to data
  const filteredData = useMemo(() => {
    let monthly = [...fullData.monthly];
    let dealers = [...fullData.dealers];
    let regions = [...fullData.regions];
    let products = [...fullData.products];
    let recentClaims = [...fullData.recentClaims];

    // Region filter
    if (filters.region !== "All Regions") {
      monthly = monthly.filter((d) => d.region === filters.region);
      dealers = dealers.filter((d) => d.region === filters.region);
      regions = regions.filter((d) => d.region === filters.region);
      recentClaims = recentClaims.filter((d) => d.region === filters.region);
    }

    // Product filter
    if (filters.product !== "All Products") {
      monthly = monthly.filter((d) => d.product === filters.product);
      dealers = dealers.filter((d) => d.product === filters.product);
      products = products.filter((d) => d.product === filters.product);
      recentClaims = recentClaims.filter((d) => d.product === filters.product);
    }

    // Dealer filter
    if (filters.dealer !== "All Dealers") {
      dealers = dealers.filter((d) => d.name === filters.dealer);
    }

    // Date range filter
    if (filters.dateRange !== "All Time") {
      const monthsMap: Record<string, number> = {
        "Last 30 Days": 1,
        "Last 3 Months": 3,
        "Last 6 Months": 6,
        "Last Year": 12,
      };
      const keep = monthsMap[filters.dateRange] || 12;
      monthly = monthly.slice(-keep);
    }

    return {
      monthly,
      dealers,
      regions,
      products,
      recentClaims,
      claimTypes: fullData.claimTypes, // Static for now, could be dynamic
    };
  }, [filters, fullData]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalPremium = filteredData.monthly.reduce(
      (sum, d) => sum + (d.premium || 0),
      0,
    );
    const totalClaims = filteredData.monthly.reduce(
      (sum, d) => sum + (d.claims || 0),
      0,
    );
    const totalPolicies = filteredData.monthly.reduce(
      (sum, d) => sum + (d.policies || 0),
      0,
    );
    const lossRatio = totalPremium > 0 ? (totalClaims / totalPremium) * 100 : 0;

    return {
      premium: totalPremium,
      claims: totalClaims,
      policies: totalPolicies,
      lossRatio: lossRatio.toFixed(1),
    };
  }, [filteredData]);

  // Parse uploaded Excel/CSV file
  const parseFile = useCallback(
    async (file: File): Promise<UploadedFile | null> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData =
              XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
            const columns = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];

            resolve({ name: file.name, data: jsonData, columns });
          } catch {
            resolve(null);
          }
        };
        reader.readAsArrayBuffer(file);
      });
    },
    [],
  );

  const handleFileUpload = useCallback(
    async (files: FileList | File[]) => {
      setIsLoading(true);
      const fileArray = Array.from(files);
      const parsed: UploadedFile[] = [];

      for (const file of fileArray) {
        if (
          file.name.endsWith(".xlsx") ||
          file.name.endsWith(".csv") ||
          file.name.endsWith(".xls")
        ) {
          const result = await parseFile(file);
          if (result) {
            parsed.push(result);
          }
        }
      }

      if (parsed.length > 0) {
        setUploadedFiles((prev) => [...prev, ...parsed]);

        // Try to auto-map data (simplified for refactor)
        const firstFile = parsed[0];
        if (firstFile.data.length > 0) {
          // Logic to update fullData would go here
          // For now, we just acknowledge the upload
        }
      }
      setIsLoading(false);
    },
    [parseFile],
  );

  return {
    filteredData,
    kpis,
    uploadedFiles,
    isLoading,
    handleFileUpload,
  };
}
