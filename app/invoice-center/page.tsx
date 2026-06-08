"use client";
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { ORDERS, fmt } from "@/lib/data";

const BUSINESS = {
  name: "Venus Silver Jewellery",
  address: "59E, Ramalinga Nagar, Anaiyar, Madurai – 625017",
  phone: "7338834666",
  email: "admin@venussilver.in",
  gst: "33AABCV1234K1Z5",
};

function generateInvoiceHTML(order: typeof ORDERS[0], type: "invoice" | "receipt") {
  const isInvoice = type === "invoice";
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${isInvoice ? "Invoice" : "Receipt"} - ${order.id}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Arial', sans-serif; background: #fff; color: #111; padding: 0; }
  .invoice { max-width: 800px; margin: 0 auto; padding: 40px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #a07d2c; padding-bottom: 20px; margin-bottom: 24px; }
  .logo-area h1 { font-family: Georgia, serif; font-size: 26px; color: #a07d2c; letter-spacing: 1px; }
  .logo-area p { font-size: 12px; color: #555; margin-top: 4px; line-height: 1.6; }
  .inv-label { text-align: right; }
  .inv-label h2 { font-size: 32px; font-weight: 900; color: #a07d2c; letter-spacing: 3px; }
  .inv-label p { font-size: 13px; color: #555; margin-top: 4px; }
  .details { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
  .box { background: #faf3df; border: 1px solid #e4d9b8; border-radius: 8px; padding: 14px; }
  .box h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #7a5d22; margin-bottom: 8px; }
  .box p { font-size: 13px; color: #333; line-height: 1.6; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
  th { background: #faf3df; color: #7a5d22; padding: 10px 12px; text-align: left; font-size: 11px; letter-spacing: 1px; border-bottom: 2px solid #e4d9b8; }
  td { padding: 10px 12px; border-bottom: 1px solid #e4d9b8; }
  .totals { width: 300px; margin-left: auto; border: 1px solid #e4d9b8; border-radius: 8px; overflow: hidden; }
  .totals table { margin: 0; }
  .totals td { padding: 8px 12px; }
  .grand { background: #a07d2c; color: #fff !important; font-weight: 700; font-size: 15px; }
  .grand td { color: #fff !important; }
  .footer { margin-top: 32px; display: flex; justify-content: space-between; align-items: flex-end; padding-top: 20px; border-top: 2px solid #e4d9b8; }
  .terms { font-size: 11px; color: #777; max-width: 400px; line-height: 1.6; }
  .sign { text-align: center; }
  .sign .line { width: 140px; border-bottom: 1px solid #333; margin: 0 auto 6px; }
  .sign p { font-size: 11px; color: #555; }
  .qr { width: 70px; height: 70px; background: #f0e8cf; border: 1px solid #e4d9b8; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #aaa; border-radius: 6px; }
  @media print { body { padding: 0; } .invoice { padding: 20px; } }
</style>
</head>
<body>
<div class="invoice">
  <div class="header">
    <div class="logo-area">
      <h1>VENUS SILVER JEWELLERY</h1>
      <p>${BUSINESS.address}<br>Phone: ${BUSINESS.phone}<br>Email: ${BUSINESS.email}<br>GSTIN: ${BUSINESS.gst}</p>
    </div>
    <div class="inv-label">
      <h2>${isInvoice ? "INVOICE" : "RECEIPT"}</h2>
      <p><strong>#${order.id}</strong><br>Date: ${order.orderDate}</p>
    </div>
  </div>

  <div class="details">
    <div class="box">
      <h4>Bill To</h4>
      <p><strong>${order.customerName}</strong><br>${order.phone}<br>${order.address}</p>
    </div>
    <div class="box">
      <h4>Order Details</h4>
      <p>Payment: ${order.payment}<br>Delivery: ${order.delivery}<br>Status: ${order.status}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr><th>#</th><th>Product Description</th><th>Qty</th><th>Unit Price</th><th>Amount</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td><strong>${order.productName}</strong><br><span style="font-size:11px;color:#666">Silver Jewellery</span></td>
        <td>${order.qty}</td>
        <td>${fmt(order.amount / order.qty)}</td>
        <td>${fmt(order.amount)}</td>
      </tr>
    </tbody>
  </table>

  <div class="totals">
    <table>
      <tr><td>Subtotal</td><td style="text-align:right">${fmt(order.amount)}</td></tr>
      <tr><td>GST @ 3%</td><td style="text-align:right">${fmt(order.gst)}</td></tr>
      <tr><td>Discount</td><td style="text-align:right">—</td></tr>
      <tr class="grand"><td><strong>TOTAL</strong></td><td style="text-align:right"><strong>${fmt(order.total)}</strong></td></tr>
    </table>
  </div>

  <div class="footer">
    <div>
      <div class="terms">
        <strong>Terms & Conditions:</strong><br>
        1. All jewellery is BIS Hallmarked unless otherwise stated.<br>
        2. Returns/exchanges accepted within 7 days with original receipt.<br>
        3. This is a computer-generated ${isInvoice ? "invoice" : "receipt"}.<br>
        4. Gold/Silver rates are as per the date of purchase.<br>
        5. Subject to Madurai jurisdiction.
      </div>
    </div>
    <div style="display:flex;gap:24px;align-items:flex-end">
      <div class="qr">QR Code</div>
      <div class="sign">
        <div class="line"></div>
        <p>Authorized Signature<br><strong>Venus Silver Jewellery</strong></p>
      </div>
    </div>
  </div>
</div>
</body>
</html>`;
}

export default function InvoiceCenterPage() {
  const [search, setSearch] = useState("");
  const [previewOrder, setPreviewOrder] = useState<typeof ORDERS[0] | null>(null);
  const [previewType, setPreviewType] = useState<"invoice" | "receipt">("invoice");

  const filtered = ORDERS.filter(o =>
    !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const downloadPDF = (order: typeof ORDERS[0], type: "invoice" | "receipt") => {
    const html = generateInvoiceHTML(order, type);
    const w = window.open("", "_blank")!;
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  const preview = (order: typeof ORDERS[0], type: "invoice" | "receipt") => {
    setPreviewOrder(order);
    setPreviewType(type);
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="font-playfair" style={{ fontSize: 26 }}>Invoice Center</h1>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>Download professional invoices & receipts</div>
        </div>
      </div>

      {/* Info Banner */}
      <div style={{ background: "rgba(212,175,55,.08)", border: "1px solid rgba(212,175,55,.2)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <i className="fa-solid fa-file-invoice" style={{ color: "var(--gold)", fontSize: 20 }} />
          <div>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>Venus Silver Jewellery · {BUSINESS.address}</div>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>GSTIN: {BUSINESS.gst} · Phone: {BUSINESS.phone}</div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID or customer..." style={{ width: "100%", maxWidth: 440, background: "#0e0e12", border: "1px solid var(--line)", color: "var(--text)", padding: "9px 12px", borderRadius: 9, fontSize: 13, outline: "none" }} />
      </div>

      <div className="panel-bg">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th>Invoice</th><th>Receipt</th></tr></thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id}>
                  <td style={{ color: "var(--gold)", fontWeight: 600 }}>{o.id}</td>
                  <td><div style={{ fontWeight: 500 }}>{o.customerName}</div><div style={{ fontSize: 11, color: "var(--muted)" }}>{o.phone}</div></td>
                  <td style={{ color: "var(--muted)", fontSize: 12 }}>{o.orderDate}</td>
                  <td style={{ color: "var(--gold)", fontWeight: 600 }}>{fmt(o.total)}</td>
                  <td><span className={`badge b-${o.status.toLowerCase()}`}>{o.status}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-sm" style={{ background: "rgba(212,175,55,.1)", color: "var(--gold)", border: "1px solid rgba(212,175,55,.3)", padding: "5px 10px" }} onClick={() => preview(o, "invoice")}>
                        <i className="fa-solid fa-eye" style={{ fontSize: 11 }} /> Preview
                      </button>
                      <button className="btn btn-gold btn-sm" onClick={() => downloadPDF(o, "invoice")}>
                        <i className="fa-solid fa-download" style={{ fontSize: 11 }} /> Download
                      </button>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-sm" style={{ background: "rgba(56,189,248,.08)", color: "var(--info)", border: "1px solid rgba(56,189,248,.2)", padding: "5px 10px" }} onClick={() => preview(o, "receipt")}>
                        <i className="fa-solid fa-eye" style={{ fontSize: 11 }} /> Preview
                      </button>
                      <button className="btn btn-sm" style={{ background: "rgba(56,189,248,.15)", color: "var(--info)", border: "1px solid rgba(56,189,248,.3)" }} onClick={() => downloadPDF(o, "receipt")}>
                        <i className="fa-solid fa-download" style={{ fontSize: 11 }} /> Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {previewOrder && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 1000, padding: "20px 16px", overflowY: "auto" }}>
          <div style={{ width: "min(900px,100%)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ color: "#fff", fontWeight: 600 }}>{previewType === "invoice" ? "Invoice" : "Receipt"} Preview — {previewOrder.id}</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-gold btn-sm" onClick={() => downloadPDF(previewOrder, previewType)}><i className="fa-solid fa-download" /> Download PDF</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setPreviewOrder(null)}>Close</button>
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden" }}>
              <iframe
                srcDoc={generateInvoiceHTML(previewOrder, previewType)}
                style={{ width: "100%", height: 680, border: "none" }}
                title="Invoice Preview"
              />
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
