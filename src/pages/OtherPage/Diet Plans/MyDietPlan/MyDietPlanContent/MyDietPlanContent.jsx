import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useState } from "react";
import MyDietPlanPDF from "./MyDietPlanPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import useGetCompanyData from "../../../../../Hook/GetCompanyData/useGetCompanyData";

function MyDietPlanContent({ diet, isShowModal = false, setIsShowModal = ()=> {} }) {
  const [loader, setLoader] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const profileData = useGetCompanyData();

  const downloadPDF = () => {
    const capture = document.querySelector("#diet-plan-content");
    setLoader(true);

    // Use html2canvas to capture the content of the div
    html2canvas(capture, {
      useCORS: true, // Handles cross-origin images
      allowTaint: true, // Allows drawing tainted canvases
      backgroundColor: "#fff", // Ensures background isn't transparent
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png"); // Get image data from canvas
        const pdf = new jsPDF("p", "mm", "a4"); // Create a new jsPDF document
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Scale height proportionally

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight); // Add the image to the PDF
        setLoader(false); // Stop the loader
        pdf.save("diet-plan.pdf"); // Save the PDF with a specified filename
      })
      .catch((error) => {
        console.error("Error generating PDF", error); // Catch and log errors
        setLoader(false); // Ensure loader stops even if there's an error
      });
  };

  console.log(
    "diet",
    Object.keys(diet).map((key) => {
      console.log("key", key);
      if (key === "_id" || key === "__v") {
        return "";
      } else {
        return key;
      }
    }), diet
  );

  

  return (
    <>
      {/* The content to capture and generate into a PDF */}
      <div id="diet-plan-content" className={`bg-white ${isShowModal ? "w-[80%]" : "w-full"}`}>
        <div className="w-full mx-auto p-6  shadow-md rounded-lg my-10">
          <div className="w-full mx-auto  flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{diet?.dietName}</h2>

            <PDFDownloadLink
              document={<MyDietPlanPDF diet={diet} profileData={profileData} />}
              fileName="diet-plan.pdf"
              style={{
                backgroundColor: "#3b82f6",
                color: "#ffffff",
                padding: "10px 20px",
                borderRadius: "5px",
                textDecoration: "none",
              }}
            >
              {({ loading }) =>
                loading ? "Loading document..." : "Download PDF"
              }
            </PDFDownloadLink>
          </div>


          {
            pageNumber === 2 && (
              <>
              {diet?.health_metrics && (
          <div>
          <p className={`flex`} >
                  <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Food To Avoid:</span>{" "}
                  <span className={`border py-4 w-full pl-4`}>{diet?.health_metrics?.food_to_avoid}</span>
                </p>
                <p className={`flex`} >
                  <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Weekly:</span>{" "}
                  <span className={`border py-4 w-full pl-4`}>{diet?.health_metrics?.weekly}</span>
                </p>
                <p className={`flex`} >
                  <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Fruits:</span>{" "}
                  <span className={`border py-4 w-full pl-4`}>{diet?.health_metrics?.fruits}</span>
                </p>
                <p className={`flex`} >
                  <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Vegetables:</span>{" "}
                  <span className={`border py-4 w-full pl-4`}>{diet?.health_metrics?.vegetables}</span>
                </p>
                

                <p className={`flex`} >
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Points To Note :</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.health_metrics?.points_to_note}</span>
                          </p>
          </div>

              )}
              </>

            )
          }



          {
            pageNumber === 1 && (

          <div>

          
                    {/* Health Metrics Section */}
                    {diet?.health_metrics && (
                      <>
                        <div className="">
                        <h2 className="text-2xl font-semibold bg-gray-300 py-4  px-2 pl-6">Health Metrics</h2>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Weight:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.health_metrics?.weight + " lbs"}</span>
                          </p>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Height:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.health_metrics?.height + " inches"}</span>
                          </p>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Age:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.health_metrics?.age + " Years"}</span>
                          </p>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Ideal Weight:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.health_metrics?.ideal_weight + " lbs"}</span>
                          </p>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Extra Weight:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.health_metrics?.extra_weight + " lbs"}</span>
                          </p>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">BP:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.health_metrics?.bp + " mmHg"}</span>
                          </p>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Calorie:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.health_metrics?.calorie + " kcal"}</span>
                          </p>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Water:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.health_metrics?.water + " liters"}</span>
                          </p>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Sugar:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.health_metrics?.sugar + " grams"}</span>
                          </p>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Oil:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.health_metrics?.oil + " grams"}</span>
                          </p>

                          <p className={`flex`} >
                  <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Suggestion:</span>{" "}
                  <span className={`border py-4 w-full pl-4`}>{diet?.health_metrics?.suggestion}</span>
                </p>
                          
                          
                        </div>
                      </>
                    )}
          
                    {/* Breakfast Section */}
                    {diet.breakfast && (
                      <>
                        <h2 className="text-2xl font-semibold bg-gray-300 py-4  px-2 pl-6">Breakfast</h2>
                        <div className="">
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Roti:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.breakfast.roti}</span>
                          </p>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Egg:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.breakfast.egg}</span>
                          </p>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Vegetable:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.breakfast.vegetable}</span>
                          </p>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Fruit:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.breakfast.fruit}</span>
                          </p>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Extra:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.breakfast?.extra}</span>
                          </p>
                        </div>
                      </>
                    )}
          
                    {/* Lunch Section */}
                    {diet.lunch && (
                      <>
                        <h2 className="text-2xl font-semibold bg-gray-300 py-4  px-2 pl-6">Lunch</h2>
                        <div className="">
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4 ">Rice:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.lunch.lunch_rice}</span>
                          </p>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Fish/Meat:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.lunch.fish_meat}</span>
                          </p>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Pulse:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.lunch.pulse}</span>
                          </p>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Shack:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.lunch.shack}</span>
                          </p>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Vegetable:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.lunch.vegetable}</span>
                          </p>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Salad:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.lunch.salad}</span>
                          </p>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Extra:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.lunch?.extra}</span>
                          </p>
                        </div>
                      </>
                    )}
          
                    {/* Dinner Section */}
                    {diet.dinner && (
                      <>
                        <h2 className="text-2xl font-semibold bg-gray-300 py-4  px-2 pl-6">Dinner</h2>
                        <div className="">
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Roti:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.dinner.roti}</span>
                          </p>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Rice:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.dinner.rice}</span>
                          </p>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Fish/Meat:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.dinner.fish_meat}</span>
                          </p>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Pulse:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.dinner.pulse}</span>
                          </p>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Shack:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.dinner.shack}</span>
                          </p>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Vegetable:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.dinner.vegetable}</span>
                          </p>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Salad:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.dinner.salad}</span>
                          </p>
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Extra:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.dinner?.extra} </span>
                          </p>
                        </div>
                      </>
                    )}
          
                    {/* Before Sleep Section */}
                    {diet.sleep && (
                      <>
                        <h2 className="text-2xl font-semibold bg-gray-300 py-4  px-2 pl-6">Before Sleep</h2>
                        <div className="">
                          <p className={`flex`}>
                            <span className="font-semibold bg-gray-300 py-4 inline-block px-2 w-32 pl-4">Sleep:</span>{" "}
                            <span className={`border py-4 w-full pl-4`}>{diet?.sleep.sleep}</span>
                          </p>
                        </div>
                      </>
                    )}
                    </div>
            )
          }


<div className="mt-8 flex justify-between items-center w-full col-span-3">
  <button className="py-2 px-6 bg-black text-white disabled:bg-gray-400" disabled={pageNumber === 1} onClick={()=> setPageNumber(1)} >Previous</button>
  <button className="py-2 px-6 bg-black text-white disabled:bg-gray-400" disabled={pageNumber === 2} onClick={()=> setPageNumber(2)}  >Next</button>
</div>


  </div>
    </div>
    </>
  );
}

export default MyDietPlanContent;
