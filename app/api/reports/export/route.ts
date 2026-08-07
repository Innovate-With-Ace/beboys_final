// app/api/admin/reports/export/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateUser } from "@/auth-guard";
import { supabaseAdmin } from "@/lib/supabase/server";
import * as XLSX from "xlsx";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

type ExportRow = {
  order_id: string;
  date: string;
  dish: string;
  quantity: number;
  price: number;
  total: number;
  status: string;
};

export async function GET(req: NextRequest) {
  try {
    const { error: authError } = await validateUser(["org:admin"]);
    if (authError) return authError;

    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "csv";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let query = supabaseAdmin
      .from("orders")
      .select(
        "id, created_at, status, items:order_items(name, quantity, price)",
      )
      .order("created_at", { ascending: true });

    if (startDate) query = query.gte("created_at", startDate);
    if (endDate) query = query.lte("created_at", endDate);

    const { data: orders, error: ordersError } = await query;

    if (ordersError) {
      return NextResponse.json({ error: ordersError.message }, { status: 500 });
    }

    const reportData: ExportRow[] = (orders ?? []).flatMap((order) =>
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

    if (reportData.length === 0) {
      return NextResponse.json(
        { error: "No data found for this range." },
        { status: 404 },
      );
    }

    if (format === "csv") {
      const headers = Object.keys(reportData[0]) as (keyof ExportRow)[];
      const csvRows = [
        headers.join(","),
        ...reportData.map((row) =>
          headers
            .map((field) => `"${String(row[field]).replace(/"/g, '""')}"`)
            .join(","),
        ),
      ];

      return new NextResponse(csvRows.join("\n"), {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="report.csv"`,
        },
      });
    }

    if (format === "excel") {
      const worksheet = XLSX.utils.json_to_sheet(reportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report Data");

      const excelBuffer = XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
      });

      return new NextResponse(excelBuffer, {
        status: 200,
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="report.xlsx"`,
        },
      });
    }

    if (format === "pdf") {
      const pdfDoc = await PDFDocument.create();
      let page = pdfDoc.addPage([600, 800]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const { height } = page.getSize();
      let currentY = height - 50;

      page.drawText("Sales Report & Analytics", {
        x: 50,
        y: currentY,
        size: 20,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      currentY -= 30;

      if (startDate || endDate) {
        page.drawText(`Date Range: ${startDate ?? "-"} to ${endDate ?? "-"}`, {
          x: 50,
          y: currentY,
          size: 12,
          font,
        });
        currentY -= 30;
      }

      currentY -= 10;

      for (const row of reportData) {
        const rowText = `${row.date} | ${row.dish} x${row.quantity} | PHP ${row.total.toFixed(2)} | ${row.status}`;
        page.drawText(rowText, { x: 50, y: currentY, size: 10, font });
        currentY -= 18;

        if (currentY < 50) {
          page = pdfDoc.addPage([600, 800]);
          currentY = height - 50;
        }
      }

      const pdfBytes = await pdfDoc.save();

      return new NextResponse(pdfBytes as any, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="report.pdf"`,
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
