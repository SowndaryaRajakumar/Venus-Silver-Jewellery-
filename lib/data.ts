// Venus Silver Jewellery - Mock Data Store

export const fmt = (n: number) => "₹" + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
export const uid = (p: string) => p + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
export const todayISO = () => new Date().toISOString().slice(0, 10);
export function dateOffset(d: number) { const x = new Date(); x.setDate(x.getDate() + d); return x.toISOString().slice(0, 10); }

export const CATEGORIES = ["Silver Ring", "Silver Chain", "Silver Necklace", "Silver Bangle", "Silver Bracelet", "Silver Earrings", "Silver Pendant", "Silver Anklet", "Silver Coin", "Gold Ring", "Gold Necklace", "Gold Earrings", "Temple Jewellery", "Custom Jewellery"];
export const PURITY = ["999", "925", "22K", "18K", "24K"];
export const METAL_TYPES = ["Silver", "Gold", "Platinum", "Rose Gold"];

export const PRODUCTS = [
  { id: "PRD001", name: "Classic Silver Ring", sku: "SR-001", category: "Silver Ring", subCategory: "Daily Wear", description: "Elegant 925 silver ring with floral design", purity: "925", metalType: "Silver", grossWeight: 8.2, netWeight: 7.8, basePrice: 718, makingCharge: 200, stoneCharge: 0, gst: 3, hallmarkCharge: 45, stockQty: 24, status: "Active", createdAt: dateOffset(-30), image: "" },
  { id: "PRD002", name: "Temple Silver Necklace", sku: "SN-001", category: "Silver Necklace", subCategory: "Temple", description: "Traditional temple design silver necklace", purity: "999", metalType: "Silver", grossWeight: 42.5, netWeight: 40.0, basePrice: 3600, makingCharge: 1200, stoneCharge: 500, gst: 3, hallmarkCharge: 45, stockQty: 8, status: "Active", createdAt: dateOffset(-25), image: "" },
  { id: "PRD003", name: "Silver Bangle Set", sku: "SB-001", category: "Silver Bangle", subCategory: "Bridal", description: "Set of 4 pure silver bangles with gold plating", purity: "925", metalType: "Silver", grossWeight: 65.0, netWeight: 62.0, basePrice: 5580, makingCharge: 1800, stoneCharge: 0, gst: 3, hallmarkCharge: 45, stockQty: 5, status: "Active", createdAt: dateOffset(-20), image: "" },
  { id: "PRD004", name: "Silver Anklet Pair", sku: "SA-001", category: "Silver Anklet", subCategory: "Daily", description: "Pure silver anklet pair with ghungroo", purity: "999", metalType: "Silver", grossWeight: 28.0, netWeight: 28.0, basePrice: 2520, makingCharge: 800, stoneCharge: 0, gst: 3, hallmarkCharge: 45, stockQty: 15, status: "Active", createdAt: dateOffset(-15), image: "" },
  { id: "PRD005", name: "Silver Earring Jhumkas", sku: "SE-001", category: "Silver Earrings", subCategory: "Party", description: "Oxidised silver jhumka earrings", purity: "925", metalType: "Silver", grossWeight: 12.4, netWeight: 11.8, basePrice: 1062, makingCharge: 450, stoneCharge: 200, gst: 3, hallmarkCharge: 45, stockQty: 18, status: "Active", createdAt: dateOffset(-10), image: "" },
  { id: "PRD006", name: "Gold Ring 22K", sku: "GR-001", category: "Gold Ring", subCategory: "Wedding", description: "22K gold solitaire ring", purity: "22K", metalType: "Gold", grossWeight: 5.2, netWeight: 4.9, basePrice: 35525, makingCharge: 1200, stoneCharge: 0, gst: 3, hallmarkCharge: 45, stockQty: 3, status: "Active", createdAt: dateOffset(-8), image: "" },
  { id: "PRD007", name: "Silver Pendant Krishna", sku: "SP-001", category: "Silver Pendant", subCategory: "Religious", description: "Lord Krishna oxidised silver pendant", purity: "999", metalType: "Silver", grossWeight: 6.5, netWeight: 6.2, basePrice: 558, makingCharge: 250, stoneCharge: 0, gst: 3, hallmarkCharge: 45, stockQty: 30, status: "Active", createdAt: dateOffset(-5), image: "" },
  { id: "PRD008", name: "Silver Coin 10g", sku: "SC-001", category: "Silver Coin", subCategory: "Investment", description: "BIS Hallmarked 999 purity silver coin", purity: "999", metalType: "Silver", grossWeight: 10.0, netWeight: 10.0, basePrice: 900, makingCharge: 150, stoneCharge: 0, gst: 3, hallmarkCharge: 45, stockQty: 50, status: "Active", createdAt: dateOffset(-3), image: "" },
  { id: "PRD009", name: "Gold Necklace Bridal", sku: "GN-001", category: "Gold Necklace", subCategory: "Bridal", description: "22K bridal necklace with kundan work", purity: "22K", metalType: "Gold", grossWeight: 45.2, netWeight: 42.1, basePrice: 305225, makingCharge: 8500, stoneCharge: 2000, gst: 3, hallmarkCharge: 45, stockQty: 2, status: "Active", createdAt: dateOffset(-2), image: "" },
  { id: "PRD010", name: "Silver Chain Italian", sku: "SCH-001", category: "Silver Chain", subCategory: "Daily Wear", description: "Lightweight Italian silver rope chain", purity: "925", metalType: "Silver", grossWeight: 15.5, netWeight: 15.5, basePrice: 1395, makingCharge: 400, stoneCharge: 0, gst: 3, hallmarkCharge: 45, stockQty: 2, status: "Active", createdAt: dateOffset(-1), image: "" },
  { id: "PRD011", name: "Silver Bracelet Charm", sku: "SBR-001", category: "Silver Bracelet", subCategory: "Casual", description: "925 silver charm bracelet", purity: "925", metalType: "Silver", grossWeight: 14.2, netWeight: 13.8, basePrice: 1242, makingCharge: 500, stoneCharge: 300, gst: 3, hallmarkCharge: 45, stockQty: 12, status: "Active", createdAt: todayISO(), image: "" },
  { id: "PRD012", name: "Temple Jewellery Set", sku: "TJ-001", category: "Temple Jewellery", subCategory: "Bridal", description: "Complete temple jewellery set - necklace, earrings, maang tikka", purity: "925", metalType: "Silver", grossWeight: 120.0, netWeight: 115.0, basePrice: 10350, makingCharge: 4500, stoneCharge: 1500, gst: 3, hallmarkCharge: 45, stockQty: 0, status: "Active", createdAt: todayISO(), image: "" },
];

export const CUSTOMERS = [
  { id: "CUS001", name: "Meena Sundaram", phone: "9876543210", email: "meena@example.com", address: "12 Gandhi Nagar", city: "Madurai", state: "Tamil Nadu", pincode: "625001", totalOrders: 4, totalSpent: 18450, status: "Active", joinedAt: dateOffset(-120) },
  { id: "CUS002", name: "Rajesh Kumar", phone: "9123456780", email: "rajesh@example.com", address: "45 Anna Nagar", city: "Chennai", state: "Tamil Nadu", pincode: "600040", totalOrders: 2, totalSpent: 8920, status: "Active", joinedAt: dateOffset(-90) },
  { id: "CUS003", name: "Priya Sharma", phone: "9988776655", email: "priya@example.com", address: "8 MG Road", city: "Bengaluru", state: "Karnataka", pincode: "560001", totalOrders: 6, totalSpent: 42300, status: "Active", joinedAt: dateOffset(-60) },
  { id: "CUS004", name: "Lakshmi Iyer", phone: "9090909090", email: "lakshmi@example.com", address: "23 Beach Road", city: "Kochi", state: "Kerala", pincode: "682001", totalOrders: 1, totalSpent: 4500, status: "Active", joinedAt: dateOffset(-45) },
  { id: "CUS005", name: "Anitha Reddy", phone: "9445566778", email: "anitha@example.com", address: "77 Jubilee Hills", city: "Hyderabad", state: "Telangana", pincode: "500033", totalOrders: 3, totalSpent: 22800, status: "Active", joinedAt: dateOffset(-30) },
  { id: "CUS006", name: "Kavitha Krishnan", phone: "9001112233", email: "kavitha@example.com", address: "34 RS Puram", city: "Coimbatore", state: "Tamil Nadu", pincode: "641002", totalOrders: 5, totalSpent: 31200, status: "Active", joinedAt: dateOffset(-20) },
  { id: "CUS007", name: "Saranya Murugan", phone: "9556677889", email: "saranya@example.com", address: "15 Bypass Road", city: "Madurai", state: "Tamil Nadu", pincode: "625016", totalOrders: 2, totalSpent: 9800, status: "Active", joinedAt: dateOffset(-10) },
  { id: "CUS008", name: "Deepika Nair", phone: "9778899001", email: "deepika@example.com", address: "56 Palayam", city: "Thiruvananthapuram", state: "Kerala", pincode: "695001", totalOrders: 1, totalSpent: 5600, status: "Inactive", joinedAt: dateOffset(-5) },
];

export const ORDERS = [
  { id: "ORD-2025001", customerId: "CUS001", customerName: "Meena Sundaram", phone: "9876543210", productId: "PRD002", productName: "Temple Silver Necklace", qty: 1, amount: 5590, gst: 167.7, total: 5757.7, payment: "UPI", delivery: "Home Delivery", status: "Delivered", orderDate: dateOffset(-20), address: "12 Gandhi Nagar, Madurai" },
  { id: "ORD-2025002", customerId: "CUS003", customerName: "Priya Sharma", phone: "9988776655", productId: "PRD009", productName: "Gold Necklace Bridal", qty: 1, amount: 315770, gst: 9473.1, total: 325243.1, payment: "Net Banking", delivery: "Store Pickup", status: "Processing", orderDate: dateOffset(-15), address: "8 MG Road, Bengaluru" },
  { id: "ORD-2025003", customerId: "CUS006", customerName: "Kavitha Krishnan", phone: "9001112233", productId: "PRD003", productName: "Silver Bangle Set", qty: 2, amount: 15690, gst: 470.7, total: 16160.7, payment: "Cash", delivery: "Store Pickup", status: "Pending", orderDate: dateOffset(-12), address: "34 RS Puram, Coimbatore" },
  { id: "ORD-2025004", customerId: "CUS002", customerName: "Rajesh Kumar", phone: "9123456780", productId: "PRD005", productName: "Silver Earring Jhumkas", qty: 1, amount: 1757, gst: 52.71, total: 1809.71, payment: "Card", delivery: "Home Delivery", status: "Shipped", orderDate: dateOffset(-10), address: "45 Anna Nagar, Chennai" },
  { id: "ORD-2025005", customerId: "CUS005", customerName: "Anitha Reddy", phone: "9445566778", productId: "PRD006", productName: "Gold Ring 22K", qty: 1, amount: 37812, gst: 1134.36, total: 38946.36, payment: "UPI", delivery: "Home Delivery", status: "Confirmed", orderDate: dateOffset(-8), address: "77 Jubilee Hills, Hyderabad" },
  { id: "ORD-2025006", customerId: "CUS004", customerName: "Lakshmi Iyer", phone: "9090909090", productId: "PRD004", productName: "Silver Anklet Pair", qty: 1, amount: 3365, gst: 100.95, total: 3465.95, payment: "Cash", delivery: "Store Pickup", status: "Delivered", orderDate: dateOffset(-6), address: "23 Beach Road, Kochi" },
  { id: "ORD-2025007", customerId: "CUS007", customerName: "Saranya Murugan", phone: "9556677889", productId: "PRD011", productName: "Silver Bracelet Charm", qty: 1, amount: 2087, gst: 62.61, total: 2149.61, payment: "UPI", delivery: "Home Delivery", status: "Pending", orderDate: dateOffset(-4), address: "15 Bypass Road, Madurai" },
  { id: "ORD-2025008", customerId: "CUS001", customerName: "Meena Sundaram", phone: "9876543210", productId: "PRD008", productName: "Silver Coin 10g", qty: 3, amount: 3285, gst: 98.55, total: 3383.55, payment: "Card", delivery: "Home Delivery", status: "Packed", orderDate: dateOffset(-3), address: "12 Gandhi Nagar, Madurai" },
  { id: "ORD-2025009", customerId: "CUS003", customerName: "Priya Sharma", phone: "9988776655", productId: "PRD001", productName: "Classic Silver Ring", qty: 2, amount: 1960, gst: 58.8, total: 2018.8, payment: "UPI", delivery: "Store Pickup", status: "Delivered", orderDate: dateOffset(-2), address: "8 MG Road, Bengaluru" },
  { id: "ORD-2025010", customerId: "CUS008", customerName: "Deepika Nair", phone: "9778899001", productId: "PRD007", productName: "Silver Pendant Krishna", qty: 1, amount: 853, gst: 25.59, total: 878.59, payment: "Cash", delivery: "Home Delivery", status: "Cancelled", orderDate: dateOffset(-1), address: "56 Palayam, Thiruvananthapuram" },
];

export const CATEGORIES_DATA = [
  { id: "CAT001", name: "Silver Rings", description: "All silver ring collections", image: "", status: "Active", productCount: 12, createdAt: dateOffset(-100) },
  { id: "CAT002", name: "Silver Necklaces", description: "Silver necklace collections", image: "", status: "Active", productCount: 18, createdAt: dateOffset(-90) },
  { id: "CAT003", name: "Silver Bangles", description: "Silver bangle collections", image: "", status: "Active", productCount: 8, createdAt: dateOffset(-80) },
  { id: "CAT004", name: "Silver Earrings", description: "Silver earring collections", image: "", status: "Active", productCount: 22, createdAt: dateOffset(-70) },
  { id: "CAT005", name: "Silver Anklets", description: "Silver anklet collections", image: "", status: "Active", productCount: 14, createdAt: dateOffset(-60) },
  { id: "CAT006", name: "Gold Collections", description: "Premium gold jewellery", image: "", status: "Active", productCount: 6, createdAt: dateOffset(-50) },
  { id: "CAT007", name: "Temple Jewellery", description: "Traditional temple designs", image: "", status: "Active", productCount: 10, createdAt: dateOffset(-40) },
  { id: "CAT008", name: "Silver Coins", description: "Investment silver coins", image: "", status: "Active", productCount: 5, createdAt: dateOffset(-30) },
];

export const SUBCATEGORIES_DATA = [
  { id: "SUB001", categoryId: "CAT001", categoryName: "Silver Rings", name: "Daily Wear", status: "Active", productCount: 8 },
  { id: "SUB002", categoryId: "CAT001", categoryName: "Silver Rings", name: "Wedding", status: "Active", productCount: 4 },
  { id: "SUB003", categoryId: "CAT002", categoryName: "Silver Necklaces", name: "Temple", status: "Active", productCount: 10 },
  { id: "SUB004", categoryId: "CAT002", categoryName: "Silver Necklaces", name: "Bridal", status: "Active", productCount: 8 },
  { id: "SUB005", categoryId: "CAT003", categoryName: "Silver Bangles", name: "Daily Wear", status: "Active", productCount: 5 },
  { id: "SUB006", categoryId: "CAT003", categoryName: "Silver Bangles", name: "Bridal", status: "Active", productCount: 3 },
  { id: "SUB007", categoryId: "CAT004", categoryName: "Silver Earrings", name: "Jhumkas", status: "Active", productCount: 12 },
  { id: "SUB008", categoryId: "CAT004", categoryName: "Silver Earrings", name: "Studs", status: "Active", productCount: 10 },
  { id: "SUB009", categoryId: "CAT005", categoryName: "Silver Anklets", name: "Traditional", status: "Active", productCount: 8 },
  { id: "SUB010", categoryId: "CAT006", categoryName: "Gold Collections", name: "Bridal", status: "Active", productCount: 3 },
];

export const METAL_RATES = [
  { id: "MR001", metal: "Silver 999", rate: 90, unit: "per gram", effectiveDate: todayISO(), updatedBy: "Admin" },
  { id: "MR002", metal: "Silver 925", rate: 83, unit: "per gram", effectiveDate: todayISO(), updatedBy: "Admin" },
  { id: "MR003", metal: "Gold 22K", rate: 7250, unit: "per gram", effectiveDate: todayISO(), updatedBy: "Admin" },
  { id: "MR004", metal: "Gold 24K", rate: 7900, unit: "per gram", effectiveDate: todayISO(), updatedBy: "Admin" },
  { id: "MR005", metal: "Platinum", rate: 3200, unit: "per gram", effectiveDate: todayISO(), updatedBy: "Admin" },
];

export const METAL_RATE_HISTORY = [
  { date: dateOffset(-6), silver999: 88, silver925: 81, gold22k: 7100, gold24k: 7750 },
  { date: dateOffset(-5), silver999: 88.5, silver925: 81.5, gold22k: 7150, gold24k: 7800 },
  { date: dateOffset(-4), silver999: 89, silver925: 82, gold22k: 7180, gold24k: 7830 },
  { date: dateOffset(-3), silver999: 89.5, silver925: 82.5, gold22k: 7200, gold24k: 7850 },
  { date: dateOffset(-2), silver999: 89.8, silver925: 82.8, gold22k: 7220, gold24k: 7870 },
  { date: dateOffset(-1), silver999: 90, silver925: 83, gold22k: 7240, gold24k: 7890 },
  { date: todayISO(), silver999: 90, silver925: 83, gold22k: 7250, gold24k: 7900 },
];

export const REVIEWS = [
  { id: "REV001", customerId: "CUS001", customerName: "Meena Sundaram", productId: "PRD002", productName: "Temple Silver Necklace", rating: 5, review: "Absolutely beautiful necklace! The quality is exceptional and the design is perfect for temple visits.", status: "Approved", date: dateOffset(-15) },
  { id: "REV002", customerId: "CUS003", customerName: "Priya Sharma", productId: "PRD005", productName: "Silver Earring Jhumkas", rating: 4, review: "Very nice jhumkas. Love the oxidised finish. Slightly heavy but looks gorgeous.", status: "Approved", date: dateOffset(-12) },
  { id: "REV003", customerId: "CUS006", customerName: "Kavitha Krishnan", productId: "PRD001", productName: "Classic Silver Ring", rating: 5, review: "Perfect ring! Great quality silver and elegant design. Very happy with the purchase.", status: "Pending", date: dateOffset(-8) },
  { id: "REV004", customerId: "CUS002", customerName: "Rajesh Kumar", productId: "PRD008", productName: "Silver Coin 10g", rating: 4, review: "Good quality coin. Hallmark certificate provided. Good for investment.", status: "Pending", date: dateOffset(-5) },
  { id: "REV005", customerId: "CUS004", customerName: "Lakshmi Iyer", productId: "PRD004", productName: "Silver Anklet Pair", rating: 3, review: "Decent quality but the ghungroo sound is a bit too loud. Design is nice though.", status: "Approved", date: dateOffset(-3) },
];

export const WISHLISTS = [
  { id: "WL001", customerId: "CUS001", customerName: "Meena Sundaram", productId: "PRD009", productName: "Gold Necklace Bridal", price: 325243.1, addedAt: dateOffset(-10) },
  { id: "WL002", customerId: "CUS003", customerName: "Priya Sharma", productId: "PRD006", productName: "Gold Ring 22K", price: 38946.36, addedAt: dateOffset(-8) },
  { id: "WL003", customerId: "CUS005", customerName: "Anitha Reddy", productId: "PRD002", productName: "Temple Silver Necklace", price: 5757.7, addedAt: dateOffset(-6) },
  { id: "WL004", customerId: "CUS006", customerName: "Kavitha Krishnan", productId: "PRD012", productName: "Temple Jewellery Set", price: 16395, addedAt: dateOffset(-4) },
  { id: "WL005", customerId: "CUS007", customerName: "Saranya Murugan", productId: "PRD003", productName: "Silver Bangle Set", price: 16160.7, addedAt: dateOffset(-2) },
];

export const HERO_BANNERS = [
  { id: "BNR001", title: "Exclusive Bridal Collection", subtitle: "Handcrafted silver jewellery for your special day", image: "", link: "/collections/bridal", order: 1, status: "Active", createdAt: dateOffset(-30) },
  { id: "BNR002", title: "Temple Jewellery Sale", subtitle: "Up to 20% off on all temple designs", image: "", link: "/collections/temple", order: 2, status: "Active", createdAt: dateOffset(-20) },
  { id: "BNR003", title: "New Arrivals - Silver Coins", subtitle: "BIS Hallmarked 999 purity investment coins", image: "", link: "/collections/coins", order: 3, status: "Inactive", createdAt: dateOffset(-10) },
];

export const NEWSLETTER_SUBSCRIBERS = [
  { id: "NS001", email: "meena.s@example.com", name: "Meena S", subscribedAt: dateOffset(-45), status: "Active" },
  { id: "NS002", email: "priya.k@example.com", name: "Priya K", subscribedAt: dateOffset(-40), status: "Active" },
  { id: "NS003", email: "anitha.r@example.com", name: "Anitha R", subscribedAt: dateOffset(-35), status: "Active" },
  { id: "NS004", email: "kavitha.m@example.com", name: "Kavitha M", subscribedAt: dateOffset(-28), status: "Active" },
  { id: "NS005", email: "deepika.n@example.com", name: "Deepika N", subscribedAt: dateOffset(-20), status: "Active" },
  { id: "NS006", email: "saranya.p@example.com", name: "Saranya P", subscribedAt: dateOffset(-15), status: "Unsubscribed" },
  { id: "NS007", email: "lakshmi.i@example.com", name: "Lakshmi I", subscribedAt: dateOffset(-10), status: "Active" },
  { id: "NS008", email: "rajesh.k@example.com", name: "Rajesh K", subscribedAt: dateOffset(-5), status: "Active" },
];

export const ENQUIRIES = [
  { id: "ENQ001", name: "Vijaya Lakshmi", phone: "9888777666", email: "vijaya@example.com", message: "I am looking for a complete bridal silver set including necklace, bangles, and earrings. Could you please share the price and design options?", status: "Replied", date: dateOffset(-15), reply: "Thank you for your interest! We have beautiful bridal sets starting from ₹15,000. Please visit our showroom or we can schedule a video consultation." },
  { id: "ENQ002", name: "Murugesan S", phone: "9777666555", email: "murugesan@example.com", message: "Want to know about custom silver pendant with name engraving. What is the cost and time?", status: "Open", date: dateOffset(-10), reply: "" },
  { id: "ENQ003", name: "Selvi Rajan", phone: "9666555444", email: "selvi@example.com", message: "Interested in bulk order of silver coins for gifting purpose (Diwali). Minimum 50 pieces needed.", status: "Open", date: dateOffset(-7), reply: "" },
  { id: "ENQ004", name: "Arun Prakash", phone: "9555444333", email: "arun@example.com", message: "Looking for silver anklets for my daughter. What designs are available in the 15-20 gram range?", status: "Replied", date: dateOffset(-5), reply: "We have a lovely collection of silver anklets in that weight range. Our traditional and contemporary designs start from ₹1,200." },
  { id: "ENQ005", name: "Thamizharasi", phone: "9444333222", email: "thamizh@example.com", message: "What is the current silver rate? And do you offer exchange for old silver jewellery?", status: "Open", date: dateOffset(-2), reply: "" },
];

export const COUPONS = [
  { id: "CPN001", code: "VENUS10", type: "Percentage", discount: 10, minOrder: 2000, maxDiscount: 500, usageLimit: 100, usedCount: 34, validFrom: dateOffset(-30), validTo: dateOffset(30), status: "Active" },
  { id: "CPN002", code: "FLAT500", type: "Fixed", discount: 500, minOrder: 5000, maxDiscount: 500, usageLimit: 50, usedCount: 12, validFrom: dateOffset(-15), validTo: dateOffset(45), status: "Active" },
  { id: "CPN003", code: "BRIDAL20", type: "Percentage", discount: 20, minOrder: 10000, maxDiscount: 3000, usageLimit: 25, usedCount: 8, validFrom: dateOffset(-10), validTo: dateOffset(20), status: "Active" },
  { id: "CPN004", code: "SUMMER15", type: "Percentage", discount: 15, minOrder: 3000, maxDiscount: 1000, usageLimit: 200, usedCount: 200, validFrom: dateOffset(-90), validTo: dateOffset(-5), status: "Expired" },
];

export const ROLES = [
  { id: "ROL001", name: "Super Admin", description: "Full access to all modules", permissions: "all", userCount: 1, createdAt: dateOffset(-200) },
  { id: "ROL002", name: "Manager", description: "Manage products, orders, and customers", permissions: "products,orders,customers,reports", userCount: 2, createdAt: dateOffset(-100) },
  { id: "ROL003", name: "Staff", description: "View orders and customers only", permissions: "orders,customers", userCount: 3, createdAt: dateOffset(-60) },
];

export const AUDIT_LOGS = [
  { id: "AUD001", user: "admin@venussilver.in", action: "LOGIN", module: "Auth", details: "Admin logged in successfully", ip: "192.168.1.1", timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: "AUD002", user: "admin@venussilver.in", action: "CREATE", module: "Products", details: "Added new product: Silver Anklet Pair", ip: "192.168.1.1", timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: "AUD003", user: "admin@venussilver.in", action: "UPDATE", module: "Orders", details: "Updated order ORD-2025003 status to Confirmed", ip: "192.168.1.1", timestamp: new Date(Date.now() - 10800000).toISOString() },
  { id: "AUD004", user: "admin@venussilver.in", action: "UPDATE", module: "Metal Rates", details: "Updated Silver 999 rate to ₹90/gram", ip: "192.168.1.1", timestamp: new Date(Date.now() - 14400000).toISOString() },
  { id: "AUD005", user: "admin@venussilver.in", action: "DELETE", module: "Products", details: "Deleted draft product: Test Product", ip: "192.168.1.1", timestamp: new Date(Date.now() - 18000000).toISOString() },
  { id: "AUD006", user: "manager@venussilver.in", action: "LOGIN", module: "Auth", details: "Manager logged in", ip: "192.168.1.2", timestamp: new Date(Date.now() - 21600000).toISOString() },
  { id: "AUD007", user: "admin@venussilver.in", action: "CREATE", module: "Coupons", details: "Created coupon: BRIDAL20", ip: "192.168.1.1", timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: "AUD008", user: "admin@venussilver.in", action: "UPDATE", module: "Settings", details: "Updated store email address", ip: "192.168.1.1", timestamp: new Date(Date.now() - 172800000).toISOString() },
];

export const MONTHLY_REVENUE = [
  { month: "Jul", revenue: 42000, orders: 18 },
  { month: "Aug", revenue: 58000, orders: 24 },
  { month: "Sep", revenue: 51000, orders: 21 },
  { month: "Oct", revenue: 74000, orders: 31 },
  { month: "Nov", revenue: 89000, orders: 38 },
  { month: "Dec", revenue: 125000, orders: 52 },
  { month: "Jan", revenue: 98000, orders: 41 },
  { month: "Feb", revenue: 67000, orders: 28 },
  { month: "Mar", revenue: 81000, orders: 34 },
  { month: "Apr", revenue: 93000, orders: 39 },
  { month: "May", revenue: 110000, orders: 46 },
  { month: "Jun", revenue: 78000, orders: 33 },
];

export const ORDER_STATUS_DIST = [
  { name: "Delivered", value: 156, color: "#22c55e" },
  { name: "Processing", value: 42, color: "#c084fc" },
  { name: "Shipped", value: 38, color: "#5eead4" },
  { name: "Pending", value: 28, color: "#f59e0b" },
  { name: "Cancelled", value: 14, color: "#ef4444" },
];

// -------------------------------
// Custom Jewellery Design Requests (Mock)
// -------------------------------

import type { CustomDesignRequest, CustomDesignStatus } from "@/lib/custom-designs";

export const CUSTOM_DESIGN_REQUEST_STATUSES: CustomDesignStatus[] = [
  "Pending",
  "Reviewing",
  "Quotation Sent",
  "Approved",
  "Rejected",
  "Production Started",
  "Production Completed",
  "Delivered",
];

const nowish = () => new Date().toISOString();

export const CUSTOM_DESIGN_REQUESTS: CustomDesignRequest[] = [
  {
    id: "CDR001",
    requestId: "CDR-10001",
    customerName: "Meena Sundaram",
    mobileNumber: "9876543210",
    email: "meena@example.com",
    address: "12 Gandhi Nagar, Madurai",

    designType: "Temple",
    designTitle: "Temple Pendant Krishna",
    designCategory: "Temple Jewellery",
    jewelleryType: "Pendant",
    preferredMetal: "Silver",
    purity: "999",
    approxWeight: 6.5,
    budgetRange: "₹2,000 - ₹4,000",
    budget: 3200,
    designDescription: "Krishna pendant with oxidised finish and fine detailing (reference attached).",

    status: "Approved",
    createdAt: dateOffset(-6),
    assignedStaff: "Ravi (Designer)",

    timeline: [
      { id: "T1", status: "Pending", at: dateOffset(-6), by: "Admin", note: "Request received" },
      { id: "T2", status: "Reviewing", at: dateOffset(-5), by: "Designer Team", note: "Initial review + measurement" },
      { id: "T3", status: "Quotation Sent", at: dateOffset(-4), by: "Admin", note: "Quotation emailed" },
      { id: "T4", status: "Approved", at: dateOffset(-3), by: "Customer", note: "Approved + payment initiated" },
    ],

    internalNotes: ["Customer requested oxidised finish.", "Artwork to match provided reference scale."],
    activityHistory: [
      { id: "A1", at: dateOffset(-6), by: "System", action: "Created custom design request" },
      { id: "A2", at: dateOffset(-5), by: "Designer Team", action: "Reviewed request" },
      { id: "A3", at: dateOffset(-4), by: "Admin", action: "Sent quotation" },
      { id: "A4", at: dateOffset(-3), by: "Customer", action: "Approved quotation" },
    ],

    uploads: {
      images: [],
      sketches: [],
      cad: [],
      pdfs: [],
    },
  },
  {
    id: "CDR002",
    requestId: "CDR-10002",
    customerName: "Rajesh Kumar",
    mobileNumber: "9123456780",
    email: "rajesh@example.com",
    address: "45 Anna Nagar, Chennai",

    designType: "Bridal Set",
    designTitle: "Bridal Bangles Set",
    designCategory: "Silver Bangle",
    jewelleryType: "Bangles",
    preferredMetal: "Silver",
    purity: "925",
    approxWeight: 65,
    budgetRange: "₹12,000 - ₹18,000",
    budget: 15000,
    designDescription: "4-bangle set with floral motifs and lightweight inner curves.",

    status: "Production Started",
    createdAt: dateOffset(-12),
    assignedStaff: "Anitha (Designer)",

    timeline: [
      { id: "T1", status: "Pending", at: dateOffset(-12), by: "Admin" },
      { id: "T2", status: "Reviewing", at: dateOffset(-10), by: "Designer Team" },
      { id: "T3", status: "Quotation Sent", at: dateOffset(-9), by: "Admin" },
      { id: "T4", status: "Approved", at: dateOffset(-8), by: "Customer" },
      { id: "T5", status: "Production Started", at: dateOffset(-7), by: "Shop Floor" },
    ],

    internalNotes: ["Need CAD engraving pattern.", "Confirm bangle width tolerance."],
    activityHistory: [
      { id: "A1", at: dateOffset(-12), by: "System", action: "Created custom design request" },
      { id: "A2", at: dateOffset(-10), by: "Designer Team", action: "Reviewed request" },
      { id: "A3", at: dateOffset(-9), by: "Admin", action: "Sent quotation" },
      { id: "A4", at: dateOffset(-7), by: "Shop Floor", action: "Production started" },
    ],

    uploads: {
      images: [],
      sketches: [],
      cad: [],
      pdfs: [],
    },
  },
  {
    id: "CDR003",
    requestId: "CDR-10003",
    customerName: "Kavitha Krishnan",
    mobileNumber: "9001112233",
    email: "kavitha@example.com",
    address: "34 RS Puram, Coimbatore",

    designType: "Name Engraving",
    designTitle: "Silver Pendant with Name",
    designCategory: "Silver Pendant",
    jewelleryType: "Pendant",
    preferredMetal: "Silver",
    purity: "999",
    approxWeight: 8,
    budgetRange: "₹3,000 - ₹6,000",
    budget: 4500,
    designDescription: "Personalised pendant engraving: 'KAVI' with minimalistic border.",

    status: "Pending",
    createdAt: dateOffset(-3),
    assignedStaff: "Unassigned",

    timeline: [
      { id: "T1", status: "Pending", at: dateOffset(-3), by: "Admin", note: "Waiting for design briefing" },
    ],

    internalNotes: ["Awaiting customer confirmation on font style."],
    activityHistory: [
      { id: "A1", at: dateOffset(-3), by: "System", action: "Created custom design request" },
    ],

    uploads: {
      images: [],
      sketches: [],
      cad: [],
      pdfs: [],
    },
  },
  {
    id: "CDR004",
    requestId: "CDR-10004",
    customerName: "Anitha Reddy",
    mobileNumber: "9445566778",
    email: "anitha@example.com",
    address: "77 Jubilee Hills, Hyderabad",

    designType: "Custom Ring",
    designTitle: "22K Gold Solitaire Ring",
    designCategory: "Gold Ring",
    jewelleryType: "Ring",
    preferredMetal: "Gold",
    purity: "22K",
    approxWeight: 5.2,
    budgetRange: "₹55,000 - ₹80,000",
    budget: 65000,
    designDescription: "Solitaire ring with subtle tapering and BIS hallmarked.",

    status: "Delivered",
    createdAt: dateOffset(-30),
    assignedStaff: "Suresh (Designer)",

    timeline: [
      { id: "T1", status: "Pending", at: dateOffset(-30), by: "Admin" },
      { id: "T2", status: "Reviewing", at: dateOffset(-28), by: "Designer Team" },
      { id: "T3", status: "Quotation Sent", at: dateOffset(-27), by: "Admin" },
      { id: "T4", status: "Approved", at: dateOffset(-26), by: "Customer" },
      { id: "T5", status: "Production Started", at: dateOffset(-25), by: "Shop Floor" },
      { id: "T6", status: "Production Completed", at: dateOffset(-12), by: "Shop Floor" },
      { id: "T7", status: "Delivered", at: dateOffset(-8), by: "Courier" },
    ],

    internalNotes: ["Customer requested minor adjustment on band thickness."],
    activityHistory: [
      { id: "A1", at: dateOffset(-30), by: "System", action: "Created custom design request" },
      { id: "A2", at: dateOffset(-12), by: "Shop Floor", action: "Production completed" },
      { id: "A3", at: dateOffset(-8), by: "Courier", action: "Delivered" },
    ],

    uploads: {
      images: [],
      sketches: [],
      cad: [],
      pdfs: [],
    },
  },
];

