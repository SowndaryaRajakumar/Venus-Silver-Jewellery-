"use client";

import AdminLayout from "@/components/AdminLayout";
import UploadZone from "@/components/custom-designs/UploadZone";
import StatusBadge from "@/components/custom-designs/StatusBadge";
import { uid, fmt } from "@/lib/data";
import { CATEGORIES, PURITY, METAL_TYPES } from "@/lib/data";
import type { CustomDesignFileType, CustomDesignStatus, UploadItem } from "@/lib/custom-designs";
import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const MAX_BUDGET = 100000000;

const schema = z.object({
  // customer
  customerName: z.string().min(2, "Customer name is required"),
  mobileNumber: z.string().min(10, "Mobile number is required"),
  email: z.string().email("Invalid email"),
  address: z.string().min(5, "Address is required"),

  // design
  designTitle: z.string().min(2, "Design title is required"),
  designCategory: z.string().min(2, "Design category is required"),
  jewelleryType: z.string().min(2, "Jewellery type is required"),
  preferredMetal: z.string().min(2, "Preferred metal is required"),
  purity: z.string().min(1, "Purity is required"),
  approxWeight: z.coerce.number().min(0.1, "Approx weight is required"),
  budgetRange: z.string().min(3, "Budget range is required"),
  budget: z.coerce.number().min(0, "Budget is required").max(MAX_BUDGET),
  designDescription: z.string().min(10, "Design description is required"),
});

type FormValues = z.infer<typeof schema>;

const defaultStatus: CustomDesignStatus = "Pending";

export default function CreateCustomDesignRequestPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerName: "",
      mobileNumber: "",
      email: "",
      address: "",
      designTitle: "",
      designCategory: "",
      jewelleryType: "",
      preferredMetal: "Silver",
      purity: "925",
      approxWeight: 0,
      budgetRange: "",
      budget: 0,
      designDescription: "",
    },
  });

  const [status, setStatus] = useState<CustomDesignStatus>(defaultStatus);

  const [referenceImages, setReferenceImages] = useState<UploadItem[]>([]);
  const [images, setImages] = useState<UploadItem[]>([]);
  const [sketches, setSketches] = useState<UploadItem[]>([]);
  const [cadImages, setCadImages] = useState<UploadItem[]>([]);
  const [pdfs, setPdfs] = useState<UploadItem[]>([]);

  // preview before submission
  const preview = useMemo(() => {
    const all = [...referenceImages, ...images, ...sketches, ...cadImages];
    return all.slice(0, 12);
  }, [referenceImages, images, sketches, cadImages]);

  useEffect(() => {
    setStatus(defaultStatus);
  }, []);

  const removeById = (arr: UploadItem[], setArr: (v: UploadItem[]) => void, id: string) => {
    setArr(arr.filter((x) => x.id !== id));
  };

  const onSubmit = (values: FormValues) => {
    // mock save
    const payload = {
      id: uid("CDR"),
      requestId: `CDR-${Math.floor(10000 + Math.random() * 90000)}`,
      ...values,
      status,
      createdAt: new Date().toISOString(),
      assignedStaff: "Unassigned",
      uploads: { images, sketches, cad: cadImages, pdfs, referenceImages },
    };

    // persist to localStorage for demo if desired
    const existing = typeof window !== "undefined" ? window.localStorage.getItem("vs_custom_designs") : null;
    const parsed = existing ? JSON.parse(existing) : [];
    window.localStorage.setItem("vs_custom_designs", JSON.stringify([payload, ...parsed]));

    router.push(`/custom-designs/${payload.id}`);
  };

  const budget = watch("budget");

  return (
    <AdminLayout>
      <div style={{ marginBottom: 20 }}>
        <h1 className="font-playfair" style={{ fontSize: 26 }}>
          Create Custom Design Request
        </h1>
        <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>
          Full-page form • RHF + Zod • Advanced drag & drop uploads
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16, alignItems: "start" }}>
          <div>
            <div className="panel-bg" style={{ padding: 18, marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, marginBottom: 14 }}>Customer Information</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
                <div className="field">
                  <label>Customer Name</label>
                  <input {...register("customerName")} placeholder="e.g. Meena Sundaram" />
                  {errors.customerName && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>{errors.customerName.message}</div>}
                </div>
                <div className="field">
                  <label>Mobile Number</label>
                  <input {...register("mobileNumber")} placeholder="e.g. 9876543210" />
                  {errors.mobileNumber && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>{errors.mobileNumber.message}</div>}
                </div>
                <div className="field">
                  <label>Email</label>
                  <input {...register("email")} placeholder="e.g. meena@example.com" />
                  {errors.email && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>{errors.email.message}</div>}
                </div>
                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label>Address</label>
                  <textarea {...register("address")} rows={3} placeholder="Full address" />
                  {errors.address && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>{errors.address.message}</div>}
                </div>
              </div>
            </div>

            <div className="panel-bg" style={{ padding: 18, marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, marginBottom: 14 }}>Design Information</h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label>Design Title</label>
                  <input {...register("designTitle")} placeholder="e.g. Temple Pendant Krishna" />
                  {errors.designTitle && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>{errors.designTitle.message}</div>}
                </div>

                <div className="field">
                  <label>Design Category</label>
                  <input {...register("designCategory")} placeholder="e.g. Temple Jewellery" />
                  {errors.designCategory && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>{errors.designCategory.message}</div>}
                </div>

                <div className="field">
                  <label>Jewellery Type</label>
                  <input {...register("jewelleryType")} placeholder="e.g. Pendant / Ring / Bangles" />
                  {errors.jewelleryType && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>{errors.jewelleryType.message}</div>}
                </div>

                <div className="field">
                  <label>Preferred Metal</label>
                  <select {...register("preferredMetal")}> 
                    {METAL_TYPES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  {errors.preferredMetal && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>{errors.preferredMetal.message}</div>}
                </div>

                <div className="field">
                  <label>Purity</label>
                  <select {...register("purity")}>
                    {PURITY.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  {errors.purity && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>{errors.purity.message}</div>}
                </div>

                <div className="field">
                  <label>Approx Weight (g)</label>
                  <input type="number" step="0.01" {...register("approxWeight", { valueAsNumber: true })} />
                  {errors.approxWeight && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>{errors.approxWeight.message}</div>}
                </div>

                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label>Budget Range</label>
                  <input {...register("budgetRange")} placeholder="e.g. ₹12,000 - ₹18,000" />
                  {errors.budgetRange && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>{errors.budgetRange.message}</div>}
                </div>

                <div className="field">
                  <label>Budget</label>
                  <input type="number" step="1" {...register("budget", { valueAsNumber: true })} />
                  {errors.budget && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>{errors.budget.message}</div>}
                </div>

                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label>Design Description</label>
                  <textarea {...register("designDescription")} rows={4} placeholder="Describe the design requirements" />
                  {errors.designDescription && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>{errors.designDescription.message}</div>}
                </div>
              </div>

              <div style={{ marginTop: 14, border: "1px dashed rgba(212,175,55,.35)", borderRadius: 12, padding: 14, background: "rgba(212,175,55,.03)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 12, color: "var(--gold)", textTransform: "uppercase", letterSpacing: 1 }}>
                      <i className="fa-solid fa-circle-info" style={{ marginRight: 8 }} /> Estimated Budget
                    </div>
                    <div style={{ marginTop: 4, color: "var(--muted)", fontSize: 12 }}>
                      This is a mock preview. Actual quotation handled by Admin workflow.
                    </div>
                  </div>
                  <div className="badge b-gold">{fmt(Number(budget || 0))}</div>
                </div>
              </div>
            </div>

            <div className="panel-bg" style={{ padding: 18, marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, marginBottom: 14 }}>Image & File Uploads</h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
                <div>
                  <UploadZone
                    title="Upload Reference Images"
                    kind="reference"
                    limit={6}
                    items={referenceImages}
                    onAdd={(newItems) => setReferenceImages((prev) => [...prev, ...newItems])}
                    onRemove={(id) => removeById(referenceImages, setReferenceImages, id)}
                  />
                </div>
                <div>
                  <UploadZone
                    title="Upload Multiple Images"
                    kind="images"
                    limit={6}
                    items={images}
                    onAdd={(newItems) => setImages((prev) => [...prev, ...newItems])}
                    onRemove={(id) => removeById(images, setImages, id)}
                  />
                </div>
                <div>
                  <UploadZone
                    title="Upload Sketches"
                    kind="sketches"
                    limit={6}
                    items={sketches}
                    onAdd={(newItems) => setSketches((prev) => [...prev, ...newItems])}
                    onRemove={(id) => removeById(sketches, setSketches, id)}
                  />
                </div>
                <div>
                  <UploadZone
                    title="Upload CAD Images"
                    kind="cad"
                    limit={6}
                    items={cadImages}
                    onAdd={(newItems) => setCadImages((prev) => [...prev, ...newItems])}
                    onRemove={(id) => removeById(cadImages, setCadImages, id)}
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <UploadZone
                    title="Upload PDF Files"
                    kind="pdf"
                    limit={3}
                    items={pdfs}
                    onAdd={(newItems) => setPdfs((prev) => [...prev, ...newItems])}
                    onRemove={(id) => removeById(pdfs, setPdfs, id)}
                  />
                </div>
              </div>

              <div style={{ marginTop: 14, borderTop: "1px solid var(--line)", paddingTop: 14 }}>
                <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                  Gallery Preview
                </div>

                {preview.length === 0 ? (
                  <div style={{ color: "var(--muted)", fontSize: 13 }}>Upload images to see preview.</div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
                    {preview.map((img) => (
                      <div
                        key={img.id}
                        style={{
                          border: "1px solid var(--line)",
                          borderRadius: 12,
                          overflow: "hidden",
                          background: "#0e0e12",
                        }}
                      >
                        <div style={{ height: 110 }}>
                          <img src={img.url} alt={img.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap", marginBottom: 40 }}>
              <button type="button" className="btn btn-ghost" onClick={() => router.push("/custom-designs")}>
                Cancel
              </button>
              <button type="submit" className="btn btn-gold">
                <i className="fa-solid fa-paper-plane" /> Submit Request
              </button>
            </div>
          </div>

          <div>
            <div className="panel-bg" style={{ padding: 18, position: "sticky", top: 24 }}>
              <h3 style={{ fontSize: 15, marginBottom: 14 }}>Submission Summary</h3>
              <div style={{ marginBottom: 12 }}>
                <div style={{ color: "var(--muted)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Current Status</div>
                <div style={{ marginTop: 8 }}>
                  <StatusBadge status={status} />
                </div>
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                <div style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 12, background: "#0e0e12" }}>
                  <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Customer</div>
                  <div style={{ fontSize: 13, fontWeight: 900, marginTop: 6 }}>{watch("customerName") || "—"}</div>
                  <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 2 }}>{watch("mobileNumber") || ""}</div>
                </div>

                <div style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 12, background: "#0e0e12" }}>
                  <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Design</div>
                  <div style={{ fontSize: 13, fontWeight: 900, marginTop: 6 }}>{watch("designTitle") || "—"}</div>
                  <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 2 }}>{watch("designCategory") || ""}</div>
                </div>

                <div style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 12, background: "#0e0e12" }}>
                  <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Uploads</div>
                  <div style={{ display: "grid", gap: 6, marginTop: 8, fontSize: 13, fontWeight: 900 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <span>Reference</span>
                      <span>{referenceImages.length}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <span>Images</span>
                      <span>{images.length}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <span>Sketches</span>
                      <span>{sketches.length}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <span>CAD</span>
                      <span>{cadImages.length}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <span>PDF</span>
                      <span>{pdfs.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 14, color: "var(--muted)", fontSize: 12 }}>
                Designer workflow begins after Admin reviews & assigns staff.
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}

