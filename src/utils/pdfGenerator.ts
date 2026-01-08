import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const COMPANY_NAME = "Justice Corporate Logistics";
const COMPANY_TAGLINE = "Premium Car Rental Services";
const COMPANY_PHONE = "0702575512";
const COMPANY_EMAIL = "justicevincentt@gmail.com";
const COMPANY_ADDRESS = "Occidental Plaza, Muthithi Rd, Nairobi";
const COMPANY_WEBSITE = "www.justicelogisticskenya.com";

// Company colors
const PRIMARY_COLOR: [number, number, number] = [245, 158, 11]; // Amber
const SECONDARY_COLOR: [number, number, number] = [31, 41, 55]; // Dark gray
const TEXT_COLOR: [number, number, number] = [55, 65, 81];

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  approvedOrders: number;
  completedOrders: number;
  rejectedOrders: number;
  revenueData: Array<{ month: string; revenue: number; orders: number }>;
  popularVehicles: Array<{ name: string; bookings: number; revenue: number }>;
}

interface OrderData {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  vehicle_name: string;
  pickup_date: string;
  return_date: string;
  status: string;
  price_per_day: number;
}

const addHeader = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header background
  doc.setFillColor(...SECONDARY_COLOR);
  doc.rect(0, 0, pageWidth, 35, "F");
  
  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(COMPANY_NAME, 15, 18);
  
  // Tagline
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(COMPANY_TAGLINE, 15, 28);
  
  // Right side - Generated date
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 200);
  const date = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.text(`Generated: ${date}`, pageWidth - 15, 18, { align: "right" });
  
  return 45; // Return Y position after header
};

const addFooter = (doc: jsPDF, pageNumber: number, totalPages: number) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Footer line
  doc.setDrawColor(...PRIMARY_COLOR);
  doc.setLineWidth(0.5);
  doc.line(15, pageHeight - 25, pageWidth - 15, pageHeight - 25);
  
  // Contact info
  doc.setTextColor(...TEXT_COLOR);
  doc.setFontSize(8);
  doc.text(`${COMPANY_PHONE} | ${COMPANY_EMAIL}`, 15, pageHeight - 18);
  doc.text(COMPANY_ADDRESS, 15, pageHeight - 12);
  
  // Page number
  doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - 15, pageHeight - 15, { align: "right" });
  
  // Watermark
  doc.setTextColor(230, 230, 230);
  doc.setFontSize(40);
  doc.setFont("helvetica", "bold");
  doc.text("CONFIDENTIAL", pageWidth / 2, pageHeight / 2, {
    align: "center",
    angle: 45,
  });
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(value);
};

export const generateAnalyticsPDF = (data: AnalyticsData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  let yPos = addHeader(doc);
  
  // Title
  doc.setTextColor(...SECONDARY_COLOR);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Analytics Report", 15, yPos);
  yPos += 15;
  
  // Summary Stats Section
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(15, yPos, pageWidth - 30, 45, 3, 3, "F");
  
  doc.setFontSize(11);
  doc.setTextColor(...TEXT_COLOR);
  doc.setFont("helvetica", "bold");
  doc.text("Summary Overview", 20, yPos + 10);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  const col1X = 20;
  const col2X = 70;
  const col3X = 120;
  const col4X = 170;
  
  // Row 1
  doc.text("Total Revenue:", col1X, yPos + 22);
  doc.setTextColor(...PRIMARY_COLOR);
  doc.setFont("helvetica", "bold");
  doc.text(formatCurrency(data.totalRevenue), col1X, yPos + 30);
  
  doc.setTextColor(...TEXT_COLOR);
  doc.setFont("helvetica", "normal");
  doc.text("Total Orders:", col2X, yPos + 22);
  doc.setFont("helvetica", "bold");
  doc.text(data.totalOrders.toString(), col2X, yPos + 30);
  
  doc.setFont("helvetica", "normal");
  doc.text("Pending:", col3X, yPos + 22);
  doc.setTextColor(234, 179, 8); // Yellow
  doc.setFont("helvetica", "bold");
  doc.text(data.pendingOrders.toString(), col3X, yPos + 30);
  
  doc.setTextColor(...TEXT_COLOR);
  doc.setFont("helvetica", "normal");
  doc.text("Completed:", col4X, yPos + 22);
  doc.setTextColor(34, 197, 94); // Green
  doc.setFont("helvetica", "bold");
  doc.text(data.completedOrders.toString(), col4X, yPos + 30);
  
  yPos += 55;
  
  // Monthly Revenue Table
  doc.setTextColor(...SECONDARY_COLOR);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Monthly Performance", 15, yPos);
  yPos += 8;
  
  autoTable(doc, {
    startY: yPos,
    head: [["Month", "Revenue (KES)", "Orders"]],
    body: data.revenueData.map((item) => [
      item.month,
      formatCurrency(item.revenue),
      item.orders.toString(),
    ]),
    theme: "striped",
    headStyles: {
      fillColor: SECONDARY_COLOR,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 60, halign: "right" },
      2: { cellWidth: 40, halign: "center" },
    },
    margin: { left: 15, right: 15 },
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  // Popular Vehicles Table
  if (data.popularVehicles.length > 0) {
    doc.setTextColor(...SECONDARY_COLOR);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Top Performing Vehicles", 15, yPos);
    yPos += 8;
    
    autoTable(doc, {
      startY: yPos,
      head: [["Vehicle", "Bookings", "Revenue (KES)"]],
      body: data.popularVehicles.map((vehicle) => [
        vehicle.name,
        vehicle.bookings.toString(),
        formatCurrency(vehicle.revenue),
      ]),
      theme: "striped",
      headStyles: {
        fillColor: PRIMARY_COLOR,
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [254, 252, 232],
      },
      styles: {
        fontSize: 9,
        cellPadding: 4,
      },
      margin: { left: 15, right: 15 },
    });
  }
  
  // Add footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }
  
  doc.save(`JCL_Analytics_Report_${new Date().toISOString().split("T")[0]}.pdf`);
};

export const generateOrdersPDF = (orders: OrderData[], status?: string) => {
  const doc = new jsPDF("landscape");
  const pageWidth = doc.internal.pageSize.getWidth();
  
  let yPos = addHeader(doc);
  
  // Title
  doc.setTextColor(...SECONDARY_COLOR);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(`Rental Orders Report${status && status !== "all" ? ` - ${status.charAt(0).toUpperCase() + status.slice(1)}` : ""}`, 15, yPos);
  yPos += 5;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...TEXT_COLOR);
  doc.text(`Total Orders: ${orders.length}`, 15, yPos + 8);
  yPos += 15;
  
  // Orders table
  autoTable(doc, {
    startY: yPos,
    head: [["#", "Customer", "Contact", "Vehicle", "Pickup", "Return", "Days", "Est. Cost", "Status"]],
    body: orders.map((order, index) => {
      const pickupDate = new Date(order.pickup_date);
      const returnDate = new Date(order.return_date);
      const days = Math.max(1, Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)));
      const cost = order.price_per_day * days;
      
      return [
        (index + 1).toString(),
        order.customer_name,
        order.customer_phone,
        order.vehicle_name,
        pickupDate.toLocaleDateString("en-GB"),
        returnDate.toLocaleDateString("en-GB"),
        days.toString(),
        formatCurrency(cost),
        order.status.charAt(0).toUpperCase() + order.status.slice(1),
      ];
    }),
    theme: "striped",
    headStyles: {
      fillColor: SECONDARY_COLOR,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 12, halign: "center" },
      1: { cellWidth: 40 },
      2: { cellWidth: 35 },
      3: { cellWidth: 45 },
      4: { cellWidth: 25, halign: "center" },
      5: { cellWidth: 25, halign: "center" },
      6: { cellWidth: 15, halign: "center" },
      7: { cellWidth: 35, halign: "right" },
      8: { cellWidth: 25, halign: "center" },
    },
    margin: { left: 15, right: 15 },
    didParseCell: (data) => {
      if (data.column.index === 8 && data.section === "body") {
        const status = data.cell.raw?.toString().toLowerCase();
        if (status === "approved" || status === "completed") {
          data.cell.styles.textColor = [34, 197, 94];
        } else if (status === "rejected") {
          data.cell.styles.textColor = [239, 68, 68];
        } else if (status === "pending") {
          data.cell.styles.textColor = [234, 179, 8];
        }
        data.cell.styles.fontStyle = "bold";
      }
    },
  });
  
  // Summary at bottom
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  const approvedOrders = orders.filter(o => o.status === "approved" || o.status === "completed");
  const totalRevenue = approvedOrders.reduce((sum, order) => {
    const pickupDate = new Date(order.pickup_date);
    const returnDate = new Date(order.return_date);
    const days = Math.max(1, Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)));
    return sum + (order.price_per_day * days);
  }, 0);
  
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(pageWidth - 130, yPos, 115, 25, 3, 3, "F");
  
  doc.setFontSize(10);
  doc.setTextColor(...TEXT_COLOR);
  doc.text("Total Estimated Revenue:", pageWidth - 125, yPos + 10);
  doc.setTextColor(...PRIMARY_COLOR);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(formatCurrency(totalRevenue), pageWidth - 125, yPos + 20);
  
  // Add footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }
  
  doc.save(`JCL_Orders_Report_${new Date().toISOString().split("T")[0]}.pdf`);
};
