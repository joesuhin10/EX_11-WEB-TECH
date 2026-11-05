const { MongoClient } = require("mongodb");
const fs = require("fs");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

async function main() {
  try {
    await client.connect();
    console.log("======================================");
    console.log(" CONNECTED TO MONGODB SUCCESSFULLY");
    console.log("======================================");

    const db = client.db("ToyStoreDB");
    const toys = db.collection("toys");
    console.log("Database: ToyStoreDB");
    console.log("Collection: toys");

    // Start fresh so the program can be run again without duplicate records
    await toys.deleteMany({});

    // CREATE
    const insertResult = await toys.insertMany([
      { toyId: 201, name: "Turbo Remote Control Car", category: "Vehicles", brand: "SpeedX", minAge: 6, price: 1499, stock: 25, icon: "🚗" },
      { toyId: 202, name: "Castle Building Blocks Set", category: "Building Blocks", brand: "BrickMaster", minAge: 8, price: 2999, stock: 15, icon: "🏰" },
      { toyId: 203, name: "Cuddly Teddy Bear", category: "Soft Toys", brand: "CuddleCo", minAge: 1, price: 599, stock: 40, icon: "🧸" },
      { toyId: 204, name: "Deluxe Chess Board", category: "Board Games", brand: "MindPlay", minAge: 7, price: 899, stock: 30, icon: "♟️" },
      { toyId: 205, name: "Fashion Doll Dream House", category: "Dolls", brand: "GlamKids", minAge: 4, price: 1999, stock: 12, icon: "🏠" },
      { toyId: 206, name: "500-Piece Jigsaw Puzzle", category: "Puzzles", brand: "PuzzleHub", minAge: 8, price: 399, stock: 50, icon: "🧩" },
      { toyId: 207, name: "Splash Water Blaster", category: "Outdoor Toys", brand: "SplashZone", minAge: 5, price: 299, stock: 0, icon: "💦" },
      { toyId: 208, name: "Ludo and Snakes & Ladders", category: "Board Games", brand: "MindPlay", minAge: 5, price: 349, stock: 60, icon: "🎲" },
    ]);
    console.log(`\n${insertResult.insertedCount} Toy Records Inserted Successfully`);

    // READ
    const allToys = await toys.find({}).toArray();
    console.log("\n========== ALL TOYS ==========");
    console.log(allToys);

    const searchToy = await toys.findOne({ name: "Deluxe Chess Board" });
    console.log("\n========== SEARCH TOY ==========");
    console.log(searchToy);

    const costly = await toys.find({ price: { $gt: 1500 } }).toArray();
    console.log("\n========== PRICE ABOVE 1500 ==========");
    console.log(costly);

    const selected = await toys.find({
      category: { $in: ["Vehicles", "Dolls"] },
    }).toArray();
    console.log("\n========== VEHICLES AND DOLLS ==========");
    console.log(selected);

    // UPDATE
    const updateResult = await toys.updateOne(
      { toyId: 204 },
      { $set: { price: 799 } }
    );
    console.log("\nUpdated Records:", updateResult.modifiedCount);

    const updateManyResult = await toys.updateMany(
      { category: "Board Games" },
      { $inc: { price: 50 } }
    );
    console.log("Board Game Prices Updated:", updateManyResult.modifiedCount);

    const updated = await toys.find({ category: "Board Games" }).toArray();
    console.log("\n========== UPDATED TOYS ==========");
    console.log(updated);

    // SORT, LIMIT AND COUNT
    const sorted = await toys.find({}).sort({ price: -1 }).toArray();
    console.log("\n========== SORTED BY PRICE (HIGH TO LOW) ==========");
    console.log(sorted);

    const topThree = await toys.find({}).sort({ price: -1 }).limit(3).toArray();
    console.log("\n========== TOP THREE COSTLIEST TOYS ==========");
    console.log(topThree);

    console.log("\nTotal Number of Toys:", await toys.countDocuments());
    console.log("Board Games:", await toys.countDocuments({ category: "Board Games" }));

    // DELETE
    const deleteResult = await toys.deleteOne({ toyId: 206 });
    console.log("\nDeleted Records:", deleteResult.deletedCount);

    const deleteManyResult = await toys.deleteMany({ stock: 0 });
    console.log("Out-of-Stock Toys Deleted:", deleteManyResult.deletedCount);

    const remaining = await toys.find({}, { projection: { _id: 0 } }).toArray();
    console.log("\n========== REMAINING TOYS ==========");
    console.log(remaining);
    console.log("\nFinal Toy Count:", await toys.countDocuments());

    // Export remaining records so the static website (toys.js) shows a copy of the database
    fs.writeFileSync(
      "toys.js",
      "const toys = " + JSON.stringify(remaining, null, 2) + ";\n"
    );
    console.log("\ntoys.js updated for the website");

    console.log("\n======================================");
    console.log(" TOY STORE DATABASE OPERATIONS DONE");
    console.log("======================================");
  } catch (error) {
    console.error("Database Error:", error.message);
  } finally {
    await client.close();
    console.log("\nMongoDB Connection Closed");
  }
}

main();
