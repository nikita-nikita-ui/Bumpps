import { allUsers } from "./users";

export const matches = Array.from({ length: 30 }).map((_, i) => {
  const a = allUsers[i % allUsers.length];
  const b = allUsers[(i + 11) % allUsers.length];
  return {
    id: `MTC-${300 + i}`,
    userA: a,
    userB: b,
    matchedOn: new Date(2026, 6, (i % 27) + 1).toISOString().slice(0, 10),
    compatibility: 60 + ((i * 7) % 40),
    status: i % 4 === 0 ? "Successful" : i % 4 === 1 ? "Active" : i % 4 === 2 ? "Expired" : "Unmatched",
  };
});

const previews = [
  "Hey, how was your weekend? 😊",
  "Would love to grab coffee sometime!",
  "Haha that's hilarious",
  "Just landed in Dubai ✈️",
  "Can't wait to see you Friday",
  "Sent a photo",
  "That restaurant looks amazing",
  "Good morning ☀️",
];

export const chats = Array.from({ length: 22 }).map((_, i) => {
  const a = allUsers[i % allUsers.length];
  const b = allUsers[(i + 5) % allUsers.length];
  return {
    id: `CHT-${700 + i}`,
    userA: a,
    userB: b,
    lastMessage: previews[i % previews.length],
    time: `${(i % 12) + 1}:${(i * 7) % 60 < 10 ? "0" : ""}${(i * 7) % 60} ${i % 2 === 0 ? "AM" : "PM"}`,
    unread: i % 3 === 0 ? (i % 5) + 1 : 0,
    online: i % 4 !== 0,
  };
});

export const messagesFor = (chatId) => {
  const chat = chats.find((c) => c.id === chatId);
  if (!chat) return [];
  return [
    { from: "them", text: "Hey! Loved your profile 😊", time: "10:02 AM" },
    { from: "me", text: "Thank you! Yours too, that hiking photo is amazing", time: "10:05 AM" },
    { from: "them", text: "Haha thanks, that was in Banff last summer", time: "10:06 AM" },
    { from: "me", text: "No way, I've been wanting to go there!", time: "10:08 AM" },
    { from: "them", text: chat.lastMessage, time: chat.time },
  ];
};
