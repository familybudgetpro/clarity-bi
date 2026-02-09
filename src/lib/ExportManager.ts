import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

export async function exportDashboardToPDF(
  elementIds: string[],
  fileName: string = "dashboard-report",
) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [1440, 900], // Standard desktop resolution
  });

  // Since we might have multiple pages or just one big view, for now we will snapshot the main container
  // A more robust solution would iterate over active pages.
  // We'll simplisticly capture the whole visible dashboard.

  const dashboardElement = document.querySelector("main") as HTMLElement;
  if (!dashboardElement) return;

  try {
    // Temporarily expand height to capture everything if scrolled
    const originalOverflow = dashboardElement.style.overflow;
    dashboardElement.style.overflow = "visible";

    const canvas = await html2canvas(dashboardElement, {
      scale: 2, // High resolution
      useCORS: true,
      logging: false,

      backgroundColor: null as any, // Allow transparent/theme background
    });

    dashboardElement.style.overflow = originalOverflow;

    const imgData = canvas.toDataURL("image/png");
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = doc.internal.pageSize.getHeight();

    const imgProps = doc.getImageProperties(imgData);
    const ratio = imgProps.width / imgProps.height;
    const width = pdfWidth;
    const height = width / ratio;

    doc.addImage(imgData, "PNG", 0, 0, width, height);
    doc.save(`${fileName}.pdf`);
  } catch (error) {
    console.error("Export failed", error);
  }
}
