import { allUsers } from "./users";

export const reports = Array.from({ length: 20 }).map((_, i) => {
  const types = ["Abuse", "Spam", "Fake Profile", "Harassment", "Inappropriate Content"];
  const reporter = allUsers[i % allUsers.length];
  const reported = allUsers[(i + 9) % allUsers.length];
  return {
    id: `RPT-${900 + i}`,
    type: types[i % types.length],
    reporter,
    reported,
    date: new Date(2026, 6, (i % 27) + 1).toISOString().slice(0, 10),
    status: i % 3 === 0 ? "Resolved" : i % 3 === 1 ? "Pending" : "Rejected",
    note: "User reported for violating community guidelines. Awaiting moderator review of the attached evidence and chat history.",
  };
});

export const transactions = Array.from({ length: 26 }).map((_, i) => {
  const u = allUsers[i % allUsers.length];
  const plans = ["Silver", "Gold", "Premium", "VIP"];
  const prices = { Silver: 9.99, Gold: 19.99, Premium: 39.99, VIP: 79.99 };
  const plan = plans[i % plans.length];
  return {
    id: `TXN-${8800 + i}`,
    user: u,
    plan,
    amount: prices[plan],
    date: new Date(2026, 6, (i % 27) + 1).toISOString().slice(0, 10),
    method: i % 2 === 0 ? "Visa •••• 4242" : "Mastercard •••• 8890",
    status: i % 5 === 0 ? "Refunded" : i % 7 === 0 ? "Failed" : "Success",
    invoice: `INV-${20260 + i}`,
  };
});

export const plansData = [
  {
    id: "silver",
    name: "Silver",
    price: 9.99,
    color: "#B9BDC7",
    subscribers: 4820,
    revenue: 48158.8,
    perks: ["Unlimited likes", "See who liked you (5/day)", "Basic filters"],
  },
  {
    id: "gold",
    name: "Gold",
    price: 19.99,
    color: "#DAB25A",
    subscribers: 3120,
    revenue: 62368.8,
    perks: ["Everything in Silver", "Unlimited profile views", "Advanced filters", "Priority support"],
  },
  {
    id: "premium",
    name: "Premium",
    price: 39.99,
    color: "#F2D89A",
    subscribers: 1640,
    revenue: 65583.6,
    perks: ["Everything in Gold", "Incognito mode", "Boost 2x/week", "Read receipts"],
  },
  {
    id: "vip",
    name: "VIP",
    price: 79.99,
    color: "#DAB25A",
    subscribers: 512,
    revenue: 40954.9,
    perks: ["Everything in Premium", "Dedicated matchmaker", "Unlimited boosts", "VIP badge"],
  },
];

export const notifications = Array.from({ length: 14 }).map((_, i) => {
  const types = ["Report", "Verification", "Payment", "System", "Complaint"];
  return {
    id: `NTF-${400 + i}`,
    type: types[i % types.length],
    title: [
      "New abuse report filed",
      "Verification request pending review",
      "Payment received from VIP subscriber",
      "System backup completed successfully",
      "New complaint requires attention",
    ][i % 5],
    time: `${(i % 12) + 1}h ago`,
    read: i % 3 === 0,
  };
});

export const userGrowth = [
  { month: "Jan", users: 3200, revenue: 18200 },
  { month: "Feb", users: 3850, revenue: 21400 },
  { month: "Mar", users: 4420, revenue: 24800 },
  { month: "Apr", users: 5100, revenue: 29200 },
  { month: "May", users: 5980, revenue: 34100 },
  { month: "Jun", users: 6840, revenue: 39800 },
  { month: "Jul", users: 7920, revenue: 47250 },
];

export const countryAnalytics = [
  { name: "USA", value: 32 },
  { name: "UK", value: 18 },
  { name: "UAE", value: 14 },
  { name: "Canada", value: 12 },
  { name: "Australia", value: 10 },
  { name: "Others", value: 14 },
];

export const genderAnalytics = [
  { name: "Female", value: 54 },
  { name: "Male", value: 44 },
  { name: "Other", value: 2 },
];

export const dauMau = [
  { day: "Mon", dau: 4200, mau: 28000 },
  { day: "Tue", dau: 4600, mau: 28200 },
  { day: "Wed", dau: 5100, mau: 28900 },
  { day: "Thu", dau: 4950, mau: 29300 },
  { day: "Fri", dau: 5800, mau: 30100 },
  { day: "Sat", dau: 6700, mau: 30800 },
  { day: "Sun", dau: 6100, mau: 31200 },
];

export const activities = [
  { id: 1, text: "Sophia Bennett registered a new account", time: "5 min ago", type: "user" },
  { id: 2, text: "Marcus Khan submitted verification documents", time: "18 min ago", type: "verify" },
  { id: 3, text: "VIP payment of $79.99 received from Elena Rossi", time: "42 min ago", type: "payment" },
  { id: 4, text: "New match between Priya Farrow & Liam Carter", time: "1h ago", type: "match" },
  { id: 5, text: "Report filed against fake profile UID-2291", time: "2h ago", type: "report" },
  { id: 6, text: "Camille Novak upgraded to Premium plan", time: "3h ago", type: "payment" },
];
