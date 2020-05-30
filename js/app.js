const api = new Trivia();
// GET NUMBER
// let inputNumber = +document.querySelector("#inputNumber").value;
// let category = +document.querySelector("#category").value;

// sessionStorage.setItem("Questions", inputNumber);
// sessionStorage.setItem("category", category);

const questionNum = +sessionStorage.getItem("Questions");
const categoryNum = +sessionStorage.getItem("category");
const difficulty = sessionStorage.getItem("difficulty");

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
    let output = "You're up";
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
    setTimeout(() => {
      document.querySelector("#quiz").remove();
      document.querySelector(
        "#result"
      ).innerHTML = `<h1> ${right}/${total}</h2>`;
    }, 30000 * questionNum);

    // GET SELECTED

    // GET ANSWER
  })
  .catch((err) => console.log(err));

// GET SELECTED

document.querySelector("form").addEventListener("submit", (e) => {
  let inputNumber = +document.querySelector("#inputNumber").value;
  let category = +document.querySelector("#category").value;
  let difficulty = +document.querySelector("#difficulty").value;
  sessionStorage.setItem("Questions", inputNumber);
  sessionStorage.setItem("category", category);
  sessionStorage.setItem("difficulty", difficulty);
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
