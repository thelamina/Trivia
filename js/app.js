const api = new Trivia();
// GET NUMBER
// let inputNumber = +document.querySelector("#inputNumber").value;
// let category = +document.querySelector("#category").value;

// sessionStorage.setItem("Questions", inputNumber);
// sessionStorage.setItem("category", category);

const questionNum = +sessionStorage.getItem("Questions");
const categoryNum = +sessionStorage.getItem("category");
const difficulty = sessionStorage.getItem("difficulty");
const allotedtime = sessionStorage.getItem("allotedtime");

// GET CATEGORY
api
  .get("https://opentdb.com/api_category.php")
  .then((data) => {
    let output;
    data.trivia_categories.forEach((element) => {
      output += `<option value="${element.id}">${element.name}</option>`;
    });
    document.querySelector("#category").innerHTML = output;
  })
  .catch((err) => console.log(err));

// GET QUESTIONS
let right = 0;
let wrong = 0;
let total = questionNum;
let next = 1;

api
  .get(
    `https://opentdb.com/api.php?amount=${questionNum}&category=${categoryNum}&difficulty=${difficulty}&type=multiple`
  )
  .then((data) => {
    let output = "";
    let opt = [];
    data.results.forEach((element) => {
      let options = "";
      opt = [];
      element.incorrect_answers.forEach((elem) => {
        opt.push(elem);
      });
      opt.push(element.correct_answer);

      //shuffle array
      opt.sort(function (a, b) {
        return 0.5 - Math.random();
      });
      opt.forEach((prop) => {
        options += `<li>${prop}</li>`;
      });

      //structure of question
      output += `<div class="question" id="${next}">
                  <h2 class="title">
                    ${element.question}
                  </h2>
                  <ul class="options">
                    ${options}
                  </ul>
                  <a href="#${++next}" class="btn">Next</a>
                </div>`;

      //Pick answer
      document.body.addEventListener("click", (e) => {
        if (e.target.parentElement.className === "options") {
          document.querySelectorAll("li").forEach((li) => {
            li.classList.remove("selected");
          });
          e.target.className = "selected";

          if (e.target.textContent === element.correct_answer) {
            right++;
          } else {
            wrong++;
          }
        }
      });
    });

    document.querySelector("#quiz").innerHTML = output;

    // SUBMIT ACTION
    const submit = document.getElementById(`${total}`).querySelector("a");
    submit.innerText = "submit";
    submit.classList.add("submit");

    submit.addEventListener("click", () => {
      document.querySelector(".timer").remove();
      document.querySelector("#quiz").remove();
      document.querySelector(
        "#result"
      ).innerHTML = `<h1> ${right}/${total}</h2>`;
    });

    // TIMER
    function startTimer(duration) {
      let timer = duration;
      let minutes;
      let seconds;
      let na = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.querySelector(".timer").innerHTML = minutes + ":" + seconds;

        if (--timer < 0) {
          document.querySelector(".timer").innerHTML = "Time up";
          clearInterval(na);
        }
      }, 1000);
    }

    let time = 60 * allotedtime;
    startTimer(time);

    setTimeout(() => {
      document.querySelector("#quiz").remove();
      document.querySelector(
        "#result"
      ).innerHTML = `<h1> ${right}/${total}</h2>`;
    }, time * 1000);

    // RELOAD RESET
    if (performance.navigation.type === 1) {
      window.location.replace("/index.html");
    }
    // GET SELECTED

    // GET ANSWER
  })
  .catch((err) => console.log(err));

// GET SELECTED

document.querySelector("form").addEventListener("submit", (e) => {
  let inputNumber = +document.querySelector("#inputNumber").value;
  let category = +document.querySelector("#category").value;
  let difficulty = document.querySelector("#difficulty").value;
  let allotedtime = Math.floor(
    (document.querySelector("#inputNumber").value * 30000) / 1000 / 60
  );
  sessionStorage.setItem("Questions", inputNumber);
  sessionStorage.setItem("category", category);
  sessionStorage.setItem("difficulty", difficulty);
  sessionStorage.setItem("allotedtime", allotedtime);
  window.location.href = "/quiz.html";

  e.preventDefault();
});

// NAVIGATION
const burger = document.querySelector(".burger");
const navItems = document.querySelector(".nav-items");
const line1 = document.querySelector(".line:nth-child(1)");
const line2 = document.querySelector(".line:nth-child(2)");
const line3 = document.querySelector(".line:nth-child(3)");

burger.addEventListener("click", (e) => {
  navItems.classList.toggle("nav-active");
  line1.classList.toggle("hide");
  line2.classList.toggle("min");
  line3.classList.toggle("hide");
  e.preventDefault();
});

document.querySelector("#inputNumber").addEventListener("blur", () => {
  document.querySelector(".time-alloted").textContent = `You have ${Math.floor(
    (document.querySelector("#inputNumber").value * 30000) / 1000 / 60
  )} minute(s) to take this quiz`;
});
