const slots = {
  "MONDAY": ["XE", "1A", "2A", "3A", "8A", "9A", "12A"],
  "TUESDAY": ["4A", "1B", "2B", "3B", "10A", "11A", "12B"],
  "WEDNESDAY": ["5A", "6A", "7A", "X1", "X2", "X3", "XC"],
  "THURSDAY": ["4B", "1C", "2C", "3C", "8B", "9B", "12C"],
  "FRIDAY": ["5B", "6B", "7B", "10B", "11B", "XD"]
}

const slotTimings = [
  { slot: "XE", time: "08:00 AM - 09:25 AM" },
  { slot: "1A", time: "09:30 AM - 10:25 AM" },
  { slot: "2A", time: "10:35 AM - 11:25 AM" },
  { slot: "3A", time: "11:35 AM - 12:25 PM" },

  { slot: "4A", time: "08:00 AM - 09:25 AM" },
  { slot: "1B", time: "09:30 AM - 10:25 AM" },
  { slot: "2B", time: "10:35 AM - 11:25 AM" },
  { slot: "3B", time: "11:35 AM - 12:25 PM" },

  { slot: "5A", time: "08:00 AM - 09:25 AM" },
  { slot: "6A", time: "09:30 AM - 10:55 AM" },
  { slot: "7A", time: "11:05 AM - 12:30 PM" },

  { slot: "4B", time: "08:00 AM - 09:25 AM" },
  { slot: "1C", time: "09:30 AM - 10:25 AM" },
  { slot: "2C", time: "10:35 AM - 11:25 AM" },
  { slot: "3C", time: "11:35 AM - 12:25 PM" },

  { slot: "5B", time: "08:00 AM - 09:25 AM" },
  { slot: "6B", time: "09:30 AM - 10:55 AM" },
  { slot: "7B", time: "11:05 AM - 12:30 PM" },

  { slot: "8A", time: "02:00 PM - 03:25 PM" },
  { slot: "9A", time: "03:30 PM - 04:55 PM" },
  { slot: "12A", time: "05:05 PM - 06:00 PM" },

  { slot: "10A", time: "02:00 PM - 03:25 PM" },
  { slot: "11A", time: "03:30 PM - 04:55 PM" },
  { slot: "12B", time: "05:05 PM - 06:00 PM" },

  { slot: "X1", time: "02:00 PM - 02:55 PM" },
  { slot: "X2", time: "03:00 PM - 03:55 PM" },
  { slot: "X3", time: "04:00 PM - 04:55 PM" },
  { slot: "XC", time: "05:05 PM - 06:00 PM" },

  { slot: "8B", time: "02:00 PM - 03:25 PM" },
  { slot: "9B", time: "03:30 PM - 04:55 PM" },
  { slot: "12C", time: "05:05 PM - 06:00 PM" },

  { slot: "10B", time: "02:00 PM - 03:25 PM" },
  { slot: "11B", time: "03:30 PM - 04:55 PM" },
  { slot: "XD", time: "05:05 PM - 06:00 PM" }
]

module.exports = {slots, slotTimings};