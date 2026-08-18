const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("Please specify MONGODB_URI in environment variables.");
  process.exit(1);
}

const targetPassword = process.env.ADMIN_NEW_PASSWORD;

if (!targetPassword) {
  console.error("Please specify ADMIN_NEW_PASSWORD environment variable.");
  process.exit(1);
}

async function main() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("Connected successfully.");

    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");

    const newHash = await bcrypt.hash(targetPassword, 10);

    const adminUser = await usersCollection.findOne({ email: "saadgifurniture@gmail.com" });

    if (adminUser) {
      console.log("Found existing admin user:", adminUser.email);
      const res = await usersCollection.updateOne(
        { _id: adminUser._id },
        { $set: { password: newHash, role: "admin", isActive: true } }
      );
      console.log("Admin password updated successfully! Modified count:", res.modifiedCount);
    } else {
      console.log("Admin user saadgifurniture@gmail.com not found. Creating new admin user...");
      const res = await usersCollection.insertOne({
        name: "Administrator",
        email: "saadgifurniture@gmail.com",
        password: newHash,
        role: "admin",
        isActive: true,
        emailVerified: true,
        addresses: [],
        wishlist: [],
        cart: [],
        orders: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("Admin user created with ID:", res.insertedId);
    }
  } catch (err) {
    console.error("Error updating admin password:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

main();
