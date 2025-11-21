export default function Student() {
  return (
    <>
      <style>
        {`
          .fieldset:focus-within .fieldset-legend {
            font-size: 1rem !important;
            transform: none !important;
          }
        `}
      </style>

      <div className="m-4">
        <div className="flex m-4">
          <div>
            <img
              className="h-20 w-20 rounded-full object-cover border-2 border-blue-200"
              src="../src/assets/cartoon-illustration-scholar-academic_272293-4645.jpeg"
            />
            <h1 className="my-2 font-semibold">Student Panel</h1>
          </div>

          <div className="m-auto">
            <h1 className="text-3xl font-bold">Navbar</h1>
          </div>
        </div>

        {/* content flex */}
        <div className="m-4 flex gap-6">
          {/* Previous message */}
          <div>
            <div className="card bg-base-100 w-96 h-100 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-3xl font-bold">
                  Previous Message
                </h2>

                <div className="card m-4 bg-base-100 shadow-sm">
                  <div className="card-body">
                    <h4 className="font-bold text-[15px] mb-3">
                      PC in Lab Not Working
                    </h4>
                    <p className="line-clamp-3">
                      The PC in the lab is not working, and I am unable to
                      complete my tasks. I have tried restarting it multiple
                      times, but it still does not turn on. This issue is
                      affecting my ability to complete assignments and practical
                      exercises. I kindly request that the lab PCs be checked
                      and repaired as soon as possible.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* right input section */}
          <div className="mx-auto">
            <fieldset className="fieldset rounded py-4 ">
              <legend className="fieldset-legend text-[14px] font-sans">
                Problem Title
              </legend>

              <input
                type="text"
                className="input w-full  px-3 py-6 border rounded text-left placeholder-gray-400"
                placeholder="Enter a short title for your problem"
              />
            </fieldset>

            <fieldset className="fieldset w-full mt-4">
              <legend className="fieldset-legend  text-[14px]">
                Description
              </legend>

              <textarea
                className="input w-full px-3 py-20 my-4 rounded text-left placeholder-gray-400 resize-none overflow-hidden"
                placeholder="Describe your problem in detail"
                rows="4"
              ></textarea>
            </fieldset>

            <button className="flex gap-1 bg-green-500 mx-20 px-2 py-1.5 hover:bg-green-400 rounded-full text-white font-semibold mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                class="w-5 h-5 m-0.5 "
              >
                <path d="M3.4 20.4 22 12 3.4 3.6 3 10l12 2-12 2z" />
              </svg>
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
