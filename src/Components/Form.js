import React from "react";
import { useState, axios } from "react";

export const Form = () => {
    const [input, setInput] = useState({
        name:'',
        email:'',
        password:'',
        DOB:'',
        gender:'',
        address:''
    })
const submithandler = async(e) => {
e.preventdefault();

try{
const response = await axios.post("http://localhost:5000/register",input);
console.log("Server Response:", response.data);
}
catch(error){
console.error("error sending form data", error)
}
}
const ChangeHandler = (e) => {
    const {name, value} = e.target
    setInput((prev) => ({
        ...prev,
        [name]: value,
      }));

// const name = "email";
// const value = "ajeet@example.com";

// const obj = {
//   [name]: value
// };

// console.log(obj);
// Output: { email: "ajeet@example.com" }
//Without [ ], JavaScript would think you're trying to create a key literally called "name" instead of "email".
}
    return (<div>
        <form onSubmit={submithandler}>
          <fieldset>
            <legend>Registration Form</legend>
            <label htmlFor="name">Enter Your Name</label>
            <input value={input.name} onChange={ChangeHandler} type="text" name="name" id="name" required/>
  
            <label htmlFor="email">Enter Your Email</label>
            <input value={input.email} onChange={ChangeHandler} type="email" name="email" id="email" required/>
  
            <label htmlFor="password">Enter Your Password</label>
            <input value={input.password} onChange={ChangeHandler} type="password" name="password" id="password" required/>
  
            <label htmlFor="DOB">Enter Your Date of Birth</label>
            <input value={input.DOB} onChange={ChangeHandler} type="date" name="DOB" id="DOB" required/>
  
      <label>Enter Your Gender</label>
      <div className="gender-group">
    <label htmlFor="male">Male</label>
    <input type="radio" id="male" name="gender" value="male" checked={input.gender === "male"} onChange={ChangeHandler} required/>
  
    <label htmlFor="female">Female</label>
    <input type="radio" id="female" name="gender" value="female" checked={input.gender === "female"} onChange={ChangeHandler} required/>
  
    <label htmlFor="others">Others</label>
    <input type="radio" id="others" name="gender" value="others" checked={input.gender === "others"} onChange={ChangeHandler} required/>
      </div>
  
  
            <label htmlFor="address">Enter Your Address</label>
            <textarea value={input.address} onChange={ChangeHandler} id="address" name="address" required/>
            <button type="submit">submit</button>
          </fieldset>
        </form>
      </div>);
  }
  
