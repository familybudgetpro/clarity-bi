import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

export async function exportDashboardToPDF(
  target: HTMLElement | string = "main",
  fileName: string = "dashboard-report",
) {
  const element =
    typeof target === "string"
      ? (document.querySelector(target) as HTMLElement)
      : target;

  if (!element) return;

  try {
    // Temporarily ensure visibility and disable scrolling for capture
    const originalStyle = {
      overflow: element.style.overflow,
      height: element.style.height,
      maxHeight: element.style.maxHeight,
      position: element.style.position,
    };

    // Force element to expand to its full content height
    element.style.overflow = "visible";
    element.style.height = "auto";
    element.style.maxHeight = "none";

    // Get actual dimensions including content beyond scroll
    const width = element.scrollWidth;
    const height = element.scrollHeight;

    const canvas = await html2canvas(element, {
      scale: 2, // High resolution
      useCORS: true,
      logging: false,
      backgroundColor: null as any,
      width: width,
      height: height,
      windowWidth: width,
      windowHeight: height,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
    });

    // Restore original styles
    element.style.overflow = originalStyle.overflow;
    element.style.height = originalStyle.height;
    element.style.maxHeight = originalStyle.maxHeight;

    const imgData = canvas.toDataURL("image/png");

    // Create PDF matching the captured aspect ratio
    const doc = new jsPDF({
      orientation: width > height ? "landscape" : "portrait",
      unit: "px",
      format: [width, height],
    });

    doc.addImage(imgData, "PNG", 0, 0, width, height);
    doc.save(`${fileName}.pdf`);
  } catch (error) {
    console.error("Export failed", error);
  }
}

import * as XLSX from "xlsx";

export function exportToExcel(data: any[], fileName: string) {
  if (!data || data.length === 0) return;

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
