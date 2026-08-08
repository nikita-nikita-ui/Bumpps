const countries = ["USA", "UK", "Canada", "UAE", "Australia", "Germany", "France", "India", "Singapore", "Italy"];
const plans = ["Free", "Silver", "Gold", "Premium", "VIP"];
const statuses = ["Active", "Suspended", "Blocked", "Pending"];
const female = ["Sophia", "Isabella", "Amara", "Elena", "Camille", "Priya", "Mia", "Aaliyah", "Charlotte", "Noor", "Valentina", "Yuki"];
const male = ["Ethan", "Liam", "Marcus", "Rahul", "Julian", "Adam", "Noah", "Zayn", "Leonardo", "Felix", "Omar", "Kenji"];
const surnames = ["Bennett", "Moreau", "Khan", "Rossi", "Carter", "Nakamura", "Silva", "Novak", "Hendricks", "Osei", "Farrow", "Lindqvist"];

function pick(arr, seed) {
  return arr[seed % arr.length];
}

export const allUsers = Array.from({ length: 64 }).map((_, i) => {
  const isFemale = i % 2 === 0;
  const first = isFemale ? pick(female, i) : pick(male, i + 3);
  const last = pick(surnames, i + 7);
  const status = pick(statuses, i * 3 + 1);
  return {
    id: `USR-${1000 + i}`,
    name: `${first} ${last}`,
    age: 21 + ((i * 7) % 22),
    gender: isFemale ? "Female" : "Male",
    country: pick(countries, i * 5 + 2),
    plan: pick(plans, i * 2 + 1),
    status,
    verified: i % 3 !== 0,
    avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
    joined: new Date(2025, (i * 3) % 12, ((i * 5) % 27) + 1).toISOString().slice(0, 10),
    email: `${first.toLowerCase()}.${last.toLowerCase()}@bummps.io`,
    phone: `+1 555-01${(10 + i).toString().slice(-2)}`,
  };
});

export const verificationRequests = Array.from({ length: 18 }).map((_, i) => {
  const u = allUsers[(i * 3) % allUsers.length];
  return {
    id: `VRF-${500 + i}`,
    user: u,
    submitted: new Date(2026, 6, (i % 27) + 1).toISOString().slice(0, 10),
    idType: i % 2 === 0 ? "Passport" : "National ID",
    status: i % 3 === 0 ? "Approved" : i % 3 === 1 ? "Pending" : "Rejected",
    idImage: `https://i.pravatar.cc/400?img=${((i + 10) % 70) + 1}`,
  };
});
