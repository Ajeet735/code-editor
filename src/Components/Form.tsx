import React from "react";
import { useState } from "react";
import axios from "axios";
import "./Form.css";

export function Form() {
  interface formdata {
    name: string;
    email: string;
    password: any;
    DOB: string;
    gender:string
    address: string;
  }

  const [FormInput, setInput] = useState<formdata>({
    name: "",
    email: "",
    password: "",
    DOB: "",
   gender:"",
    address: "",
  });

  const ChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log(e.target)
    const { name, value } = e.target;
    setInput((prevstate) => ({
      ...prevstate,
      [name]: value,
    }));
  };

  const submithandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try{
        const Response = await axios.post("http://localhost:5000/api/register", FormInput);
        if(Response.status === 200){
            alert("Regilstration successfully!");
    
            setInput({
                name: "",
                email: "",
                password: "",
                DOB: "",
                gender:"",
                address: "",
              });
        }
        else{
            alert("Fail to submit the form!")
        }
    } catch (error) {
        console.error("Error submitting form:", error);
    }
    

    
  };

  return (
    <div>
      <form onSubmit={submithandler}>
        <fieldset>
          <legend>Registration Form</legend>
          <label htmlFor="name">Enter Your Name</label>
          <input
          value={FormInput.name}
            onChange={ChangeHandler}
            type="text"
            name="name"
            id="name"
            required
          />

          <label htmlFor="email">Enter Your Email</label>
          <input
          value={FormInput.email}
            onChange={ChangeHandler}
            type="email"
            name="email"
            id="email"
            required
          />

          <label htmlFor="password">Enter Your Password</label>
          <input
          value={FormInput.password}
            onChange={ChangeHandler}
            type="password"
            name="password"
            id="password"
            required
          />

          <label htmlFor="DOB">Enter Your Date of Birth</label>
          <input
          value={FormInput.DOB}
            onChange={ChangeHandler}
            type="date"
            name="DOB"
            id="DOB"
            required
          />

<label>Enter Your Gender</label>
<div className="gender-group">
  <label htmlFor="male">Male</label>
  <input
    type="radio"
    id="male"
    name="gender"
    value="male"
    checked={FormInput.gender === "male"}
    onChange={ChangeHandler}
    required
  />

  <label htmlFor="female">Female</label>
  <input
    type="radio"
    id="female"
    name="gender"
    value="female"
    checked={FormInput.gender === "female"}
    onChange={ChangeHandler}
    required
  />

  <label htmlFor="others">Others</label>
  <input
    type="radio"
    id="others"
    name="gender"
    value="others"
    checked={FormInput.gender === "others"}
    onChange={ChangeHandler}
    required
  />
</div>


          <label htmlFor="address">Enter Your Address</label>
          <textarea
          value={FormInput.address}
            onChange={ChangeHandler}
            id="address"
            name="address"
            required
          />
          <button type="submit">submit</button>
        </fieldset>
      </form>
    </div>
  );
}
export default Form;
