console.log("Li yuval invoked!")

// maybe click is not the right time
document.addEventListener("click", detectJobs);


test_mode = document.currentScript && document.currentScript.getAttribute('test_mode'); //1

if (!test_mode) {
  var yuvDiv = document.createElement('div');
  yuvDiv.id = 'yuvDiv';
  yuvDiv.innerHTML = `

  <form id="yuvForm" class='add-form' >

  <div  class='form-controlx'>
      <h1>Create new Job</h1>
  </div>

  <div class='form-controlx'>
      <label>Company name
      </label>
      <input id="companyName" name="companyName" type='text' placeholder='Company name' />
  </div>
 
  <div class='form-controlx' >
      <label>Job Title</label>
      <input id='jobTitle' name="jobTitle" type='text' placeholder='Job Title' />
  </div>

  <div class='form-controlx'>
      <input id='submitBtn' type='submit' value='Submit' class='btn' />
  </div>
  </form>

  <button id="drawerButton" type="submit">
    <img id="drawerButton-img">
  </button>


  `
  document.getElementsByTagName('body')[0].appendChild(yuvDiv);

}


if (test_mode) {
  document.getElementById('drawerButton-img').src = 'chevron-arrows-svgrepo-com_p_left.svg';
} else {
  document.getElementById('drawerButton-img').src = chrome.runtime.getURL('icons/chevron-arrows-svgrepo-com_p_left.svg');
}

let opened = true;

const form = document.getElementById('yuvForm');

const drawerButton = document.getElementById('drawerButton');

function drawerClick(event) {
  console.log("drawer clicked")

  //form.classList.toggle("out");
  if (opened){
    if (test_mode) {
      document.getElementById('drawerButton-img').src = 'chevron-arrows-svgrepo-com_p_right.svg';
    } else {
      document.getElementById('drawerButton-img').src = chrome.runtime.getURL('icons/chevron-arrows-svgrepo-com_p_right.svg');
    }
    form.classList.toggle("out")

  } else {
    if (test_mode) {
      document.getElementById('drawerButton-img').src = 'chevron-arrows-svgrepo-com_p_left.svg';
    } else {
      document.getElementById('drawerButton-img').src = chrome.runtime.getURL('icons/chevron-arrows-svgrepo-com_p_left.svg');
    }    form.classList.toggle("out")
  }  
  opened = !opened
};
drawerButton.addEventListener("click", drawerClick);


form.addEventListener('submit', function (e) {
  // Prevent default behavior:
  e.preventDefault();

  // Create payload as new FormData object:
  const formData = new FormData(form);
  payload = Object.fromEntries(formData);

  chrome.runtime.sendMessage({ from: "Li-content-script", type: "ADD", ...payload });
})



let current_displayed_job = null;

function detectJobs() {

  //this might fire a lot,
  //maybe avoid sending to backend if found in some local cache
  // Array.from(document.getElementsByClassName("jobs-unified-top-card")[0].children).filter(v => v)[0]
  if (document.getElementsByClassName("jobs-unified-top-card").length > 0) {

    console.log("jobs-unified-top-card found!")

    jobTitle = document.getElementsByClassName('jobs-unified-top-card__job-title')[0].innerHTML.replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9]*$/g, '');
    companyName = document.getElementsByClassName('jobs-unified-top-card__company-name')[0].children[0].innerHTML.replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9]*$/g, '');

    let new_job = companyName + jobTitle;

    if (new_job != current_displayed_job) {

      console.log("job name ", jobTitle, "company ", companyName)

      // TODO slow as causes: contentscript - > background -> firestore 
      // better have local cache in mem/local storage, only set of "unique" jobTitle+companyName 
      chrome.runtime.sendMessage({ from: "Li-content-script", type: "QUERY", jobTitle: jobTitle, companyName: companyName }, function (response) {

        console.log("got response from bg script:", response);
        if (response.jobfound) {
          console.log("job name ", jobTitle, "company ", companyName, " - > found, ignore")
        } else {
          console.log("job name ", jobTitle, "company ", companyName, " - > NOT found, suggest add")

          document.getElementById("jobTitle").placeholder = jobTitle
          document.getElementById("companyName").placeholder = companyName

          document.getElementById("jobTitle").value = jobTitle
          document.getElementById("companyName").value = companyName
        }
      });
    }
    current_displayed_job = new_job;
  }
}
