const mongoose = require("mongoose");
require("dotenv").config();

const app = require("./app");
const seedSuperAdmin = require("./config/seed");

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("MongoDB Connected");

        // Seed/Verify Super Admin on startup
        await seedSuperAdmin();

        app.listen(5000, () => {
            console.log(" 🚀 Server running on port 5000");
        });
    })
    .catch((err) => console.log(err));