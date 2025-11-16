import { useEffect, useState } from "react";

export default function AboutFounderWords() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://bansaltimber.com/api/founder-info/get_founder_section.php")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) setData(result.data);
      })
      .catch((err) => console.error("Error fetching founder section:", err));
  }, []);

  if (!data) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-gray-500">
        Loading founder section...
      </div>
    );
  }

  return (
    <div className="bg-gray-200 p-6 md:p-12 rounded-lg md:rounded-xl">
      <div className="flex flex-col md:flex-row items-stretch">
        
        {/* Founder image */}
        <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-8 flex items-center">
          <img
            src={data.founder_image}
            alt="Founder"
            className="h-full object-cover rounded-lg md:rounded-xl"
          />
        </div>

        {/* Founder text */}
        <div className="p-6 bg-white md:w-[50%] md:py-20 rounded-lg md:rounded-xl flex flex-col justify-between">
          
          {/* Heading */}
          <h1 className="font-[SagaceMedium] text-2xl mb-6">
            {data.heading || "A word from the founder:"}
          </h1>

          {/* Body Text */}
          <p
            className="font-[NeueHaasRoman] text-md"
            dangerouslySetInnerHTML={{
              __html: (data.body_text || "")
                .replace(/\n/g, "<br/>")
            }}
          />

          {/* Founder Name */}
          <h2 className="font-[SagaceMedium] text-lg mt-6">
            {data.founder_name || ""}
          </h2>
        </div>
      </div>

      {/* Quote Section */}
      <div className="bg-[#6B1900] p-12 md:p-18 rounded-lg md:rounded-xl ">
        <h1 className="font-[TiroDev] text-2xl md:text-[32px] text-center text-white">
          {data.quote_text || ""}
        </h1>
      </div>
    </div>
  );
}

