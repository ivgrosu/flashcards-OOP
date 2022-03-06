class Card {
  id = (Date.now() + "").slice(-10);
  constructor(quest, ans) {
    this.quest = quest;
    this.ans = ans;
  }
}

//////////////////

class App {
  constructor() {
    this._displayStoredCards();
    //elements select
    this.btnAddQuestion = document.querySelector(".btn-add-question");
    this.formContainer = document.querySelector(".form-container");
    this.btnClose = document.querySelector(".btn-close");
    this.question = document.querySelector(".question");
    this.answer = document.querySelector(".answer");
    this.btnSave = document.querySelector(".btn-save-question");
    this.cardsContainer = document.querySelector(".cards-container");
    this.error = document.querySelector(".error");
    //events listeners
    this.btnAddQuestion.addEventListener("click", this._addQuestion.bind(this));

    this.btnClose.addEventListener(
      "click",
      this._closeQuestionContainer.bind(this)
    );

    this.btnSave.addEventListener("click", this._displayQuestion.bind(this));

    this.cardsContainer.addEventListener(
      "click",
      this._manageCardContainer.bind(this)
    );
  }

  _addQuestion() {
    this.formContainer.classList.add("show-form-container");
  }

  _closeQuestionContainer() {
    this.formContainer.classList.remove("show-form-container");
  }

  _displayQuestion(e) {
    e.preventDefault();
    if (this.question.value === "" || this.answer.value === "") {
      this.error.classList.add("show-error");
      setTimeout(() => {
        this.error.classList.remove("show-error");
      }, 2000);
    }
    const flashcard = new Card(this.question.value, this.answer.value);
    this._createCard(flashcard);
    this._setLocalStorage(flashcard);
    this.question.value = "";
    this.answer.value = "";
    this._closeQuestionContainer();
  }

  _createCard(card) {
    let html = `
      <div class="card" data-id= '${card.id}'>
        <p class="quest">${card.quest}</p>
        <div class="answer-section">
          <button class="show-hide-answer">Show/Hide Answer</button>
          <p class="ans">${card.ans}</p>
        </div>
        <div class="btns">
          <button class="btn btn-edit">edit</button>
          <button class="btn btn-delete">delete</button>
        </div>
      </div>
    `;
    document
      .querySelector(".flashcards-container")
      .insertAdjacentHTML("beforeend", html);
  }

  _manageCardContainer(e) {
    e.preventDefault();
    if (e.target.classList.contains("show-hide-answer"))
      this._showHideAnswer(e);
    if (e.target.classList.contains("btn-edit")) {
      this._editCard(e);
      this._removeItemLocalStorage(
        e.target.parentElement.parentElement.dataset.id
      );
    }
    if (e.target.classList.contains("btn-delete")) {
      this._deleteCard(e);
      this._removeItemLocalStorage(
        e.target.parentElement.parentElement.dataset.id
      );
    }
  }

  _showHideAnswer(e) {
    e.target.nextElementSibling.classList.toggle("show-answer");
  }

  _editCard(e) {
    const cardQuestion = e.target.closest(".card").querySelector(".quest");
    const card = e.target.closest(".card");
    this.question.value = cardQuestion.textContent;
    card.remove();
    this._addQuestion();
  }

  _deleteCard(e) {
    const card = e.target.closest(".card");
    card.remove();
  }

  _setLocalStorage(card) {
    const cards = this._getLocalStorage();
    cards.push(card);
    localStorage.setItem("cards", JSON.stringify(cards));
  }

  _getLocalStorage() {
    let cards;
    if (localStorage.getItem("cards") === null) {
      cards = [];
    } else {
      cards = JSON.parse(localStorage.getItem("cards"));
    }
    return cards;
  }

  _removeItemLocalStorage(id) {
    const cards = JSON.parse(localStorage.getItem("cards"));

    cards.forEach((card, i) => {
      if (card.id === id) {
        cards.splice(i, 1);
      }
    });

    localStorage.setItem("cards", JSON.stringify(cards));
  }

  _displayStoredCards() {
    const cards = this._getLocalStorage();
    cards.forEach((card) => this._createCard(card));
  }
}

const app = new App();
