const amqp = require("amqplib");

const invalidatedTokens = new Set();
let channel = null;

async function connect() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');

        connection.on("close", () => {
            console.error("Connection to RabbitMQ closed!");
            channel = null;
        });
        
        connection.on("error", (err) => {
            console.error("Connection to RabbitMQ error:", err);
            channel = null;
        });

    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error.message);
        throw error;
    }
}

async function publishToQueue(queue, message) {
    try {
        if (!channel) {
            await connect();
        }
        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(message));
    } catch (error) {
        console.error("Error in publishing message:", error);
        throw error; 
    }
}


async function consumeMessages() {
    try {
        if (!channel) {
            await connect();
        }
        await channel.assertQueue("invalidatedTokens", { durable: true });
        channel.consume("invalidatedTokens", (msg) => {
            if (msg !== null) {
                const token = msg.content.toString();
                invalidatedTokens.add(token);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("Error in consuming message:", error);
    }
}

// Ensure messages are consumed upon start
consumeMessages();

module.exports = {
    publishToQueue,
    invalidatedTokens
};
