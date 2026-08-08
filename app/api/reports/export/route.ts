// app/api/reports/export/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateUser } from "@/auth-guard";
import { supabaseAdmin } from "@/lib/supabase/server";
import * as XLSX from "xlsx";
import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage } from "pdf-lib";

// --- Types ---
type RawOrderRow = {
  order_id: string;
  date: string;
  dish: string;
  quantity: number;
  price: number;
  total: number;
  status: string;
};
type RevenueTimeRow = { day: string; revenue: number; order_count: number };
type BestSellerRow = {
  dish_id: string;
  name: string;
  total_sold: number;
  total_revenue: number;
};
type CategoryRow = {
  category_id: string;
  category_name: string;
  total_sold: number;
  total_revenue: number;
};
type VolumeRow = { hour: number; order_count: number };
type StatusRow = { status: string; order_count: number; percent: number };
type SummaryRow = {
  aov: number;
  completed_order_count: number;
  total_revenue: number;
  fulfillment_rate: number;
};

export async function GET(req: NextRequest) {
  try {
    // 1. Auth check
    const { error: authError } = await validateUser(["org:admin"]);
    if (authError) return authError;

    // 2. Parse Query Params
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "csv";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // ----------------------------------------------------------------------
    // 3. DATA FETCHING
    // ----------------------------------------------------------------------

    // Raw order-level rows (flattened order_items), respects date range
    let rawOrdersQuery = supabaseAdmin
      .from("orders")
      .select(
        "id, created_at, status, items:order_items(name, quantity, price)",
      )
      .order("created_at", { ascending: true });

    if (startDate) rawOrdersQuery = rawOrdersQuery.gte("created_at", startDate);
    if (endDate) rawOrdersQuery = rawOrdersQuery.lte("created_at", endDate);

    const { data: rawOrders, error: rawOrdersError } = await rawOrdersQuery;
    if (rawOrdersError) {
      return NextResponse.json(
        { error: rawOrdersError.message },
        { status: 500 },
      );
    }

    const rawOrderData: RawOrderRow[] = (rawOrders ?? []).flatMap((order) =>
      (order.items ?? []).map((item) => ({
        order_id: order.id,
        date: new Date(order.created_at).toLocaleString(),
        dish: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
        status: order.status,
      })),
    );

    // Revenue over time, respects date range (view already converts to Asia/Manila)
    let revenueQuery = supabaseAdmin
      .from("revenue_over_time")
      .select("*")
      .order("day", { ascending: true });

    if (startDate) revenueQuery = revenueQuery.gte("day", startDate);
    if (endDate) revenueQuery = revenueQuery.lte("day", endDate);

    const { data: revenueData, error: revenueError } = await revenueQuery;
    if (revenueError) {
      return NextResponse.json(
        { error: revenueError.message },
        { status: 500 },
      );
    }
    const revenueOverTime: RevenueTimeRow[] = revenueData ?? [];

    // Best sellers (all-time, no date filter — matches existing dashboard behavior)
    const { data: bestSellerData, error: bestSellerError } = await supabaseAdmin
      .from("best_selling_dishes")
      .select("*")
      .limit(20);
    if (bestSellerError) {
      return NextResponse.json(
        { error: bestSellerError.message },
        { status: 500 },
      );
    }
    const bestSellers: BestSellerRow[] = bestSellerData ?? [];

    // Sales by category (all-time)
    const { data: categoryData, error: categoryError } = await supabaseAdmin
      .from("sales_by_category")
      .select("*");
    if (categoryError) {
      return NextResponse.json(
        { error: categoryError.message },
        { status: 500 },
      );
    }
    const categorySales: CategoryRow[] = categoryData ?? [];

    // Order volume by hour (all-time)
    const { data: volumeData, error: volumeError } = await supabaseAdmin
      .from("order_volume_by_hour")
      .select("*")
      .order("hour", { ascending: true });
    if (volumeError) {
      return NextResponse.json({ error: volumeError.message }, { status: 500 });
    }
    const orderVolume: VolumeRow[] = volumeData ?? [];

    // Order status breakdown (all-time)
    const { data: statusData, error: statusError } = await supabaseAdmin
      .from("order_status_breakdown")
      .select("*");
    if (statusError) {
      return NextResponse.json({ error: statusError.message }, { status: 500 });
    }
    const statusBreakdown: StatusRow[] = statusData ?? [];

    // Average order value / summary
    const { data: aovData, error: aovError } = await supabaseAdmin
      .from("average_order_value")
      .select("*")
      .single();
    if (aovError) {
      return NextResponse.json({ error: aovError.message }, { status: 500 });
    }

    const totalOrders = statusBreakdown.reduce(
      (sum, s) => sum + s.order_count,
      0,
    );
    const completedCount =
      statusBreakdown.find((s) => s.status === "completed")?.order_count ?? 0;
    const fulfillmentRate =
      totalOrders > 0 ? (completedCount / totalOrders) * 100 : 0;

    const summaryData: SummaryRow = {
      aov: aovData?.aov ?? 0,
      completed_order_count: aovData?.completed_order_count ?? 0,
      total_revenue: aovData?.total_revenue ?? 0,
      fulfillment_rate: fulfillmentRate,
    };

    // ----------------------------------------------------------------------
    // FORMAT: CSV
    // ----------------------------------------------------------------------
    if (format === "csv") {
      if (rawOrderData.length === 0)
        return NextResponse.json({ error: "No data found." }, { status: 404 });

      const headers = Object.keys(rawOrderData[0]) as (keyof RawOrderRow)[];
      const csvRows = [
        headers.join(","),
        ...rawOrderData.map((row) =>
          headers
            .map((field) => `"${String(row[field]).replace(/"/g, '""')}"`)
            .join(","),
        ),
      ];

      return new NextResponse(csvRows.join("\n"), {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="export.csv"`,
        },
      });
    }

    // ----------------------------------------------------------------------
    // FORMAT: EXCEL
    // ----------------------------------------------------------------------
    if (format === "excel") {
      const wb = XLSX.utils.book_new();

      // Sheet 1: Order Details
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(rawOrderData),
        "Order Details",
      );

      // Sheet 2: Revenue Over Time
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(revenueOverTime),
        "Revenue Over Time",
      );

      // Sheet 3: Best Sellers
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(bestSellers),
        "Best Sellers",
      );

      // Sheet 4: Sales by Category
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(categorySales),
        "Sales by Category",
      );

      // Sheet 5: Summary (Key-Value format)
      const summarySheetData = [
        { Metric: "Total Revenue", Value: summaryData.total_revenue },
        {
          Metric: "Total Completed Orders",
          Value: summaryData.completed_order_count,
        },
        { Metric: "Average Order Value (AOV)", Value: summaryData.aov },
        { Metric: "Fulfillment Rate (%)", Value: summaryData.fulfillment_rate },
      ];
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(summarySheetData),
        "Summary",
      );

      const excelBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

      return new NextResponse(excelBuffer, {
        status: 200,
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="export.xlsx"`,
        },
      });
    }

    // ----------------------------------------------------------------------
    // FORMAT: PDF
    // ----------------------------------------------------------------------
    if (format === "pdf") {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const PAGE_WIDTH = 600;
      const PAGE_HEIGHT = 800;
      const primaryColor = rgb(0.15, 0.45, 0.75); // Clean blue
      const altBgColor = rgb(0.95, 0.95, 0.95); // Light gray for tables

      // --- PAGE 1: Summary / KPIs ---
      let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      let currentY = PAGE_HEIGHT - 50;

      page.drawText("Sales & Analytics Report", {
        x: 50,
        y: currentY,
        size: 20,
        font: boldFont,
      });
      currentY -= 25;
      page.drawText(
        `Date Range: ${startDate || "All Time"} to ${endDate || "Present"}`,
        { x: 50, y: currentY, size: 12, font },
      );
      currentY -= 60;

      // Draw KPI Blocks (2x2 Grid)
      drawKPIBlock(
        page,
        "Total Revenue",
        `PHP ${summaryData.total_revenue.toFixed(2)}`,
        50,
        currentY,
        230,
        80,
        font,
        boldFont,
      );
      drawKPIBlock(
        page,
        "Total Orders",
        `${summaryData.completed_order_count}`,
        300,
        currentY,
        230,
        80,
        font,
        boldFont,
      );
      currentY -= 100;
      drawKPIBlock(
        page,
        "Average Order Value",
        `PHP ${summaryData.aov.toFixed(2)}`,
        50,
        currentY,
        230,
        80,
        font,
        boldFont,
      );
      drawKPIBlock(
        page,
        "Fulfillment Rate",
        `${summaryData.fulfillment_rate.toFixed(1)}%`,
        300,
        currentY,
        230,
        80,
        font,
        boldFont,
      );

      // --- PAGE 2: Revenue Chart ---
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      page.drawText("Revenue Over Time", {
        x: 50,
        y: PAGE_HEIGHT - 50,
        size: 20,
        font: boldFont,
      });

      const revenueChartData = revenueOverTime.map((r) => ({
        label: r.day.substring(5, 10),
        value: r.revenue,
      })); // Use MM-DD for label
      drawVerticalBarChart(
        page,
        revenueChartData,
        50,
        PAGE_HEIGHT - 350,
        500,
        250,
        font,
        primaryColor,
      );

      // --- PAGE 3: Order Status Breakdown ---
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      page.drawText("Order Status Breakdown", {
        x: 50,
        y: PAGE_HEIGHT - 50,
        size: 20,
        font: boldFont,
      });

      const statusChartData = statusBreakdown.map((s) => ({
        label: s.status,
        value: s.percent,
        displayValue: `${s.percent.toFixed(1)}% (${s.order_count})`,
      }));
      drawHorizontalBarChart(
        page,
        statusChartData,
        50,
        PAGE_HEIGHT - 350,
        500,
        250,
        font,
        primaryColor,
      );

      // --- PAGE 4: Best Sellers ---
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      page.drawText("Best Selling Dishes", {
        x: 50,
        y: PAGE_HEIGHT - 50,
        size: 20,
        font: boldFont,
      });

      const bestSellerCols = [
        { title: "Dish Name", key: "name", width: 250, align: "left" as const },
        {
          title: "Units Sold",
          key: "total_sold",
          width: 100,
          align: "right" as const,
        },
        {
          title: "Revenue (PHP)",
          key: "total_revenue",
          width: 150,
          align: "right" as const,
        },
      ];
      page = await drawPaginatedTable(
        pdfDoc,
        page,
        font,
        boldFont,
        bestSellers,
        bestSellerCols,
        PAGE_HEIGHT - 90,
        altBgColor,
      );

      // --- PAGE 5: Sales by Category ---
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      page.drawText("Sales by Category", {
        x: 50,
        y: PAGE_HEIGHT - 50,
        size: 20,
        font: boldFont,
      });

      const categoryCols = [
        {
          title: "Category",
          key: "category_name",
          width: 250,
          align: "left" as const,
        },
        {
          title: "Units Sold",
          key: "total_sold",
          width: 100,
          align: "right" as const,
        },
        {
          title: "Revenue (PHP)",
          key: "total_revenue",
          width: 150,
          align: "right" as const,
        },
      ];
      await drawPaginatedTable(
        pdfDoc,
        page,
        font,
        boldFont,
        categorySales,
        categoryCols,
        PAGE_HEIGHT - 90,
        altBgColor,
      );

      const pdfBytes = await pdfDoc.save();

      return new NextResponse(pdfBytes as any, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="export.pdf"`,
        },
      });
    }

    return NextResponse.json(
      { error: "Invalid format requested." },
      { status: 400 },
    );
  } catch (err) {
    console.error("Export route error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// ----------------------------------------------------------------------
// PDF HELPER FUNCTIONS
// ----------------------------------------------------------------------

function drawKPIBlock(
  page: PDFPage,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
  height: number,
  font: PDFFont,
  boldFont: PDFFont,
) {
  page.drawRectangle({
    x,
    y: y - height,
    width,
    height,
    color: rgb(0.98, 0.98, 0.98),
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 1,
  });
  page.drawText(label, {
    x: x + 15,
    y: y - 25,
    size: 12,
    font,
    color: rgb(0.4, 0.4, 0.4),
  });
  page.drawText(value, {
    x: x + 15,
    y: y - 55,
    size: 20,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });
}

function drawVerticalBarChart(
  page: PDFPage,
  data: { label: string; value: number }[],
  x: number,
  y: number,
  width: number,
  height: number,
  font: PDFFont,
  color: any,
) {
  if (data.length === 0) {
    page.drawText("No data available for chart", {
      x: x + width / 2 - 50,
      y: y + height / 2,
      size: 12,
      font,
    });
    return;
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const barWidth = (width / data.length) * 0.7;
  const step = width / data.length;

  page.drawLine({
    start: { x, y },
    end: { x: x + width, y },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x, y },
    end: { x, y: y + height },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  data.forEach((d, i) => {
    const barHeight = (d.value / maxValue) * height;
    const barX = x + i * step + (step - barWidth) / 2;

    page.drawRectangle({
      x: barX,
      y,
      width: barWidth,
      height: barHeight,
      color,
    });

    page.drawText(d.label, { x: barX, y: y - 15, size: 8, font });

    const valText = d.value.toString();
    page.drawText(valText, { x: barX, y: y + barHeight + 5, size: 8, font });
  });
}

function drawHorizontalBarChart(
  page: PDFPage,
  data: { label: string; value: number; displayValue: string }[],
  x: number,
  y: number,
  width: number,
  height: number,
  font: PDFFont,
  color: any,
) {
  if (data.length === 0) return;

  const maxValue = 100;
  const step = height / data.length;
  const barHeight = step * 0.6;

  page.drawLine({
    start: { x, y },
    end: { x: x + width, y },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x, y },
    end: { x, y: y + height },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  data.forEach((d, i) => {
    const barWidth = (d.value / maxValue) * width;
    const barY = y + height - i * step - step + (step - barHeight) / 2;

    page.drawRectangle({
      x,
      y: barY,
      width: barWidth,
      height: barHeight,
      color,
    });

    page.drawText(d.label, {
      x: x - font.widthOfTextAtSize(d.label, 10) - 10,
      y: barY + barHeight / 2 - 3,
      size: 10,
      font,
    });

    page.drawText(d.displayValue, {
      x: x + barWidth + 10,
      y: barY + barHeight / 2 - 3,
      size: 10,
      font,
    });
  });
}

async function drawPaginatedTable(
  pdfDoc: PDFDocument,
  startPage: PDFPage,
  font: PDFFont,
  boldFont: PDFFont,
  data: any[],
  columns: {
    title: string;
    key: string;
    width: number;
    align: "left" | "right";
  }[],
  startY: number,
  altBgColor: any,
): Promise<PDFPage> {
  const ROW_HEIGHT = 20;
  const MARGIN_BOTTOM = 50;
  const START_X = 50;

  let page = startPage;
  let currentY = startY;

  const drawHeaders = () => {
    let currX = START_X;
    columns.forEach((col) => {
      const textWidth = boldFont.widthOfTextAtSize(col.title, 11);
      const xPos =
        col.align === "right" ? currX + col.width - textWidth : currX;
      page.drawText(col.title, {
        x: xPos,
        y: currentY,
        size: 11,
        font: boldFont,
      });
      currX += col.width;
    });
    currentY -= ROW_HEIGHT;
  };

  drawHeaders();

  for (let i = 0; i < data.length; i++) {
    if (currentY < MARGIN_BOTTOM) {
      page = pdfDoc.addPage([600, 800]);
      currentY = 800 - 50;
      drawHeaders();
    }

    const row = data[i];

    if (i % 2 !== 0) {
      const totalWidth = columns.reduce((sum, c) => sum + c.width, 0);
      page.drawRectangle({
        x: START_X - 5,
        y: currentY - 5,
        width: totalWidth + 10,
        height: ROW_HEIGHT,
        color: altBgColor,
      });
    }

    let currX = START_X;
    columns.forEach((col) => {
      let val = row[col.key];
      if (typeof val === "number") {
        val = Number.isInteger(val) ? val.toString() : val.toFixed(2);
      } else {
        val = String(val);
      }

      const textWidth = font.widthOfTextAtSize(val, 10);
      const xPos =
        col.align === "right" ? currX + col.width - textWidth : currX;

      page.drawText(val, { x: xPos, y: currentY, size: 10, font });
      currX += col.width;
    });

    currentY -= ROW_HEIGHT;
  }

  return page;
}
