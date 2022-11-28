import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from "sweetalert2";
import { Tag, Divider } from "antd";

const { TabPane } = Tabs;

function ProfileScreen() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="ms-5 mt-5 me-5 bs">
      <Tabs defaultActiveKey="1">
        <TabPane tab="Profile" key="1">
          <h1>My Profile</h1>

          <br />

          <h1>Name : {user.name}</h1>
          <h1>Email : {user.email}</h1>
          <h1>IsAdmin : {user.isadmin ? "Yes" : "No"}</h1>
        </TabPane>
        <TabPane tab="Bookings" key="2">
          <MyBookings />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default ProfileScreen;

export function MyBookings() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [bookings, setbookings] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState();

  const mybookings = async () => {
    try {
      setloading(true);
      const data = await (
        await axios.post("/api/bookings/getbookingsbyuserid", {
          userid: user._id,
        })
      ).data;
      console.log(data);
      setbookings(data);
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
      seterror(error);
    }
  };
  useEffect(() => {
    mybookings();
  }, []);

  async function cancelBooking(bookingid, roomid) {
    try {
      setloading(true);
      const result = await (
        await axios.post("/api/bookings/cancelbooking", { bookingid, roomid })
      ).data;
      console.log(result);
      setloading(false);
      Swal.fire(
        "Congrats",
        "Your Booking has been Cancelled Successfully",
        "success"
      ).then((result) => {
        window.location.reload();
      });
    } catch (error) {
      console.log(error);
      setloading(false);
      Swal.fire("Oops", "Something Went Wrong", "error");
    }
  }
  return (
    <div>
      <div className="col-md-6">
        {loading && <Loader />}
        {bookings &&
          bookings.map((booking) => {
            return (
              <div className="bs">
                <h1>{booking.room}</h1>
                <p>
                  <b>Booking Id</b> : {booking._id}
                </p>
                <p>
                  <b>CheckIn </b> : {booking.fromdate}
                </p>
                <p>
                  <b>CheckOut </b> : {booking.todate}
                </p>
                <p>
                  <b>Amount </b> : {booking.totalamount}
                </p>
                <p>
                  <b>Status </b> :{" "}
                  {booking.status == "booked" ? (
                    <Tag color="green">Confirmed</Tag>
                  ) : (
                    <Tag color="orange">Cancelled</Tag>
                  )}
                </p>

                {booking.status !== "Cancelled" && (
                  <div className="text-end">
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        cancelBooking(booking._id, booking.roomid);
                      }}
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
