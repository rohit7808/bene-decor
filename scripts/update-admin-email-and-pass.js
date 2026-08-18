const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const uri = process.env.MONGODB_URI || "mongodb+srv://rohitk6084_db_user:ZBweM53sH7fGhhRT@cluster0.udbswni.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const oldEmail = "admin@benedecor.com";
const newEmail = "saadgifurniture@gmail.com";
const adminPassword = "Vaibhav@21";

async function main() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("Connected successfully.");

    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");

    // 1. Check if user exists with old email or new email or role: 'admin'
    let adminUser = await usersCollection.findOne({ email: oldEmail });
    if (!adminUser) {
      adminUser = await usersCollection.findOne({ email: newEmail });
    }
    if (!adminUser) {
      adminUser = await usersCollection.findOne({ role: "admin" });
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    if (adminUser) {
      console.log(`Found existing admin user with ID: ${adminUser._id}, Current email: ${adminUser.email}`);
      const res = await usersCollection.updateOne(
        { _id: adminUser._id },
        {
          $set: {
            email: newEmail,
            password: hashedPassword,
            role: "admin",
            isActive: true,
            emailVerified: true,
            updatedAt: new Date(),
          },
        }
      );
      console.log(`Successfully updated admin user email to "${newEmail}" and password hash. Modified count: ${res.modifiedCount}`);
    } else {
      console.log(`No existing admin user found. Creating single admin user with email "${newEmail}"...`);
      const res = await usersCollection.insertOne({
        name: "Administrator",
        email: newEmail,
        password: hashedPassword,
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

    // Clean up any extraneous admin users if more than 1 existed
    const allAdmins = await usersCollection.find({ role: "admin" }).toArray();
    console.log(`Total admin users in database: ${allAdmins.length}`);
    for (const adm of allAdmins) {
      if (adm.email !== newEmail) {
        console.log(`Updating remaining admin account (${adm.email}) -> (${newEmail})`);
        await usersCollection.updateOne(
          { _id: adm._id },
          { $set: { email: newEmail, password: hashedPassword } }
        );
      }
    }

    // Verify current state
    const finalAdmin = await usersCollection.findOne({ email: newEmail });
    console.log("=========================================");
    console.log("FINAL ADMIN VERIFICATION:");
    console.log(`User ID: ${finalAdmin._id}`);
    console.log(`Email: ${finalAdmin.email}`);
    console.log(`Role: ${finalAdmin.role}`);
    console.log(`Is Active: ${finalAdmin.isActive}`);
    console.log("=========================================");

  } catch (err) {
    console.error("Error updating admin user in MongoDB:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

main();
