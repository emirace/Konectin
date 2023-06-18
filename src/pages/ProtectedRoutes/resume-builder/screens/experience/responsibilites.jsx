import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import Suggestions from "./suggestions";

const Responsibilities = ({ data, handleStep, workId }) => {
  const [responsibility, setResponsibility] = useState(
    data.jobExperience[workId - 1].jobTitle
  );
  const [editorValue, setEditorValue] = useState("");
  const [dirty, setDirty] = useState("");
  const editorRef = useRef(null);

  const handleAddSuggestion = (value) => {
    const content = editorRef.current.getContent();
    setEditorValue(`${content} <ul><li>${value}</li></ul>`);
    setDirty(false);
    editorRef.current.setDirty(false);

  };

  const handleSubmit = (e) => {
    e.preventDefault();

    handleStep(2);
  };

  return (
    <>
      <main className="min-h-[90vh] -mt-8 flex flex-col justify-center items-start mx-auto md:mx-16">
        <h2 className="-mt-6 md:max-w-[30ch] text-xl md:text-3xl leading-tight font-semibold md:leading-snug">
          Your work responsibilities
        </h2>
        <p className="text-[#66666a] text-sm tracking-[-0.01rem] mt-3 max-w-2xl">
          Try to include 3-6 work experience bullet points. Little is less and
          more is too much.
        </p>
        <form className="w-full" onSubmit={handleSubmit}>
          <section className="w-full h-[400px] flex justify-between mt-6">
            <div className="w-full md:w-1/2">
              <p className="font-bold text-[#66666a] text-sm mb-3">
                Product Designer | Konectin
              </p>
              <div className="h-full">
                <Editor
                  apiKey="muetp0kpit1cdofn0tsv7aym5shbxqnxzglv3000ilo9pc0m"
                  onInit={(_, editor) => (editorRef.current = editor)}
                  init={{
                    menubar: false,
                    resize: false,
                    branding: false,
                    plugins: "lists wordcount",
                    elementpath: false,
                    toolbar: "bold italic underline undo redo bullist",
                    content_style:
                      "body { font-family: Merriweather, Arial, sans-serif; font-size: 12px }",
                  }}
                  initialValue={editorValue}
                  onDirty={() => setDirty(true)}
                />

                {dirty && <p>You have unsaved content!</p>}
              </div>
            </div>
            <div className="w-1/2 hidden md:block">
              <p className=" font-semibold text-[#66666a] text-xs mb-3 mt-1 ml-6 ">
                Let’s help your refine your job responsibilities with our top AI
                powered tool
              </p>
              <div className="h-full ml-6 border border-[#b2b3b48a] rounded-lg">
                <Suggestions
                  jobTitle={responsibility}
                  handleChange={(value) => setResponsibility(value)}
                  handleAddSuggestion={handleAddSuggestion}
                />
              </div>
            </div>
          </section>

          <div className="max-w-xl flex flex-col max-md:justify-center mt-16 gap-5 md:flex-row">
                <button
                  onClick={() => handleStep(0)}
                  className="w-full md:w-fit max-w-xs border border-[#b2b3b48a] rounded-lg text-sm py-3 px-[4.5rem]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-full md:w-fit max-w-xs border border-[#b2b3b48a] rounded-lg text-sm text-[#f5f5f5] py-3 px-[4.5rem] bg-[#332A66]"
                >
                  Continue
                </button>
            </div>


        </form>
      </main>
    </>
  );
};

export default Responsibilities;
