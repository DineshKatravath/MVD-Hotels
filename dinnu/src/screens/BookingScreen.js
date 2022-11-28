import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
// ..
AOS.init({
  duration: 1500,
});

function BookingScreen() {
  const params = useParams();

  const [loading, setloading] = useState(true);
  const [error, seterror] = useState();
  const [room, setroom] = useState();

  const roomid = params.roomid;
  const fromdate = moment(params.fromdate, "DD-MM-YYYY");
  const todate = moment(params.todate, "DD-MM-YYYY");

  const totaldays = moment.duration(todate.diff(fromdate)).asDays() + 1;

  const BookRooms = async () => {
    if (!localStorage.getItem("currentUser")) {
      window.location.href = "/login";
    }

    try {
      setloading(true);
      const data = (
        await axios.post("/api/rooms/getroombyid", { roomid: params.roomid })
      ).data;

      console.log(data);
      setroom(data);
      setloading(false);
    } catch (error) {
      setloading(false);
      seterror(true);
    }
  };

  useEffect(() => {
    BookRooms();
  }, []);

  // async function booknow() {
  //   const bookingDetails = {
  //     room,
  //     userid: JSON.parse(localStorage.getItem("currentUser"))._id,
  //     fromdate,
  //     todate,
  //     totalamount: room.rentperday * totaldays,
  //     totaldays,
  //   };

  //   try {
  //     const result = await axios.post("/api/bookings/bookroom", bookingDetails);
  //   } catch (error) {}
  // }
  async function onToken(token) {
    console.log(token);
    const bookingDetails = {
      room,
      userid: JSON.parse(localStorage.getItem("currentUser"))._id,
      fromdate,
      todate,
      totalamount: room.rentperday * totaldays,
      totaldays,
      token,
    };
    console.log(bookingDetails);
    try {
      setloading(true);
      const result = await axios.post("/api/bookings/bookroom", bookingDetails);
      setloading(false);
      Swal.fire(
        "Congratulations",
        "Your Room Booked Successfully",
        "success"
      ).then((result) => {
        window.location.href = "/profile";
      });
    } catch (error) {
      setloading(false);
      Swal.fire("OOps! ", "Something Went Wrong", "error");
    }
  }
  return (
    <div className="m-5" data-aos="flip-left">
      {loading ? (
        <h1>
          <Loader />
        </h1>
      ) : room ? (
        <div>
          <div className="row justify-content-center mt-5 bs">
            <div className="col-md-6">
              <h1>{room.name}</h1>
              <img src={room.imageurls[0]} className="bigimg" />
            </div>
            <div className="col-md-6">
              <div style={{ textAlign: "right" }}>
                <h1>Booking Details</h1>
                <hr />
                <b>
                  <p>
                    Name :{" "}
                    {JSON.parse(localStorage.getItem("currentUser")).name}{" "}
                  </p>
                  <p>From Date : {params.fromdate} </p>
                  <p>To Date : {params.todate} </p>
                  <p>Max Count : {room.maxcount}</p>
                </b>
              </div>

              <div style={{ textAlign: "right" }}>
                <b>
                  <h1>Amount : </h1>
                  <hr />
                  <p>Total Days : {totaldays}</p>
                  <p>Rent Per Day : {room.rentperday}</p>
                  <p>Total Amount : {room.rentperday * totaldays}</p>
                </b>
              </div>

              <div style={{ float: "right" }}>
                <StripeCheckout
                  amount={room.rentperday * totaldays * 100}
                  token={onToken}
                  currency="INR"
                  stripeKey="pk_test_51KqANtSHYtTPG53L4xqJgkx4WCg3OGPBpyKH1dPfAN3HZ46n13I5xAdjGh9IZIJj8WHsuJErtmEdQ8i6x4iz300z00OpodpXgj"
                >
                  <button className="btn btn-primary">Pay Now</button>
                </StripeCheckout>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Error message="Something Went Wrong Please Try Again Later...." />
      )}
    </div>
  );
}

export default BookingScreen;
