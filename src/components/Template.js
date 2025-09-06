import { FcGoogle } from "react-icons/fc"
import { useSelector } from "react-redux"

import LoginForm from "../pages/LoginForm"
import SignupForm from "../pages/SignUpForm"

function Template({ title, description1, description2, formType }) {
  const { loading } = useSelector((state) => state.auth)

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)]  justify-items-center border p-4 ">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="mx-auto flex w-screen max-w-maxContent flex-col-reverse justify-center items-center gap-y-5 py-12 md:flex-row md:gap-y-0 md:gap-x-12 ">
          <div className=" flex flex-col box mx-auto w-11/12 max-w-[450px] md:mx-0 border-2 border-solid border-zinc-400 rounded-md shadow-black shadow-lg ">
            <div className="m-5">
              <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-white">
              {title}
            </h1>
            <p className="mt-4 text-[1.125rem] leading-[1.625rem]">
              <span className="text-emerald-500">{description1}</span>{" "}
              <span className="font-edu-sa font-bold italic text-blue-500">
                {description2}
              </span>
            </p>
            {formType === "signup" ? <SignupForm /> : <LoginForm />}
              </div>
          </div>

        </div>
      )}
    </div>
  )
}

export default Template
