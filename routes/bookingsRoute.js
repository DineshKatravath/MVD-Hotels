const { response } = require("express");
const express = require("express");
const router = express.Router();
const moment = require("moment");
const Room = require("../models/room");
const stripe = require("stripe")(
  "sk_test_51KqANtSHYtTPG53LfPDR91oK0ETiM6PkKg2SzWm33Rs2kfZfxosNYmz3AzPgCeMUs7CzWMQG0UiXo8p3rppchXVD00XBNo3YZq"
);
const { v4: uuidv4 } = require("uuid");
const Booking = require("../models/booking");

router.post("/bookroom", async (req, res) => {
  const { room, userid, fromdate, todate, totalamount, totaldays, token } =
    req.body;
  console.log(room);
  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    // const payment = await stripe.charges.create(
    //   {
    //     amount: totalamount * 100,
    //     customer: customer.id,
    //     currency: "inr",
    //     receipt_email: token.email,
    //   },
    //   {
    //     idempotencyKey: uuidv4(),
    //   }
    // );

    const payment = await stripe.paymentIntents.create(
      {
        amount: totalamount * 100,
        currency: "inr",
        customer: customer.id,
        payment_method_types: ["card"],
        receipt_email: token.email,
        confirmation_method: "automatic",
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      const newbooking = new Booking({
        room: room.name,
        roomid: room._id,
        userid,
        fromdate: moment(fromdate).format("DD-MM-YYYY"),
        todate: moment(todate).format("DD-MM-YYYY"),
        totalamount,
        totaldays,
        transactionId: "1234",
      });

      const booking = await newbooking.save();

      const roomtemp = await Room.findOne({ _id: room._id });

      roomtemp.currentbookings.push({
        bookingid: booking._id,
        fromdate: moment(fromdate).format("DD-MM-YYYY"),
        todate: moment(todate).format("DD-MM-YYYY"),
        userid: userid,
        status: booking.status,
      });

      await roomtemp.save();
    }
    res.send("Payment Successful , Your Room is Booked");
  } catch (error) {
    console.log(error);

    return res.status(400).json({ message: error });
  }
});

router.post("/getbookingsbyuserid", async (req, res) => {
  const userid = req.body.userid;

  try {
    const bookings = await Booking.find({ userid: userid });
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/cancelbooking", async (req, res) => {
  const { bookingid, roomid } = req.body;
  try {
    const bookingitem = await Booking.findOne({ _id: bookingid });

    bookingitem.status = "Cancelled";

    await bookingitem.save();

    const room = await Room.findOne({ _id: roomid });

    const bookings = room.currentbookings;

    const temp = bookings.filter(
      (booking) => booking.bookingid.toString() !== bookingid
    );

    room.currentbookings = temp;

    await room.save();

    res.send("Your Booking has been Cancelled Successfully.");
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
