import "./index.css";
import { motion } from "framer-motion";
import BasicDetails from "./form/basic";
import {
  happyTeam,
  konectinLogo,
  notifyError,
  successIcon,
} from "../../../assets";
import { slideIn, textVariantUp } from "../../../utils/motion";
import SectionWrapper from "../../../components/animation/sectionWrapper";
import { useSessionStorage } from "../../../middleware/storage";
import UploadResume from "./form/upload";
import Education from "./form/education";
import InternType from "./form/intern-type";
import { useState } from "react";
import { useAuth } from "../../../middleware/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function InternApplication() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useSessionStorage("internData", {
    basicDetails: {
      fullName: "",
      email: "",
      country_code: "",
      phone_number: "",
      country: "",
      gender: "",
      ageRange: "",
    },
    upload: "",
    education: {
      name: "",
      options: {
        option1: "",
        option2: "",
        option3: "",
      },
    },
    internType: {
      type: "",
      field: "",
    },
  });

  const handleChange = (section, subsection, values) => {
    setForm({
      ...form,
      [section]: {
        ...form[section],
        [subsection]: values,
      },
    });
  };

  const handleUpload = (value) => {
    const errorRef = document.getElementById("uploadError");
    const container = document.getElementById("upload");

    if (value === "") {
      container.style.borderColor = "#F11010";
      errorRef.style.display = "block";
      errorRef.innerHTML = "Upload a resume or build one";
    } else {
      container.style.borderColor = "initial";
      errorRef.style.display = "none";
    }

    setForm({
      ...form,
      upload: value,
    });
  };

  const checkVerification = () => {
    let valid = true;

    let formStore = Object.keys(form);

    formStore.forEach((state) => {
      let stateStore = Object.keys(form[state]);
      let errorMessage =
        state === "internType"
          ? "Select an option"
          : "Input field not filled yet";

      if (state === "education") {
        if (form.education.name !== "") {
          Object.keys(form.education.options).forEach((holder) => {
            const data = form.education.options[holder];
            const errorRef = document.getElementById(`${holder}Error`);
            const container = document.getElementById(holder);

            if (data === "") {
              container.style.borderColor = "#F11010";
              errorRef.style.display = "block";
              errorRef.innerHTML = errorMessage;
              valid = false;
            } else {
              container.style.borderColor = "initial";
              errorRef.style.display = "none";
            }
          });
        } else {
          const duplicate = form;
          delete duplicate.education;
          setForm(duplicate);
        }
        return;
      }

      if (state === "upload") {
        const errorRef = document.getElementById("uploadError");
        const container = document.getElementById("upload");

        if (form.upload === "") {
          container.style.borderColor = "#F11010";
          errorRef.style.display = "block";
          errorRef.innerHTML = "Upload a resume or build one";
          valid = false;
        } else {
          container.style.borderColor = "initial";
          errorRef.style.display = "none";
        }
        return;
      }

      stateStore.forEach((holder) => {
        const data = form[state][holder];
        const errorRef = document.getElementById(`${holder}Error`);
        const container = document.getElementById(holder);

        switch (holder) {
          case "email":
            const isValid = data.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
              ? true
              : false;
            if (data === "") {
              container.style.borderColor = "#F11010";
              errorRef.style.display = "block";
              errorRef.innerHTML = errorMessage;
              valid = false;
            } else if (isValid === false) {
              container.style.borderColor = "#F11010";
              errorRef.style.display = "block";
              errorRef.innerHTML = "Email address is not valid";
              valid = false;
            } else {
              container.style.borderColor = "initial";
              errorRef.style.display = "none";
            }
            break;
          default:
            if (data === "") {
              container.style.borderColor = "#F11010";
              errorRef.style.display = "block";
              errorRef.innerHTML = errorMessage;
              valid = false;
            } else {
              container.style.borderColor = "initial";
              errorRef.style.display = "none";
            }
            break;
        }
      });
    });

    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = checkVerification();

    if (isValid) {
      setLoading(true);
      const url = import.meta.env.VITE_CLIENT_SERVER_URL;
      // submit form data to backend
      if (user._id) {
        axios
          .post(`${url}/subscribeIntern?userId=${user._id}`, form)
          .then((res) => {
            setLoading(false);
            setMessage("success");

            setTimeout(() => {
              setMessage("");
            }, 3000);
          })
          .catch((err) => {
            console.warn(err);
            setLoading(false);
            setMessage("error");

            setTimeout(() => {
              setMessage("");
            }, 3000);
          });
      } else {
        navigate("/login");
      }
    }
  };

  return (
    <section className="min-h-[70vh] overflow-hidden">
      {loading && (
        <div className="fixed no-scrollbar w-full h-screen top-0 left-0 z-[100] flex">
          <div className="bg-neutral-100 opacity-70 absolute w-full h-full"></div>
          <div className="animate-pulse m-auto bg-white p-4 rounded-full">
            <img src={konectinLogo} alt="" />
          </div>
        </div>
      )}
      {message !== "" && (
        <div className="fixed no-scrollbar w-full h-screen top-0 left-0 z-[100] flex">
          <div
            onClick={() => setMessage("")}
            className="bg-neutral-100 opacity-70 absolute w-full h-full"
          ></div>
          <div className="w-2/4 min-w-[280px] max-w-[500px] m-auto relative z-10 bg-neutral-100 rounded-lg h-[80vh] max-h-[450px] flex items-center justify-center flex-col gap-6 p-8 text-white">
            <div>
              <img
                className="max-w-[200px]"
                src={message === "success" ? successIcon : notifyError}
                alt="success/error"
              />
            </div>
            <div>
              <p>
                {message === "success"
                  ? "Thank you for applying for Konectin's Internship Program. Your application has been received. If you're shortlisted, we'll contact you via the email address you provided."
                  : "Encountered an error while trying to send your information to our servers. Our engineers should be working on it right away!"}
              </p>
              <p className="mt-4">
                {message === "success"
                  ? "Remember to check your email regularly. 😉"
                  : "Please try again later, we have our engineer working on it"}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="w-11/12 mx-auto max-w-screen-2xl min-h-[70vh] flex flex-col md:gap-4 lg:gap-8 md:flex-row items-start py-32">
        <div className="flex flex-col gap-6 w-full pt-12 md:w-10/12 lg:w-8/12">
          <motion.h1
            variants={textVariantUp()}
            className="text-4xl font-semibold !leading-tight mt-2"
          >
            <span className="text-secondary-500">Konectin</span> Internship
            Application
          </motion.h1>
          <motion.p variants={textVariantUp(0.4)}>
            Welcome to Konectin's Internship Application form. We're excited
            about your interest in joining our program. Please fill out the form
            below to help us understand your background and qualifications
            better.
          </motion.p>
          <motion.form
            onSubmit={handleSubmit}
            className="overflow-y-auto overflow-x-hidden md:max-h-[420px] text-sm pr-6 space-y-4 intern-form flex flex-col"
            variants={textVariantUp(0.6)}
          >
            <div>
              <h2 className="text-lg font-semibold text-primary-600">
                Basic Details*
              </h2>
              <p className="text-primary-400">
                Input your personal information
              </p>

              <div className="flex flex-col gap-2 mt-3">
                <BasicDetails
                  data={form?.basicDetails}
                  updateForm={handleChange}
                />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-primary-600">
                Build or Upload your Resume*
              </h2>
              <p className="text-primary-400">
                Use our AI-powered Resume Builder to create a professional
                resume.
              </p>

              <div className="flex flex-col gap-2 mt-3">
                <UploadResume updateForm={handleUpload} />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-primary-600">
                Educational Background
              </h2>
              <p className="text-primary-400">
                Tell us about your educational background.
              </p>

              <div className="flex flex-col gap-2 mt-3">
                <Education data={form?.education} updateForm={handleChange} />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-primary-600">
                Internship Type*
              </h2>
              <p className="text-primary-400">Select an option.</p>

              <div className="flex flex-col gap-2 mt-3">
                <InternType data={form?.internType} updateForm={handleChange} />
              </div>
            </div>

            <button
              type="submit"
              className="text-white bg-primary-500 py-2 px-8 rounded self-center"
            >
              Submit
            </button>
          </motion.form>
        </div>

        <motion.picture
          variants={slideIn("rtl", "spring", 0.1, 1)}
          className="hidden md:block pt-12 sm:[--left-right:150%] [--left-right:-150%] relative w-7/12 min-h-[70vh]"
        >
          <img
            className="absolute right-0 top-0"
            src={happyTeam}
            alt="Konectin Internship Lady"
          />
        </motion.picture>
      </div>
    </section>
  );
}

export default SectionWrapper(InternApplication, "intern_application");
