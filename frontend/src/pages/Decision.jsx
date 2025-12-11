import React, { useState } from "react";

export default function Decision() {
  // Correctly define state inside the component body
  const [expanded, setExpanded] = useState(false);

  return (



 <div className="bg-green-200 h-[100vh] ">
                                                                  
 
<div className=" flex flex-wrap items-center gap-6">
     {/* NavBar Section */}
     <div class=" navbar bg-base-100 shadow-sm">

      <div className="flex items-center gap-4">
            <img
              className="h-20 w-20 rounded-full object-cover border-2 border-blue-200"
              src="../src/assets/committee.jpg"
            />
            <h1 className="my-2 font-semibold text-xl">Decision Committee Panel</h1>
            <button className="btn btn-neutral" >
              Logout
            </button>
        
    </div>

</div>

<div className="flex gap-4 justify-between">

{/* Message section */}
  <div className="m-2">

<div class="card  bg-base-100 w-[49vw] shadow-sm h-[77vh] p-2 overflow-scroll">

  <div class="card-body">
    
  {/* Message */}
  <h1 className="text-center font-semibold mb-2 font-sans text-2xl">🔔 New Messages</h1>
  <div class="card hover:bg-base-200 bg-base-100 w-[45vw]  shadow-sm">
    <div class="card-body">
      <div className="flex gap-4">
    <h2 class="card-title">Broken Classroom Projector</h2>
    <span className="badge font-semibold bg-red-400 text-white">Private</span>  
    </div>
    <p className=" text-gray-700 font-sans m-2 line-clamp-2 ">The projector in Room 305 is not functioning properly. It flickers and sometimes shuts down during lectures, making it difficult for students to follow the class. Requesting maintenance as soon as possible.</p>
    <div class="card-actions justify-end">
  {/* Response */}


 {/* You can open the modal using document.getElementById('ID').showModal() method */}


{/* Forwarded to chairman */}

<button className="btn bg-cyan-600 hover:bg-cyan-500 text-white" onClick={()=>document.getElementById('my_modal_3').showModal()}>Forward</button>
<dialog id="my_modal_3" className="modal">
  <div className="modal-box">
    <form method="dialog">
      {/* if there is a button in form, it will close the modal */}
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 text-2xl top-2">✕</button>
    </form>
    {/* problem response */}

    <div className="flex gap-4">
    <h2 class="card-title">Broken Classroom Projector</h2>
    <span className="badge font-semibold bg-red-400 text-white">Private</span>  
    </div>
   <div className="flex-1">

    {/* paragraph */}
   <p
  className={`text-gray-700 font-sans m-1 ${!expanded ? "line-clamp-2" : ""}`}
>
  The projector in Room 305 is not functioning properly. It flickers and sometimes shuts down during lectures, making it difficult for students to follow the class. Requesting maintenance as soon as possible.
</p>
{/* see more function */}
<button
  className="text-blue-500 hover:underline m-2"
  onClick={() => setExpanded(!expanded)}
>
  {expanded ? "See less" : "See more"}
</button>
</div>
   
   <div className=" gap-4">
            
      {/* selection dropdown */}

 <div className="m-4">
   <label for="role" class="block mb-1 font-medium text-gray-700">
  
</label>

<select
  id="role"
  name="role"
  required
  class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
>
  <option value="">-- Select Role --</option>
  <option value="Chairman">Chairman</option>
  <option value="Deen">Deen</option>
  <option value="VC">VC</option>
</select>


    </div>


          
  <button
              className="flex items-center justify-center gap-2 bg-green-500 w-full py-2 hover:bg-green-400 rounded-full text-white font-semibold transition duration-150"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M3.4 20.4 22 12 3.4 3.6 3 10l12 2-12 2z" />
              </svg>
              Send
            </button>
          

            </div>




  </div>
</dialog>









{/* Solution option */}
<button className="btn bg-green-600 hover:bg-green-500 text-white" onClick={()=>document.getElementById('my_modal_4').showModal()}>Solution</button>
<dialog id="my_modal_4" className="modal">
  <div className="modal-box">
    <form method="dialog">
      {/* if there is a button in form, it will close the modal */}
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 text-2xl top-2">✕</button>
    </form>
    {/* problem response */}

    <div className="flex gap-4">
    <h2 class="card-title">Broken Classroom Projector</h2>
    <span className="badge font-semibold bg-red-400 text-white">Private</span>  
    </div>
   <div className="flex-1">

    {/* paragraph */}
   <p
  className={`text-gray-700 font-sans m-1 ${!expanded ? "line-clamp-2" : ""}`}
>
  The projector in Room 305 is not functioning properly. It flickers and sometimes shuts down during lectures, making it difficult for students to follow the class. Requesting maintenance as soon as possible.
</p>
{/* see more function */}
<button
  className="text-blue-500 hover:underline m-2"
  onClick={() => setExpanded(!expanded)}
>
  {expanded ? "See less" : "See more"}
</button>
</div>
   
   <div className=" gap-4">
            <fieldset className="fieldset rounded py-4 mb-2">
              <legend className="fieldset-legend text-[14px] font-sans">
               Solution Comment
              </legend>
              <input
                type="text"
                className="input w-full px-3 py-3 border rounded "
                placeholder="Write the solution or resolution here…" 
              
              />
            </fieldset>

          
  <button
              className="flex items-center justify-center gap-2 bg-green-500 w-full py-2 hover:bg-green-400 rounded-full text-white font-semibold transition duration-150"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M3.4 20.4 22 12 3.4 3.6 3 10l12 2-12 2z" />
              </svg>
              Send
            </button>
          

            </div>




  </div>
</dialog>


{/* Reject option */}
  
  <button className="btn bg-red-600 hover:bg-red-500 text-white" onClick={()=>document.getElementById('my_modal_5').showModal()}>Reject</button>
<dialog id="my_modal_5" className="modal">
  <div className="modal-box">
    <form method="dialog">
      {/* if there is a button in form, it will close the modal */}
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 text-2xl top-2">✕</button>
    </form>
    {/* problem response */}

    <div className="flex gap-4">
    <h2 class="card-title">Broken Classroom Projector</h2>
    <span className="badge font-semibold bg-red-400 text-white">Private</span>  
    </div>
   <div className="flex-1">

    {/* paragraph */}
   <p
  className={`text-gray-700 font-sans m-1 ${!expanded ? "line-clamp-2" : ""}`}
>
  The projector in Room 305 is not functioning properly. It flickers and sometimes shuts down during lectures, making it difficult for students to follow the class. Requesting maintenance as soon as possible.
</p>
{/* see more function */}
<button
  className="text-blue-500 hover:underline m-2"
  onClick={() => setExpanded(!expanded)}
>
  {expanded ? "See less" : "See more"}
</button>
</div>
   
   <div className=" gap-4">
            <fieldset className="fieldset rounded py-4 mb-2">
              <legend className="fieldset-legend text-[14px] font-sans">
                Rejection Comment
              </legend>
              <input
                type="text"
                className="input w-full px-3 py-3 border rounded "
                placeholder="Write your rejection reason here…" 
              
              />
            </fieldset>

          
  <button
              className="flex items-center justify-center gap-2 bg-green-500 w-full py-2 hover:bg-green-400 rounded-full text-white font-semibold transition duration-150"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M3.4 20.4 22 12 3.4 3.6 3 10l12 2-12 2z" />
              </svg>
              Send
            </button>
          

            </div>




  </div>
</dialog>

    </div>
  </div>
</div>
  </div>
</div>


</div>
{/* Message section reponse */}
  <div className="m-2">
 
<div class="card  bg-base-100 w-[47vw] shadow-sm  p-2  h-[77vh] overflow-scroll">
  <div class="card-body">
    <h1 className="text-center font-semibold mb-2 font-sans text-2xl">✅ Solved Messages</h1>
  {/* Message */}

  <div class="card bg-base-100 w-[43vw]  shadow-sm">
  <div class="card-body">
    <div className="flex gap-4 ">
    <h2 class="card-title">Broken Classroom Projector</h2>
    {/* private or public */}
    <span className="badge bg-red-400 font-semibold text-white">Private</span>  
            
    </div>
    <p className=" text-gray-700 font-sans m-2 line-clamp-2 ">The projector in Room 305 is not functioning properly. It flickers and sometimes shuts down during lectures, making it difficult for students to follow the class. Requesting maintenance as soon as possible.</p>
    <div class="card-actions justify-end">
      {/* approved or rejected status */}
         <span className="badge bg-cyan-500 p-2 font-normal text-emerald-100">Chairman</span> 
      <span className="badge bg-green-500 p-2 font-normal text-green-100">Solved</span> 
      <span className="badge bg-red-500 p-2 font-normal text-red-100">Rejected</span> 
   

  {/* Response */}


  <div>



  







  </div>


{/* Reject option */}
<div>



  </div>
    </div>
  </div>
</div>
  </div>
</div>

</div>
</div>
         
    </div>
   </div>   
   
   
  );



  
};

