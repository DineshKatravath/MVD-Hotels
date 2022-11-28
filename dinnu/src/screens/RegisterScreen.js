import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from "../components/Success";

function RegisterScreen() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");

  const [loading, setloading] = useState(false);
  const [error, seterror] = useState();
  const [success, setsuccess] = useState(false);

  async function register() {
    //email validation
    if (/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/.test(email)) {
      if (password === cpassword) {
        const user = { name, email, password, cpassword };
        console.log(user);

        try {
          setloading(true);
          const result = await (
            await axios.post("/api/users/register", user)
          ).data;
          setloading(false);
          setsuccess(true);
          console.log(success);
          setname("");
          setemail("");
          setpassword("");
          setcpassword("");
        } catch (error) {
          console.log(error);
          setloading(false);
          seterror(true);
        }
      } else {
        alert("Passwords Do not Match ");
      }
    } else {
      alert("Enter a Valid Email-id ");
    }
  }
  return (
    <div>
      {loading && <Loader />}
      {error && <Error />}
      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
          {success && <Success message="Registration Successful" />}
          <div className="bs">
            <h2>Register</h2>
            <input
              type="text"
              className="form-control mt-2"
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setname(e.target.value);
              }}
              required
            />
            <input
              type="email"
              className="form-control mt-2"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setemail(e.target.value);
              }}
              required
            />
            <input
              type="password"
              className="form-control mt-2"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setpassword(e.target.value);
              }}
              required
            />
            <input
              type="password"
              className="form-control mt-2"
              placeholder="Confirm Password"
              value={cpassword}
              onChange={(e) => {
                setcpassword(e.target.value);
              }}
              required
            />

            <div className="d-flex justify-content-center">
              <button className="btn btn-primary mt-3" onClick={register}>
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen;
