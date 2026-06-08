"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { useAdminStore, getSubcategoriesByCategoryId } from "@/lib/admin-store";
import { PURITY, METAL_TYPES, fmt, uid } from "@/lib/data";
import { hasPermission, getActiveRole } from "@/lib/permissions";

type Toast = { id: string; type: "success" | "error" | "info"; title: string; message?: string };

function Toasts({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div style={{ position: "fixed", right: 16, top: 16, zIndex: 2000, display: "flex", flexDirection: "column", gap: 10 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            width: 340,
            borderRadius: 14,
            border: "1px solid var(--line)",
            background:
              t.type === "success"
                ? "rgba(34,197,94,.12)"
                : t.type === "error"
                  ? "rgba(239,68,68,.12)"
                  : "rgba(56,189,248,.10)",
            boxShadow: "var(--shadow)",
            padding: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ color: "var(--text)", fontWeight: 800, fontSize: 13 }}>{t.title}</div>
              {t.message && <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 4, lineHeight: 1.4 }}>{t.message}</div>}
            </div>
            <button
              onClick={() => onDismiss(t.id)}
              style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 16, lineHeight: 1 }}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon?: string; children: React.ReactNode }) {
  return (
    <div className="panel-bg" style={{ padding: 18, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {icon ? (
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "linear-gradient(135deg,rgba(212,175,55,.2),rgba(212,175,55,.05))",
                border: "1px solid rgba(212,175,55,.2)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <i className={"fa-solid " + icon} style={{ color: "var(--gold)", fontSize: 18 }} />
            </div>
          ) : null}
          <h2 className="font-playfair" style={{ fontSize: 16 }}>
            {title}
          </h2>
        </div>
      </div>
      {children}
    </div>
  );
}

function Breadcrumbs() {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ color: "var(--muted)", fontSize: 12 }}>
          <i className="fa-solid fa-house" style={{ marginRight: 8 }} /> Admin
        </div>
        <div style={{ color: "var(--muted)", fontSize: 12 }}>/</div>
        <div style={{ color: "var(--gold)", fontSize: 12, fontWeight: 800 }}>Products</div>
        <div style={{ color: "var(--muted)", fontSize: 12 }}>/</div>
        <div style={{ color: "var(--text)", fontSize: 12, fontWeight: 800 }}>Create</div>
      </div>
    </div>
  );
}

function DragDropImages({
  label,
  onFiles,
  limit,
}: {
  label: string;
  onFiles: (files: File[]) => void;
  limit: number;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  return (
    <div>
      <div
        style={{
          border: "1px dashed var(--line)",
          borderRadius: 12,
          padding: 16,
          textAlign: "center",
          color: "var(--muted)",
          fontSize: 13,
          cursor: "pointer",
          background: dragOver ? "rgba(212,175,55,.08)" : "transparent",
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const files = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith("image/"));
          if (files.length === 0) return;
          onFiles(files.slice(0, limit));
        }}
        onClick={() => inputRef.current?.click()}
      >
        <i className="fa-solid fa-cloud-upload-alt" style={{ fontSize: 24, marginBottom: 8, display: "block", color: "var(--gold)" }} />
        {label}
        <div style={{ marginTop: 6, color: "var(--muted)", fontSize: 12 }}>
          Drag & drop or click to upload (max {limit}).
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={(e) => {
          const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith("image/"));
          if (files.length === 0) return;
          onFiles(files.slice(0, limit));
        }}
      />
    </div>
  );
}

function money(n: number) {
  return fmt(Number.isFinite(n) ? n : 0);
}

export default function ProductCreatePage() {
  const router = useRouter();
  const { categories, subcategories, addProduct } = useAdminStore();

  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = (t: Omit<Toast, "id">) => {
    const id = uid("TOAST");
    const toast: Toast = { id, ...t };
    setToasts((prev) => [toast, ...prev].slice(0, 3));
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 2800);
  };

  const dismissToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  useEffect(() => {
    if (!hasPermission("PRODUCT_CREATE")) {
      pushToast({ type: "error", title: "Permission denied", message: "You don't have access to create products." });
      router.replace("/products");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Product form state - using categoryId/subCategoryId (IDs, not names)
  const [form, setForm] = useState({
    name: "",
    sku: "",
    productCode: "",
    categoryId: "",
    subCategoryId: "",
    brand: "",
    status: "Active" as "Active" | "Inactive" | "Draft",
    description: "",
    shortDescription: "",

    metalType: "Silver",
    purity: "925",
    grossWeight: 0,
    netWeight: 0,
    stoneWeight: 0,

    makingCharges: 0,
    wastageCharges: 0,
    stoneCharges: 0,
    customCharges: 0,
    gstPercentage: 3,

    stockQty: 0,
    reorderLevel: 0,
    availabilityStatus: "Available",

    metaTitle: "",
    metaDescription: "",
    urlSlug: "",
  });

  // Dependent subcategory filtering
  const availableSubcats = useMemo(() => {
    if (!form.categoryId) return [];
    return getSubcategoriesByCategoryId(subcategories, form.categoryId);
  }, [form.categoryId, subcategories]);

  // Reset subCategoryId when category changes
  const handleCategoryChange = (categoryId: string) => {
    setForm((prev) => ({ ...prev, categoryId, subCategoryId: "" }));
  };

  // Price calculation
  const price = useMemo(() => {
    const subtotal =
      Number(form.makingCharges || 0) +
      Number(form.wastageCharges || 0) +
      Number(form.stoneCharges || 0) +
      Number(form.customCharges || 0);
    const gstAmt = subtotal * (Number(form.gstPercentage || 0) / 100);
    return {
      subtotal,
      gstAmt,
      final: subtotal + gstAmt,
    };
  }, [form]);

  // Media
  const [mainImage, setMainImage] = useState<{ id: string; url: string }[]>([]);
  const [galleryImages, setGalleryImages] = useState<{ id: string; url: string }[]>([]);
  const [thumbnailImages, setThumbnailImages] = useState<{ id: string; url: string }[]>([]);
  const [activePreview, setActivePreview] = useState<string | null>(null);

  const createObjectUrl = (file: File) => URL.createObjectURL(file);

  useEffect(() => {
    return () => {
      [...mainImage, ...galleryImages, ...thumbnailImages].forEach((i) => {
        try {
          URL.revokeObjectURL(i.url);
        } catch {}
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Basic validation
  const validate = () => {
    const requiredFields: Array<[string, boolean]> = [
      ["Product Name", !!form.name.trim()],
      ["SKU", !!form.sku.trim()],
      ["Product Code", !!form.productCode.trim()],
      ["Product Category", !!form.categoryId],
      ["Product Sub Category", !!form.subCategoryId],
      ["Product Brand", !!form.brand.trim()],
      ["Product Description", !!form.description.trim()],
      ["Short Description", !!form.shortDescription.trim()],
    ];

    const missing = requiredFields.filter(([, ok]) => !ok).map(([label]) => label);
    if (missing.length) {
      pushToast({
        type: "error",
        title: "Validation error",
        message: "Missing: " + missing.join(", "),
      });
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validate()) return;

    addProduct({
      name: form.name.trim(),
      sku: form.sku.trim(),
      productCode: form.productCode.trim(),
      categoryId: form.categoryId,
      subCategoryId: form.subCategoryId,
      brand: form.brand.trim(),
      status: form.status,
      description: form.description.trim(),
      shortDescription: form.shortDescription.trim(),
      purity: form.purity,
      metalType: form.metalType,
      grossWeight: form.grossWeight,
      netWeight: form.netWeight,
      stoneWeight: form.stoneWeight,
      makingCharges: form.makingCharges,
      wastageCharges: form.wastageCharges,
      stoneCharges: form.stoneCharges,
      customCharges: form.customCharges,
      gstPercentage: form.gstPercentage,
      stockQty: form.stockQty,
      reorderLevel: form.reorderLevel,
      availabilityStatus: form.availabilityStatus,
      metaTitle: form.metaTitle,
      metaDescription: form.metaDescription,
      urlSlug: form.urlSlug,
      basePrice: price.final,
      image: "",
    });

    pushToast({ type: "success", title: "Product saved", message: "Product created successfully." });
    router.push("/products");
  };

  const canSave = hasPermission("PRODUCT_CREATE");

  return (
    <AdminLayout>
      <Toasts toasts={toasts} onDismiss={dismissToast} />

      <div style={{ marginBottom: 96 }}>
        <Breadcrumbs />

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 10,
          }}
        >
          <div>
            <h1 className="font-playfair" style={{ fontSize: 26 }}>Create Product</h1>
            <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>
              Role: <span style={{ color: "var(--gold)", fontWeight: 900 }}>{getActiveRole()}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div className="badge b-gold">Auto Price Enabled</div>
            <div className="badge b-instock">Live GST</div>
          </div>
        </div>

        {/* Product Information */}
        <SectionCard title="Product Information" icon="fa-gem">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <div className="field">
              <label>Product Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Classic Silver Ring" />
            </div>
            <div className="field">
              <label>SKU</label>
              <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="e.g. SR-001" />
            </div>
            <div className="field">
              <label>Product Code</label>
              <input value={form.productCode} onChange={(e) => setForm({ ...form, productCode: e.target.value })} placeholder="e.g. PRD-SIL-102" />
            </div>

            {/* Category - dependent dropdown */}
            <div className="field">
              <label>Product Category</label>
              <select value={form.categoryId} onChange={(e) => handleCategoryChange(e.target.value)}>
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub Category - filtered by selected category */}
            <div className="field">
              <label>Product Sub Category</label>
              <select value={form.subCategoryId} onChange={(e) => setForm({ ...form, subCategoryId: e.target.value })}>
                <option value="">Select Sub Category</option>
                {availableSubcats.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Product Brand</label>
              <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="e.g. Venus Silver" />
            </div>
            <div className="field">
              <label>Product Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "Active" | "Inactive" | "Draft" })}>
                <option>Active</option>
                <option>Inactive</option>
                <option>Draft</option>
              </select>
            </div>
          </div>

          {/* Navigate to subcategories page */}
          <div style={{ marginTop: 14, borderTop: "1px dashed var(--line)", paddingTop: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div style={{ color: "var(--muted)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>
                Sub Category Management
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => router.push("/subcategories")}
              >
                <i className="fa-solid fa-external-link-alt" /> Manage Sub Categories
              </button>
            </div>
            {form.categoryId && availableSubcats.length === 0 && (
              <div style={{ marginTop: 10, color: "var(--warning)", fontSize: 12 }}>
                <i className="fa-solid fa-triangle-exclamation" /> No sub categories found for this category. Please create one first.
              </div>
            )}
          </div>

          <div style={{ marginTop: 14 }} className="field">
            <label>Product Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} placeholder="Detailed product description" />
          </div>

          <div style={{ marginTop: 14 }} className="field">
            <label>Short Description</label>
            <textarea value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} rows={2} placeholder="Short product summary" />
          </div>
        </SectionCard>

        {/* Jewellery Details */}
        <SectionCard title="Jewellery Details" icon="fa-weight-hanging">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <div className="field">
              <label>Metal Type</label>
              <select value={form.metalType} onChange={(e) => setForm({ ...form, metalType: e.target.value })}>
                {METAL_TYPES.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Purity</label>
              <select value={form.purity} onChange={(e) => setForm({ ...form, purity: e.target.value })}>
                {PURITY.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Gross Weight (g)</label>
              <input type="number" value={form.grossWeight} onChange={(e) => setForm({ ...form, grossWeight: Number(e.target.value) })} />
            </div>
            <div className="field">
              <label>Net Weight (g)</label>
              <input type="number" value={form.netWeight} onChange={(e) => setForm({ ...form, netWeight: Number(e.target.value) })} />
            </div>
            <div className="field">
              <label>Stone Weight (g)</label>
              <input type="number" value={form.stoneWeight} onChange={(e) => setForm({ ...form, stoneWeight: Number(e.target.value) })} />
            </div>

            <div className="field">
              <label>Making Charges (₹)</label>
              <input type="number" value={form.makingCharges} onChange={(e) => setForm({ ...form, makingCharges: Number(e.target.value) })} />
            </div>
            <div className="field">
              <label>Wastage Charges (₹)</label>
              <input type="number" value={form.wastageCharges} onChange={(e) => setForm({ ...form, wastageCharges: Number(e.target.value) })} />
            </div>
            <div className="field">
              <label>Stone Charges (₹)</label>
              <input type="number" value={form.stoneCharges} onChange={(e) => setForm({ ...form, stoneCharges: Number(e.target.value) })} />
            </div>
            <div className="field">
              <label>Custom Charges (₹)</label>
              <input type="number" value={form.customCharges} onChange={(e) => setForm({ ...form, customCharges: Number(e.target.value) })} />
            </div>
            <div className="field">
              <label>GST Percentage (%)</label>
              <input type="number" value={form.gstPercentage} onChange={(e) => setForm({ ...form, gstPercentage: Number(e.target.value) })} />
            </div>
          </div>

          {/* Live price calculation */}
          <div style={{ marginTop: 16, border: "1px dashed rgba(212,175,55,.35)", borderRadius: 12, padding: 14, background: "rgba(212,175,55,.03)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--gold)", textTransform: "uppercase", letterSpacing: 1 }}>
                  <i className="fa-solid fa-calculator" style={{ marginRight: 8 }} /> Live Price Calculation
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>Auto-calculated subtotal, GST amount, and final price.</div>
              </div>
              <div className="badge b-gold">Final: {money(price.final)}</div>
            </div>

            <div style={{ marginTop: 12, background: "#0e0e12", border: "1px solid var(--line)", borderRadius: 10, padding: 14 }}>
              {[
                ["Making", form.makingCharges],
                ["Wastage", form.wastageCharges],
                ["Stone", form.stoneCharges],
                ["Custom", form.customCharges],
                ["Subtotal", price.subtotal],
                ["GST", price.gstAmt],
              ].map(([k, v]) => (
                <div
                  key={String(k)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "4px 0",
                    borderBottom: "1px solid rgba(255,255,255,.05)",
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "var(--muted)" }}>{String(k)}</span>
                  <span style={{ fontWeight: 700 }}>{money(Number(v))}</span>
                </div>
              ))}

              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0", fontSize: 16, fontWeight: 900 }}>
                <span style={{ color: "var(--gold)" }}>Final Price</span>
                <span style={{ color: "var(--gold)" }}>{money(price.final)}</span>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Media */}
        <SectionCard title="Media" icon="fa-image">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            <div>
              <div style={{ marginBottom: 10, color: "var(--muted)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Main Image</div>
              <DragDropImages
                label="Upload Main Image"
                limit={1}
                onFiles={(files) => {
                  const file = files[0];
                  const url = createObjectUrl(file);
                  setMainImage([{ id: uid("IMG"), url }]);
                  setActivePreview(url);
                }}
              />
            </div>

            <div>
              <div style={{ marginBottom: 10, color: "var(--muted)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Gallery Images</div>
              <DragDropImages
                label="Upload Gallery"
                limit={6}
                onFiles={(files) => {
                  const mapped = files.map((f) => ({ id: uid("G"), url: createObjectUrl(f) }));
                  setGalleryImages(mapped);
                  if (!activePreview && mapped[0]) setActivePreview(mapped[0].url);
                }}
              />
            </div>

            <div>
              <div style={{ marginBottom: 10, color: "var(--muted)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Thumbnail Image</div>
              <DragDropImages
                label="Upload Thumbnail"
                limit={1}
                onFiles={(files) => {
                  const file = files[0];
                  const url = createObjectUrl(file);
                  setThumbnailImages([{ id: uid("TH"), url }]);
                  if (!activePreview) setActivePreview(url);
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 14, alignItems: "start" }}>
              <div>
                <div style={{ color: "var(--muted)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Image Preview</div>
                <div style={{ border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden", background: "#0e0e12" }}>
                  <div style={{ height: 260, position: "relative" }}>
                    {activePreview ? (
                      <img src={activePreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "var(--muted)", fontSize: 13 }}>
                        Upload images to preview.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div style={{ color: "var(--muted)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Select Preview</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {[...mainImage, ...galleryImages, ...thumbnailImages].slice(0, 12).map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setActivePreview(img.url)}
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: 12,
                        border: activePreview === img.url ? "1px solid rgba(212,175,55,.65)" : "1px solid var(--line)",
                        background: activePreview === img.url ? "rgba(212,175,55,.08)" : "#0e0e12",
                        padding: 0,
                        cursor: "pointer",
                        overflow: "hidden",
                      }}
                      aria-label="Select image preview"
                    >
                      <img src={img.url} alt="thumb" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </button>
                  ))}
                  {[...mainImage, ...galleryImages, ...thumbnailImages].length === 0 ? (
                    <div style={{ color: "var(--muted)", fontSize: 13 }}>No images uploaded.</div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Inventory */}
        <SectionCard title="Inventory" icon="fa-warehouse">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <div className="field">
              <label>Stock Quantity</label>
              <input type="number" value={form.stockQty} onChange={(e) => setForm({ ...form, stockQty: Number(e.target.value) })} />
            </div>
            <div className="field">
              <label>Reorder Level</label>
              <input type="number" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: Number(e.target.value) })} />
            </div>
            <div className="field">
              <label>Availability Status</label>
              <select value={form.availabilityStatus} onChange={(e) => setForm({ ...form, availabilityStatus: e.target.value })}>
                <option>Available</option>
                <option>Out of Stock</option>
                <option>Preorder</option>
              </select>
            </div>
          </div>
        </SectionCard>

        {/* SEO */}
        <SectionCard title="SEO" icon="fa-globe">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            <div className="field">
              <label>Meta Title</label>
              <input value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} placeholder="SEO title" />
            </div>
            <div className="field">
              <label>Meta Description</label>
              <input value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} placeholder="SEO description" />
            </div>
            <div className="field">
              <label>URL Slug</label>
              <input value={form.urlSlug} onChange={(e) => setForm({ ...form, urlSlug: e.target.value })} placeholder="e.g. classic-silver-ring-925" />
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Sticky Save Bar */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1200,
          padding: "14px 24px",
          background: "rgba(11,11,13,.85)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid var(--line)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn btn-ghost" onClick={() => router.push("/products")}>
            Cancel
          </button>
          <button
            className="btn btn-gold"
            onClick={handleSave}
            disabled={!canSave}
            style={{ opacity: canSave ? 1 : 0.6, cursor: canSave ? "pointer" : "not-allowed" }}
          >
            <i className="fa-solid fa-save" /> Save Product
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
