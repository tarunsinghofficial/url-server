const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`\nMongoDb connected || DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("ERROR", error);
        process.exit(1);
    }
}

module.exports = connectDB;
