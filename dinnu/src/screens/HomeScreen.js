import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { DatePicker, Select, Space } from "antd";
import "antd/dist/antd.min.css";
import moment from "moment";

const { RangePicker } = DatePicker;

function HomeScreen() {
  const [rooms, setrooms] = useState([]);
  const [loading, setloading] = useState();
  const [error, seterror] = useState();
  const [fromdate, setfromdate] = useState();
  const [todate, settodate] = useState();
  const [duprooms, setduprooms] = useState([]);
  const [searchkey, setsearchkey] = useState();
  const [type, settype] = useState("all");

  const AllRooms = async () => {
    try {
      setloading(true);
      const data = (await axios.get("/api/rooms/getallrooms")).data;
      console.log(data);
      setrooms(data);
      setduprooms(data);
      setloading(false);
    } catch (error) {
      seterror(true);
      console.log(error);
      setloading(false);
    }
  };
  useEffect(() => {
    AllRooms();
  }, []);

  function filterByDate(dates) {
    console.log(moment(dates[0]).format("DD-MM-YYYY"));
    console.log(moment(dates[1]).format("DD-MM-YYYY"));

    setfromdate(moment(dates[0]).format("DD-MM-YYYY"));
    settodate(moment(dates[1]).format("DD-MM-YYYY"));

    var temprooms = [];
    var availability = false;

    for (const room of duprooms) {
      if (room.currentbookings.length > 0) {
        for (const booking of room.currentbookings) {
          if (
            !moment(moment(dates[0]).format("DD-MM-YYYY")).isBetween(
              booking.fromdate,
              booking.todate
            ) &&
            !moment(moment(dates[1]).format("DD-MM-YYYY")).isBetween(
              booking.fromdate,
              booking.todate
            )
          ) {
            if (
              moment(dates[0]).format("DD-MM-YYYY") !== booking.fromdate &&
              moment(dates[0]).format("DD-MM-YYYY") !== booking.todate &&
              moment(dates[1]).format("DD-MM-YYYY") !== booking.fromdate &&
              moment(dates[1]).format("DD-MM-YYYY") !== booking.todate
            ) {
              availability = true;
            }
          }
        }
      }
      if (availability === true || room.currentbookings.length === 0) {
        temprooms.push(room);
      }
      setrooms(temprooms);
    }
  }

  function filterBySearch() {
    const temprooms = duprooms.filter((room) =>
      room.name.toLowerCase().includes(searchkey.toLowerCase())
    );

    setrooms(temprooms);
  }

  function filterByType(e) {
    settype(e);
    if (e !== "all") {
      const temprooms = duprooms.filter(
        (room) => room.type.toLowerCase() === e.toLowerCase()
      );

      setrooms(temprooms);
    } else {
      setrooms(duprooms);
    }
  }

  return (
    <div className="container">
      <div className="row mt-5 bs">
        <div className="col-md-3">
          <RangePicker format="DD-MM-YYYY" onChange={filterByDate} />
        </div>

        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="search rooms"
            value={searchkey}
            onChange={(e) => {
              setsearchkey(e.target.value);
            }}
            onKeyUp={filterBySearch}
          ></input>
        </div>

        <div className="col-md-3">
          <select
            className="form-control"
            value={onchange}
            onChange={(e) => {
              filterByType(e.target.value);
            }}
          >
            <option value="all">All</option>
            <option value="delux">Delux</option>
            <option value="non-delux">Non-Delux</option>
          </select>
        </div>
      </div>

      <div className="row justify-content-center mt-5">
        {loading ? (
          <h1>
            <Loader />
          </h1>
        ) : (
          rooms.map((room) => {
            return (
              <div className="col-md-9 mt-2">
                <Room room={room} fromdate={fromdate} todate={todate} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
