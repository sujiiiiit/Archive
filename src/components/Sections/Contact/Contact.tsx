import React, { useState } from "react";

interface ContactProps {
  // Define the props for your component here
}

const Contact: React.FC<ContactProps> = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle final form submission
    console.log({ email, message });
  };

  return (
    <section className="my-20 xs:mt-16 flex flex-col gap-4">
      <h2 className="font-bold text-5xl m-auto">
        Have an <span className="underlineText text-textPrimary">idea?</span>
      </h2>
      <div className="text-xl m-auto">Let's make it happen!</div>

      <form className="flex flex-col gap-4 m-auto w-full max-w-md py-12">
        {step === 1 && (
          <div className="flex items-center border-b border-black dark:border-white transition-opacity duration-300 ease-in">
            <input
              type="email"
              placeholder="Your Email"
              className="bg-transparent border-0 focus:outline-none py-2 flex-grow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleEmailSubmit}
              className="ml-2 p-2 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                id="Left-Arrow--Streamline-Guidance---Free"
                height="24"
                width="24"
                className="stroke-black dark:stroke-white transition-transform duration-900 ease-in-out group-hover:translate-x-0.5"
              >
                <path
                  stroke="inherit"
                  d="M15.7632 5.4144C15.7632 6.1125 16.4528 7.1549 17.1509 8.0298C18.0484 9.1588 19.1209 10.1438 20.3505 10.8955C21.2725 11.459 22.3902 12 23.2896 12M23.2896 12C22.3902 12 21.2716 12.541 20.3505 13.1045C19.1209 13.8571 18.0484 14.8422 17.1509 15.9692C16.4528 16.8451 15.7632 17.8894 15.7632 18.5856M23.2896 12H0.7104"
                  strokeWidth="1"
                ></path>
              </svg>
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="transition-opacity duration-300 ease-in flex flex-col">
            <input
              type="text"
              placeholder="Your Message"
              className="bg-transparent border-b border-black dark:border-white focus:outline-none py-2 w-full"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-between mt-4">
              <button onClick={handleBack} className="py-2 px-4 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  id="Left-Arrow--Streamline-Guidance---Free"
                  height="24"
                  width="24"
                  className="rotate-180 stroke-black dark:stroke-white transition-transform duration-900 ease-in-out group-hover:translate-x-0.5"
                >
                  <path
                    stroke="inherit"
                    d="M15.7632 5.4144C15.7632 6.1125 16.4528 7.1549 17.1509 8.0298C18.0484 9.1588 19.1209 10.1438 20.3505 10.8955C21.2725 11.459 22.3902 12 23.2896 12M23.2896 12C22.3902 12 21.2716 12.541 20.3505 13.1045C19.1209 13.8571 18.0484 14.8422 17.1509 15.9692C16.4528 16.8451 15.7632 17.8894 15.7632 18.5856M23.2896 12H0.7104"
                    strokeWidth="1"
                  ></path>
                </svg>
              </button>
              <button
                onClick={handleFinalSubmit}
                className="py-2 px-4 bg-gray-200 dark:bg-zinc-800 rounded-full dark:text-white"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </form>
    </section>
  );
};

export default Contact;
