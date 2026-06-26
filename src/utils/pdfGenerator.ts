import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

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

export const generateContractPDF = (order: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Get and increment contract counter
  let contractCounter = parseInt(localStorage.getItem("jcl_contract_counter") || "1000");
  contractCounter++;
  localStorage.setItem("jcl_contract_counter", contractCounter.toString());

  const contractNo = `JCL/AGR/2026/${contractCounter}`;
  const today = format(new Date(), "dd/MM/yyyy");
  const details = order.contract_details || {};

  // Header with Logo and Company Info
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, pageWidth, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("CAR RENTAL AGREEMENT", pageWidth / 2, 18, { align: "center" });

  doc.setFontSize(12);
  doc.text("Justice Corporate Logistics Kenya", pageWidth / 2, 28, { align: "center" });

  try {
    doc.addImage("/og-image.png", "PNG", 15, 5, 25, 25);
  } catch (e) {
    console.error("Logo failed to load:", e);
  }

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`Contract No. ${contractNo}`, 15, 45);
  doc.text(`Date: ${today}`, pageWidth - 15, 45, { align: "right" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("0702575512 | info@justiceultimateautomobiles.com", 15, 52);
  doc.text("Westlands, Muthithi Road, Nairobi", 15, 56);

  let yPos = 65;

  // DRIVER/LESSEE Section
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("DRIVER / LESSEE:", 15, yPos);
  yPos += 7;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`HIRE CONTRACT (FULL NAMES AND ADDRESS): ${order.customer_name.toUpperCase()}, ${order.pickup_location || "NAIROBI, KENYA"}`, 15, yPos);
  yPos += 5;
  doc.text(`ID CARD NO. ${details.lessee_id_no || "_________________"} HIRES PHYSICAL ${details.lessee_physical || "_________________"} RESIDENTIAL ADDRESS ${details.lessee_address || "_________________"}`, 15, yPos);
  yPos += 5;
  doc.text(`OFFICE TELEPHONE ${details.lessee_office_tel || "_______________"} GUARANTOR NAME ${details.guarantor_name || "____________________"} GUARANTOR ID NO. ${details.guarantor_id_no || "________________________"}`, 15, yPos);
  yPos += 5;
  doc.text(`OFFICE TELEPHONE ${details.guarantor_office_tel || "_______________"} NAME OF DRIVER ${order.customer_name.toUpperCase()} ID CARD NO. ${details.lessee_id_no || "_________________"}`, 15, yPos);
  yPos += 5;
  doc.text(`OFFICE TELEPHONE ${details.lessee_office_tel || "_______________"} DRIVING LICENCE NUMBER ${details.driver_license_no || "_______________"} NO. OF YEARS LICENCE HELD _________`, 15, yPos);
  yPos += 5;
  doc.text(`EXPIRY DATE _________________`, 15, yPos);

  yPos += 10;

  // OWNER/LESSOR Section
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("OWNER / LESSOR:", 15, yPos);
  yPos += 7;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`CAR MAKE: ${order.vehicles?.name.split(' ')[0] || "N/A"}  CAR NO: ${details.car_no || "_________________"}  NEXT SERVICE MILEAGE: ${details.next_service || "_________________"}`, 15, yPos);

  yPos += 10;

  // PAYMENT Section
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("PAYMENT:", 15, yPos);
  yPos += 7;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");

  const pickup = new Date(order.pickup_date);
  const dropoff = new Date(order.return_date);
  const days = Math.max(1, Math.ceil((dropoff.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)));

  doc.text(`M-PESA CODE: ${details.mpesa_code || "_________________"}  DEPOSIT (KSHS): ${details.deposit_amount || "_________________"}  COUNTY/AREA OF USE: _________________`, 15, yPos);
  yPos += 5;
  doc.text(`NO. OF DAYS: ${days} CYCLE(S)  TOTAL PAYABLE: KSh ${(order.vehicles?.price_per_day * days).toLocaleString()}`, 15, yPos);

  yPos += 10;

  // CHECKLIST Section
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("CHECK LIST:", 15, yPos);
  yPos += 6;
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("COOLANT CHECK [ ]  MATS [ ]  JACK [ ]  LOCKNUTS [ ]  SPARE WHEEL [ ]  WHEEL SPANNER [ ]  RADIO BRAND: ________  OIL CHECK [ ]  CLEAN CAR [ ]", 15, yPos);

  yPos += 8;
  doc.setFont("helvetica", "bold");
  doc.text("TYRE TYPE", 15, yPos);
  yPos += 5;
  doc.setFont("helvetica", "normal");
  doc.text("RL: ________  FR: ________", 15, yPos);
  yPos += 4;
  doc.text("RR: ________  FL: ________", 15, yPos);

  yPos += 10;

  // STATUTORY DECLARATION
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("THE PARTIES AGREE TO THE FOLLOWING:", 15, yPos);
  yPos += 6;
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text(`I, THE UNDERSIGNED AM HIRING CAR NO ________________ IN GOOD CONDITION IN CASE OF AN ACCIDENT, I AM LIABLE TO COVER THE DAMAGE.`, 15, yPos);
  yPos += 4;
  doc.text(`IF DAMAGE EXCEEDS THE EXCESS VALUE OF _______________ I SHALL PAY THE EXCESS VALUE`, 15, yPos);

  yPos += 8;
  doc.setFont("helvetica", "bold");
  doc.text("STATUTORY DECLARATION", 15, yPos);
  yPos += 5;
  doc.setFont("helvetica", "normal");
  const declText = `I hereby declare that- The motor vehicle will be used for the following purpose: ________________. I am above 25 years of age and hold a valid driver's licence with over five (5) years of driving experience. I am physically fit to operate a motor vehicle and do not suffer from any condition, impaired vision, or hearing defect that could affect my driving ability. I have not, within the past five (5) years, been convicted of any offence related to careless or dangerous driving. I FURTHER DECLARE THAT, to the best of my knowledge and belief: All particulars, statements, and information provided above are true and accurate, whether written by myself or on my behalf. The motor vehicle will not be used for the carriage of passengers for hire, reward, or any commercial purpose. The vehicle shall not carry more passengers than declared, and I acknowledge that this declaration forms the basis of the agreement with the insurer. I understand that all payments made are non-refundable and in control at all times. Should it be found in the possession of any unauthorized person, the company reserves the right to repossess it immediately. I accept full responsibility for any traffic offences committed using the vehicle. I acknowledge that any delay in returning the vehicle will result in an additional day's rental charge unless prior arrangements have been made.`;
  const splitDecl = doc.splitTextToSize(declText, pageWidth - 30);
  doc.text(splitDecl, 15, yPos);

  yPos += (splitDecl.length * 4) + 5;
  doc.setFont("helvetica", "bold");
  doc.text(`HIRER SIGN ____________________ COMPANY SIGN ____________________`, 15, yPos);
  yPos += 5;
  doc.text(`DATE ${today} Signature ____________________`, 15, yPos);

  yPos += 8;
  doc.setFontSize(7);
  const footerNote = "I FULLY UNDERSTAND THAT I'M THE AUTHORISED PERSON TO DRIVE THIS VEHICLE UNLESS OTHER DRIVERS ARE SPECIFIED ABOVE IN THE AGREEMENT. THE VEHICLE IS HIRED FOR THE SPECIFIED PERIOD STATED ABOVE AND IF EXCEEDED THE VEHICLE WILL BE CONSIDERED AS STOLEN AND MATTER WILL BE REPORTED TO THE POLICE AS UNLAWFUL USE OF MOTORVEHICLE, CAUSING OFFENCE";
  doc.text(doc.splitTextToSize(footerNote, pageWidth - 30), 15, yPos);

  // New Page for Conditions
  doc.addPage();
  yPos = 20;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("JUSTICE CORPORATE LOGISTICS KENYA CONDITIONS", pageWidth / 2, yPos, { align: "center" });
  yPos += 15;

  const conditions = [
    { t: "1. Vehicle Hire & Ownership", c: "The Company agrees to let on hire, and the Hirer agrees to take on hire, the motor vehicle described in the Vehicle Details Form, together with all accessories, tools, tyres, and fittings ('the Vehicle'). The Vehicle remains the sole property of the Company at all times." },
    { t: "2. Duration & Return", c: "The hire period shall be as stated in the Hire Form. The Vehicle must be returned on the agreed date and time unless an extension is approved in writing. Unauthorized retention beyond the agreed period constitutes an offence and entitles the Company to repossess the Vehicle and charge full daily rates plus recovery expenses. Vehicles must be returned during business hours or by prior arrangement." },
    { t: "3. Condition & Inspection", c: "The Hirer confirms receipt of the Vehicle in good, roadworthy condition. Photos may be taken before release to document existing body condition. The Hirer shall return the Vehicle in the same condition, fair wear and tear excepted. Any damage, missing items, or unreported defects will be charged to the Hirer." },
    { t: "4. Use & Conduct", c: "a) To operate the Vehicle safely, lawfully, and only for social, personal, or authorized business use. b) Not to carry fare-paying passengers, overload, tow, race, or drive off-road (unless permitted). c) To keep the Vehicle locked and secured when unattended. d) Not to take the Vehicle outside Kenya without prior written consent. e) To maintain normal checks on fuel, oil, coolant, and tyre pressure. f) Not to modify, repair, or tamper with the Vehicle without authorization." },
    { t: "5. Drivers", c: "Self-drive vehicles may only be driven by the Hirer or an authorized driver named in the agreement. Each driver must hold a valid driver's licence for at least 3 years and be aged between 23 and 70 years. Driving under the influence of alcohol, drugs, or impairing substances is strictly prohibited." },
    { t: "6. Insurance & Liability (Comprehensive)", c: "The vehicle is insured under Comprehensive insurance cover. The Hirer shall be fully liable for any damage up to the excess amount applicable to the specific vehicle category. If repair cost exceeds the excess, the Hirer pays up to the excess limit and the insurance covers the remaining balance. Excess levels: Saloon: 200,000 - Mid SUV: 300,000 - SUV / 4x4: 500,000. Insurance excludes tyres, glass, mirrors, interior, and all removable items. Accidents must be reported within 24 hours." },
    { t: "7. Chauffeur Hire (If Applicable)", c: "The Company shall provide a qualified driver. The Hirer shall be responsible for fuel, car wash, parking, and gate fees during hire. In case of breakdown: If >5 days remain, Company provides replacement. If <5 days remain, 75% refund is made. Driver must not be directed to violate laws." },
    { t: "8. Fuel Policy", c: "The Vehicle shall be supplied with a full tank or marked fuel level. It must be returned with the same fuel level. Any shortage shall be charged at current pump rates plus a Ksh. 1,000 service fees." },
    { t: "9. Deposit & Payment", c: "Full hire payment plus a refundable security deposit (Ksh. 5,000-15,000 depending on vehicle class) shall be made before release. Unpaid balances attract interest." },
    { t: "10. Fines, Penalties & Damage", c: "The Hirer is responsible for all traffic or parking fines. Any unpaid fine will incur an additional Ksh. 5,000 administrative fees. Costs for damaged rims, burst tyres, broken glass, or missing accessories are fully chargeable." },
    { t: "11. Cancellation & Refunds", c: "Cancellations made after booking confirmation attract a 75% cancellation fee. Refunds, where applicable, are processed within three (3) working days." },
    { t: "12. Dispute Resolution", c: "All disputes arising under or in connection with this Agreement shall be subject to the exclusive jurisdiction of the Courts of Kenya." },
    { t: "13. Acknowledgment", c: "By signing below, the Hirer acknowledges receipt of the Vehicle in good condition and accepts full responsibility for it from the time of release until its official return to Justice Corporate Logistics Kenya Car Rental Services." }
  ];

  doc.setFontSize(8.5);
  conditions.forEach(item => {
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.text(item.t, 15, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    const splitText = doc.splitTextToSize(item.c, pageWidth - 30);
    doc.text(splitText, 15, yPos);
    yPos += (splitText.length * 4) + 6;
  });

  yPos += 5;
  doc.setFontSize(8);
  doc.text(`Hirer's Full Name: ${order.customer_name.toUpperCase()}`, 15, yPos);
  doc.text(`National ID / Passport: ____________________`, pageWidth / 2, yPos);
  yPos += 5;
  doc.text(`Address: ${order.pickup_location || "____________________"}`, 15, yPos);
  doc.text(`Phone: ${order.customer_phone}`, pageWidth / 2, yPos);
  yPos += 10;
  doc.text(`Signature: ____________________ Date: ${today}`, 15, yPos);

  yPos += 15;
  doc.text("For Justice Corporate Logistics Kenya Car Rental Services:", 15, yPos);
  yPos += 8;
  doc.text("Name: ____________________ Signature: ____________________  Date: ____________________", 15, yPos);

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(220, 38, 38);
    doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);
    doc.setTextColor(100);
    doc.setFontSize(7);
    doc.text(`© 2026 Justice Corporate Logistics Kenya | www.justicecorporatelogistics.co.ke`, 15, pageHeight - 10);
    doc.text(`Muthithi Rd, Westlands, Nairobi | Page ${i} of ${totalPages}`, pageWidth - 15, pageHeight - 10, { align: "right" });
  }

  doc.save(`JCL_Agreement_${order.customer_name.replace(/\s+/g, '_')}_${contractCounter}.pdf`);
};
