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
  <h1 className="text-center font-semibold mb-2 font-sans text-2xl">New Messages</h1>
  <div class="card hover:bg-base-200 bg-base-100 w-[43vw]  shadow-sm">
    <div class="card-body">
      <div className="flex gap-4">
    <h2 class="card-title">Broken Classroom Projector</h2>
    <span className="badge font-semibold bg-red-400 text-white">Private</span>  
    </div>
    <p className=" text-gray-700 font-sans m-2 line-clamp-2 ">The projector in Room 305 is not functioning properly. It flickers and sometimes shuts down during lectures, making it difficult for students to follow the class. Requesting maintenance as soon as possible.</p>
    <div class="card-actions justify-end">
  {/* Response */}


  <div>


<label for="my_modal_6" class="btn hover:bg-green-500 bg-green-600 text-white font-semibold">Solution</label>

<input type="checkbox" id="my_modal_6" class="modal-toggle" />
<div class="modal " role="dialog">
  <div class="modal-box h-[60vh]">
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
   
   <div className="flex justify-start gap-4">
            <fieldset className="fieldset rounded py-4 m-3 mb-2">
              <legend className="fieldset-legend text-[14px] font-sans">
                Response
              </legend>

           <input type="text" placeholder="Write your decision..."   class="input border  px-15 ml-4 " />
            </fieldset>

          
  <button className="flex items-center  px-2 py-2 mt-16 ml-8  mb-6 bg-green-600  hover:bg-green-500 rounded-md text-white font-semibold transition duration-150"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5 m-0.5"
              >
                <path d="M3.4 20.4 22 12 3.4 3.6 3 10l12 2-12 2z" />
              </svg>
              Send
            </button>
          

            </div>




       <div class="modal-action ">
      <div className="flex gap-8">
      <div >
      <label for="my_modal_6" class="btn hover:bg-blue-500 bg-blue-600 text-white justify-end mx-auto">Done</label>
      </div>
      <div>
      <label for="my_modal_6" class="btn hover:bg-red-500 bg-red-600 text-white justify-end  mx-auto">Cancel</label>
      </div>
      
      </div>
      
    </div>
  </div>
</div>

  </div>


{/* Reject option */}
<div>


<label for="my_modal_7" class="btn hover:bg-red-500 bg-red-600 text-white font-semibold">Reject</label>

<input type="checkbox" id="my_modal_7" class="modal-toggle" />
<div class="modal " role="dialog">
  <div class="modal-box h-[60vh]">
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
   
   <div className="flex justify-start gap-4">
            <fieldset className="fieldset rounded py-4 m-3 mb-2">
              <legend className="fieldset-legend text-[14px] font-sans">
                Response
              </legend>

           <input type="text" required placeholder="Write your decision..." class="input border  px-15 ml-4" />
            </fieldset>
    


  <button className="flex items-center  px-2 py-2 mt-16 ml-8  mb-6 bg-green-600  hover:bg-green-500 rounded-md text-white font-semibold transition duration-150"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5 m-0.5"
              >
                <path d="M3.4 20.4 22 12 3.4 3.6 3 10l12 2-12 2z" />
              </svg>
              Send
            </button>
            

            </div>

       <div class="modal-action ">
      <div className="flex gap-8">
      <div >
      <label for="my_modal_7" class="btn hover:bg-blue-500 bg-blue-600 text-white justify-end  mx-auto">Done</label>
      </div>
      <div>
      <label for="my_modal_7" class="btn hover:bg-red-500 bg-red-600 text-white justify-end mx-auto">Cancel</label>
      </div>
      
      </div>
      
    </div>
  </div>
</div>

  </div>

<div>


<label for="my_modal_9" class="btn hover:bg-cyan-500 bg-cyan-600 text-white font-semibold">Forward</label>

<input type="checkbox" id="my_modal_9" class="modal-toggle" />
<div class="modal " role="dialog">
  <div class="modal-box h-[60vh]">
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


    <div class="modal-action ">
      <div className="flex gap-8">
      <div >
      <label for="my_modal_9" class="btn hover:bg-blue-500 bg-blue-600 text-white justify-end my-8 mx-auto">Done</label>
      </div>
      <div>
      <label for="my_modal_9" class="btn hover:bg-red-500 bg-red-600 text-white justify-end my-8 mx-auto">Cancel</label>
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
</div>


</div>
{/* Message section reponse */}
  <div className="m-2">
 
<div class="card  bg-base-100 w-[47vw] shadow-sm  p-2  h-[77vh] overflow-scroll">
  <div class="card-body">
    <h1 className="text-center font-semibold mb-2 font-sans text-2xl">Solved Messages</h1>
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

