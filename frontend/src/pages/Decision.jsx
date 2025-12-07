import React, { useState } from "react";

export default function Decision() {
  // Correctly define state inside the component body
  const [expanded, setExpanded] = useState(false);

  return (



 <div className="bg-green-200 h-[100vh]">
                                                                  
 
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


{/* Message section */}
  <div className="m-auto ">

<div class="card lg:card-side bg-base-100 shadow-sm  h-[75vh] w-[95vw]">
  <div class="card-body">
    
  {/* Message */}

  <div class="card bg-base-100 w-[50w] shadow-sm">
  <div class="card-body">
    <h2 class="card-title">Broken Classroom Projector</h2>
    <p className=" text-gray-700 font-sans m-2 line-clamp-2 ">The projector in Room 305 is not functioning properly. It flickers and sometimes shuts down during lectures, making it difficult for students to follow the class. Requesting maintenance as soon as possible.</p>
    <div class="card-actions justify-end">
  {/* Response */}


  <div>


<label for="my_modal_6" class="btn hover:bg-green-500 bg-green-600 text-white font-semibold">Approve</label>

<input type="checkbox" id="my_modal_6" class="modal-toggle" />
<div class="modal " role="dialog">
  <div class="modal-box h-[60vh]">
   <h2 class="card-title">Broken Classroom Projector</h2>
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

           <input type="text" placeholder="Write your decision..." class="input border  px-15 ml-4" />
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




    <div class="modal-action">
      <label for="my_modal_6" class="btn hover:bg-blue-500 bg-blue-600 text-white justify-end mx-auto">Forward to Chairman</label>
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
   <h2 class="card-title">Broken Classroom Projector</h2>
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

           <input type="text" placeholder="Write your decision..." class="input border  px-15 ml-4" />
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

    <div class="modal-action">
      <label for="my_modal_7" class="btn hover:bg-blue-500 bg-blue-600 text-white justify-center mx-auto">Done </label>
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
   
   
  );



  
};

