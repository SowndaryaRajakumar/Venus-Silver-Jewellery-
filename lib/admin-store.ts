"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORIES_DATA, SUBCATEGORIES_DATA, PRODUCTS, uid, todayISO } from "@/lib/data";

const STORAGE_KEY = "venus_admin_store";

export type CategoryStatus = "Active" | "Inactive";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: CategoryStatus;
  productCount: number;
  createdAt: string;
};

export type SubCategoryStatus = "Active" | "Inactive";

export type SubCategory = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: SubCategoryStatus;
  productCount: number;
};

export type ProductStatus = "Active" | "Inactive" | "Draft";

export type Product = {
  id: string;
  name: string;
  sku: string;
  productCode: string;

  categoryId: string;
  subCategoryId: string;

  brand: string;
  status: ProductStatus;

  description: string;
  shortDescription: string;

  metalType: string;
  purity: string;
  grossWeight: number;
  netWeight: number;
  stoneWeight: number;

  makingCharges: number;
  wastageCharges: number;
  stoneCharges: number;
  customCharges: number;
  gstPercentage: number;

  stockQty: number;
  reorderLevel: number;
  availabilityStatus: string;

  metaTitle: string;
  metaDescription: string;
  urlSlug: string;

  basePrice: number;
  image: string;
  createdAt: string;
};

type StoreState = {
  categories: Category[];
  subcategories: SubCategory[];
  products: Product[];
};

type StoreApi = StoreState & {
  addCategory(input: Omit<Category, "id" | "createdAt" | "productCount">): Category;
  updateCategory(id: string, patch: Partial<Omit<Category, "id" | "createdAt" | "productCount">>): Category | null;
  deleteCategory(id: string): void;

  addSubCategory(input: Omit<SubCategory, "id" | "productCount">): SubCategory;
  updateSubCategory(id: string, patch: Partial<Omit<SubCategory, "id" | "productCount">>): SubCategory | null;
  deleteSubCategory(id: string): void;

  addProduct(input: Omit<Product, "id" | "createdAt">): Product;
  updateProduct(id: string, patch: Partial<Omit<Product, "id" | "createdAt">>): Product | null;
  deleteProduct(id: string): void;
};

const slugify = (s: string) =>
  String(s)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Lightweight module-scoped store (no backend)
let state: StoreState | null = null;
let listeners = new Set<() => void>();

function loadFromStorage(): StoreState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StoreState;
  } catch {}
  return null;
}

function saveToStorage() {
  if (typeof window === "undefined" || !state) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      categories: state.categories,
      subcategories: state.subcategories,
      products: state.products,
    }));
  } catch {}
}

function initIfNeeded() {
  if (state) return;

  // Try loading from localStorage first
  const saved = loadFromStorage();
  if (saved) {
    state = saved;
    return;
  }

  const categories: Category[] = CATEGORIES_DATA.map((c) => ({
    id: c.id,
    name: c.name,
    slug: slugify(c.name),
    description: (c as any).description || "",
    image: (c as any).image || "",
    status: c.status as CategoryStatus,
    productCount: (c as any).productCount ?? 0,
    createdAt: (c as any).createdAt || todayISO(),
  }));

  const subcategories: SubCategory[] = SUBCATEGORIES_DATA.map((s) => ({
    id: s.id,
    categoryId: s.categoryId,
    name: s.name,
    slug: slugify(s.name),
    description: "",
    image: "",
    status: s.status as SubCategoryStatus,
    productCount: (s as any).productCount ?? 0,
  }));

  const categoriesByName = new Map(categories.map((c) => [c.name, c] as const));
  const subcatsByKey = new Map(
    subcategories.map((s) => [`${s.categoryId}::${s.name}`, s] as const)
  );

  const products: Product[] = PRODUCTS.map((p) => {
    const cat = categoriesByName.get(p.category);
    const sub = cat ? subcatsByKey.get(`${cat.id}::${p.subCategory}`) : undefined;

    const safeCategoryId = cat?.id || categories[0]?.id || "";
    const safeSubCategoryId = sub?.id || subcategories.find((x) => x.categoryId === safeCategoryId)?.id || subcategories[0]?.id || "";

    // Map existing fields to new schema.
    // Many fields in PRODUCTS already match names used in UI; product create page uses more fields than this seed.
    // Keep best-effort mapping so dependent dropdown works.
    const createdAt = (p as any).createdAt || todayISO();

    return {
      id: p.id,
      name: p.name,
      sku: p.sku,
      productCode: (p as any).productCode || "",

      categoryId: safeCategoryId,
      subCategoryId: safeSubCategoryId,

      brand: (p as any).brand || "",
      status: (p as any).status || "Active",

      description: (p as any).description || "",
      shortDescription: (p as any).shortDescription || "",

      metalType: p.metalType,
      purity: p.purity,
      grossWeight: (p as any).grossWeight ?? 0,
      netWeight: (p as any).netWeight ?? 0,
      stoneWeight: (p as any).stoneWeight ?? 0,

      makingCharges: (p as any).makingCharge ?? (p as any).makingCharges ?? 0,
      wastageCharges: (p as any).wastageCharges ?? 0,
      stoneCharges: (p as any).stoneCharge ?? (p as any).stoneCharges ?? 0,
      customCharges: (p as any).customCharges ?? 0,
      gstPercentage: (p as any).gst ?? (p as any).gstPercentage ?? 0,

      stockQty: (p as any).stockQty ?? (p as any).stockQuantity ?? 0,
      reorderLevel: (p as any).reorderLevel ?? 0,
      availabilityStatus: (p as any).availabilityStatus ?? "Available",

      metaTitle: (p as any).metaTitle ?? "",
      metaDescription: (p as any).metaDescription ?? "",
      urlSlug: (p as any).urlSlug ?? "",

      basePrice: (p as any).basePrice ?? 0,
      image: (p as any).image ?? "",
      createdAt,
    };
  });

  state = { categories, subcategories, products };
}

function notify() {
  saveToStorage();
  listeners.forEach((l) => l());
}

function getApi(): StoreApi {
  initIfNeeded();
  if (!state) throw new Error("Store not initialized");

  return {
    ...state,

    addCategory(input) {
      const newCat: Category = {
        id: uid("CAT"),
        createdAt: todayISO(),
        productCount: 0,
        ...input,
      };
      state!.categories = [newCat, ...state!.categories];
      notify();
      return newCat;
    },

    updateCategory(id, patch) {
      const idx = state!.categories.findIndex((c) => c.id === id);
      if (idx === -1) return null;
      const updated = { ...state!.categories[idx], ...patch };
      state!.categories = state!.categories.map((c) => (c.id === id ? updated : c));
      notify();
      return updated;
    },

    deleteCategory(id) {
      // delete related subcategories and leave product foreign keys dangling in mock storage (or delete products too)
      const subIdsToDelete = new Set(state!.subcategories.filter((s) => s.categoryId === id).map((s) => s.id));
      state!.subcategories = state!.subcategories.filter((s) => s.categoryId !== id);
      state!.products = state!.products.filter((p) => !subIdsToDelete.has(p.subCategoryId));
      state!.categories = state!.categories.filter((c) => c.id !== id);
      notify();
    },

    addSubCategory(input) {
      const newSub: SubCategory = {
        id: uid("SUB"),
        productCount: 0,
        ...input,
      };
      state!.subcategories = [newSub, ...state!.subcategories];
      notify();
      return newSub;
    },

    updateSubCategory(id, patch) {
      const idx = state!.subcategories.findIndex((s) => s.id === id);
      if (idx === -1) return null;
      const updated = { ...state!.subcategories[idx], ...patch };
      state!.subcategories = state!.subcategories.map((s) => (s.id === id ? updated : s));
      notify();
      return updated;
    },

    deleteSubCategory(id) {
      state!.products = state!.products.filter((p) => p.subCategoryId !== id);
      state!.subcategories = state!.subcategories.filter((s) => s.id !== id);
      notify();
    },

    addProduct(input) {
      const newProduct: Product = { id: uid("PRD"), createdAt: todayISO(), ...input };
      state!.products = [newProduct, ...state!.products];
      notify();
      return newProduct;
    },

    updateProduct(id, patch) {
      const idx = state!.products.findIndex((p) => p.id === id);
      if (idx === -1) return null;
      const updated = { ...state!.products[idx], ...patch };
      state!.products = state!.products.map((p) => (p.id === id ? updated : p));
      notify();
      return updated;
    },

    deleteProduct(id) {
      state!.products = state!.products.filter((p) => p.id !== id);
      notify();
    },
  };
}

export function useAdminStore() {
  initIfNeeded();
  const api = useMemo(() => getApi(), []);
  const [, setTick] = useState(0);

  useEffect(() => {
    const cb = () => setTick((x) => x + 1);
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  }, []);

  // api is mutable via module-scoped state; returning a fresh api object each render is fine
  return getApi();
}

export function getSubcategoriesByCategoryId(subcategories: SubCategory[], categoryId: string) {
  return subcategories.filter((s) => s.categoryId === categoryId);
}
