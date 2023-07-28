document.addEventListener("DOMContentLoaded", () => {
  // Define a variable that holds the base URL
  const baseURL = "https://raw.githubusercontent.com/reavids101/risk-engineering-aon/main/";

  // Define an array of file names
  const fileNames = [
    "Wellington Letter September 7, 2020.json",
    "Steam Explosions.json",
    "US CSB 2020 Hurricane Season_Guidance for Chemical Plants During Extreme Weather Events.json",
    "AIM Learning Series 2.0.json",
    "alternative-heating.json",
    "Aon Hurricane Season Preparation and Response 2020.json",
    "NFPA 70B Checklist NATURAL DISASTER ELECTRICAL EQUIPMENT.json",
    "Management Of Change MOC.json",
    "icheme-lessons-learned-database.json",
    "IBHS-Small Hail-Big Problems-New Approach 20230419.json",
    "Hazards of High Oxygen Concentration_English.json",
    "Get Help.lnk.json",
    "Freezing-Weather-Last-Minute-Checklist_IBHS.json",
    "Freezing-Bursting-Pipes_IBHS.json",
    "FreezeTips.json",
    "Combustible Mists_English.json",
    "Automatic vs Manual control.json",
    "202201beaconenglish-PID.json",
    "2023-03-AIChE CCPS Beacon-TOXIC GASES-Take actions to protect_English.pdf.json",
    "2022-09-AIChE CCPS Beacon-Lightning Strikes_ChineseSimplified.pdf.json",
    "2022-09-AIChE CCPS Beacon-Lightning Strikes_English.pdf.json",
    "2022-08-AIChE CCPS Beacon-What's an Acceptable LEL Detector Reading_English.pdf.json",
    "2022-07-AIChE CCPS Beacon-Manage Temporary Changes-Including Clamps_English.pdf.json",
    "2022-06-AIChE CCPS Beacon-Some Mistakes Take Time to Become Incidents_English.pdf.json",
    "2022-05-AIChE CCPS Beacon-What Happens If_English.pdf.json",
    "2022-03-AIChE CCPS Beacon-Hot Work is more than Welding, Burning & Grinding_English.pdf.json",
    "2021-09-AIChE CCPS Beacon-Use the Correct Gas Meter_English.pdf.json",
    "2021-07-AIChE CCPS Beacon-Cyber Security and Chemical Operations_English.pdf.json",
    "2021-06-AIChE CCPS Beacon-Combustible Dust Hazards are Everywhere_English.pdf.json",
    "2021-04-AIChE CCPS Beacon-Nitrogen Fatalities are Vivid Reminder_English.pdf.json",
    "2021-01-AIChE CCPS Beacon-Material Identification_English.pdf.json",
    "2020-12-AIChE CCPS Beacon-Reactive Chemistry Incidents Can Happen Anywhere_English.pdf.json",
    "2020-11-AIChE CCPS Beacon-Not All Vibrations in Process Equipment are Good Vibrations_English.pdf.json",
    "2020-08-AIChE CCPS Beacon-Where to Check the LFL Before Hot Work_English.pdf.json",
    "2020-07-AIChE CCPS Beacon-Process Interruptions_A Threat to Process Safety_English.pdf.json",
    "2020-05-AIChE CCPS Beacon-Permitted Work - A Special Cause_Hot Work_English.pdf.json",
    "2020-04-AIChE CCPS Beacon-A Hidden Chain of Hazards_English.pdf.json",
    "2020-02-AIChE CCPS Beacon-A Small Word with a lot of Power-ASK_English.pdf.json",
    "2020-01-AIChE CCPS Beacon-Housekeeping is more than pretty-IT'S ABOUT SAFETY_Sugar Mill Explosion_English.pdf.json",
    "2019-11-AIChE CCPS Beacon-What Does That Button Do_English.pdf.json",
    "2019-10-AIChE CCPS Beacon-Sluggish control systemsa warning sign_English.pdf.json",
    "2019-07-AIChE CCPS Beacon-Small Leaks_English.pdf.json",
    "2019-06-AIChE CCPS Beacon-Corrosion Under Insulation_English.pdf.json",
    "2019-05-AIChE CCPS Beacon-Warning Signs_English.pdf.json",
    "2017-02-AIChE CCPS Beacon-Incompatible Materials in Storage Tanks_English.pdf.json",
    "2016-12-AIChE CCPS Beacon-Ignition Sources_English.pdf.json",
    "733   Cold Weather.pdf.json",
    "23.02 EPSC Learning Sheet - Chlorine Leakage.pdf.json",
  
    // add more file names as needed
  ];
  
    Promise.all(
      fileNames.map((fileName) =>
        fetch(`${baseURL}${fileName}`)
          .then((response) => response.json())
          .then((data) => {
            const articleElement = createArticleElement(data);
            if (articleElement instanceof Node) {
              return articleElement;
            } else {
              throw new Error("Invalid article element created.");
            }
          })
          .catch((error) => {
            console.error(`Error loading ${fileName}:`, error);
          })
      )
    )
    .then((articleElements) => {
      const fragment = document.createDocumentFragment();
      articleElements.forEach((articleElement) => {
        if (articleElement instanceof Node) {
          fragment.appendChild(articleElement);
        } else {
          console.error("Invalid article element:", articleElement);
        }
      });
      const articlePreview = document.getElementsByClassName("article-preview")[0];
      articlePreview.appendChild(fragment);
    });
  
    function createArticleElement(data) {
      const element = document.createElement("div");
      element.classList.add("article");
      element.setAttribute("data-search", `${data.title}\n${data.snippet}`);
      element.innerHTML = `
        <h2 class="article-title">${data.title}</h2>
        <p class="article-snippet">${data.snippet}</p>
        <button class="view-btn" data-href="${data.pdfUrl}">Read more</button>
      `;
    
      // Create a reference to the pop-up window
      let pdfWindow = null;
    
      // Add a click event listener to the "Read more" button
      const viewBtn = element.querySelector(".view-btn");
      viewBtn.addEventListener("click", () => {
        // If the pop-up window is already open, focus on it instead of creating a new one
        if (pdfWindow && !pdfWindow.closed) {
          pdfWindow.focus();
          return;
        }
    
        // Load the PDF file using PDF.js
        const pdfUrl = data.pdfUrl;
        const pdfjsLib = window["pdfjs-dist/build/pdf"];
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js";
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
    
        // Render the PDF file in the pop-up window
        loadingTask.promise.then((pdf) => {
          pdf.getPage(1).then((page) => {
            const canvas = document.createElement("canvas");
            const viewport = page.getViewport({ scale: 1.0 });
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const canvasContext = canvas.getContext("2d");
            const renderTask = page.render({ canvasContext, viewport });
            renderTask.promise.then(() => {
              pdfWindow = window.open("", "_blank", "width=800,height=600");
              pdfWindow.document.write("<html><head><title>PDF Viewer</title></head><body>");
              pdfWindow.document.write(`<embed width="100%" height="100%" name="plugin" src="${pdfUrl}" type="application/pdf">`);
              pdfWindow.document.write("</body></html>");
              pdfWindow.document.close(); // Important: Close the document to ensure proper rendering
            });
          });
        });
      });
    
      return element;
    }
  });