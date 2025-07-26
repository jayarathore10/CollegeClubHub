const mongoose = require("mongoose");
const User = require("./models/user"); // adjust path if needed

async function runTest() {
  try {
    await mongoose.connect("mongodb://localhost:27017/eventdeco", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const clubId = "6877605bd3fa6fc2ff2e8006";

    const members = await User.find({
      clubs: {
        $elemMatch: {
          _id: new mongoose.Types.ObjectId(clubId)
        }
      }
    });

    console.log("✅ Members found:", members);
    process.exit();
  } catch (error) {
    console.error("❌ Error occurred:", error);
    process.exit(1);
  }
}

runTest();
