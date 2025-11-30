const nodemailer = require("nodemailer");

const sendOrderEmail = async (order, userEmail) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const emailHTML = `
    <h2>Your Order is Confirmed 🎉</h2>
    <p>Order ID: <strong>${order._id}</strong></p>
    <p>Date: ${new Date(order.orderDate).toLocaleString()}</p>
    <h3>Items:</h3>
    <ul>
      ${order.items
        .map(
          (item) =>
            `<li>${item.name} (${item.size}) × ${item.qty} — ₹${
              item.price * item.qty
            }</li>`
        )
        .join("")}
    </ul>
    <h2>Total: ₹${order.totalPrice}</h2>
    <p>Thank you for shopping with us ❤️</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Your Order #${order._id} is Confirmed`,
    html: emailHTML,
  });
};

module.exports = sendOrderEmail;
