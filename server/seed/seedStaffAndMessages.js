const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const OperationStaff = require("../models/OperationStaff");
const ManagementStaff = require("../models/ManagementStaff");
const ContactpageMessage = require("../models/ContactpageMessage");

const seedStaffAndMessages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    // Clear existing data
    await OperationStaff.deleteMany({});
    await ManagementStaff.deleteMany({});
    await ContactpageMessage.deleteMany({});
    console.log("Cleared existing staff and message data");

    // Seed Operation Staff
    const operationStaffData = [
      {
        fullName: "Maria Garcia",
        email: "maria.garcia@hotelstaff.com",
        phone: "0912345678",
        role: "Housekeeper",
      },
      {
        fullName: "Juan Miguel Rodriguez",
        email: "juan.rodriguez@hotelstaff.com",
        phone: "0987654321",
        role: "Maintenance",
      },
    ];

    const operationStaff = await OperationStaff.insertMany(operationStaffData);
    console.log("✓ 2 Operation Staff documents created");

    // Seed Management Staff
    const managementStaffData = [
      {
        fullName: "Robert James Thompson",
        email: "robert.thompson@hotelmanagement.com",
        password: "SecurePass123!",
        phone: "0911223344",
        role: "Chief Manager",
      },
      {
        fullName: "Sarah Elizabeth Wilson",
        email: "sarah.wilson@hotelmanagement.com",
        password: "ManagerPass456@",
        phone: "0922334455",
        role: "Manager",
      },
    ];

    const managementStaff = await ManagementStaff.insertMany(managementStaffData);
    console.log("✓ 2 Management Staff documents created");

    // Seed Contact Page Messages
    const messagesData = [
      {
        name: "John Doe",
        email: "john.doe@example.com",
        message: "I would like to inquire about your room availability for next month and special packages you might offer for corporate bookings.",
        attachments: [
          {
            filename: "company_details.pdf",
            fileType: "pdf",
            size: 245000,
            url: "/uploads/company_details.pdf",
          },
        ],
      },
      {
        name: "Emma Louise Martinez",
        email: "emma.martinez@company.org",
        message: "Your hotel looks wonderful! I'm interested in booking for our anniversary celebration. Could you please send me information about romantic packages?",
        attachments: [
          {
            filename: "preferences.docx",
            fileType: "docx",
            size: 128000,
            url: "/uploads/preferences.docx",
          },
          {
            filename: "venue_photo.jpg",
            fileType: "jpg",
            size: 2048000,
            url: "/uploads/venue_photo.jpg",
          },
        ],
      },
    ];

    const messages = await ContactpageMessage.insertMany(messagesData);
    console.log("✓ 2 Contact Page Message documents created");

    console.log("\n--- Seeded Data Summary ---");
    console.log("Operation Staff:");
    operationStaff.forEach((staff) => {
      console.log(`  - ${staff.fullName} (${staff.role})`);
    });

    console.log("\nManagement Staff:");
    managementStaff.forEach((staff) => {
      console.log(`  - ${staff.fullName} (${staff.role})`);
    });

    console.log("\nContact Messages:");
    messages.forEach((msg) => {
      console.log(
        `  - From ${msg.name} (${msg.attachments.length} attachments)`
      );
    });

    console.log("\nSeeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error.message);
    process.exit(1);
  }
};

seedStaffAndMessages();
