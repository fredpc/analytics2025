// Elementos DOM
const cardContainer = document.getElementById('card-container');
const addFlashcardBtn = document.getElementById('add-flashcard');
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('close-modal');
const flashcardForm = document.getElementById('flashcard-form');
const modalTitle = document.getElementById('modal-title');
const questionInput = document.getElementById('question');
const answerInput = document.getElementById('answer');
const questionError = document.getElementById('question-error');
const answerError = document.getElementById('answer-error');

// Variáveis de estado
let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
let isEditing = false;
let currentEditId = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  renderFlashcards();
});

// Event Listeners
addFlashcardBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
flashcardForm.addEventListener('submit', handleSubmit);

// Funções
function openModal() {
  resetForm();
  modalTitle.textContent = 'Adicionar Flashcard';
  isEditing = false;
  modal.classList.add('active');
}

function closeModal() {
  modal.classList.remove('active');
}

function resetForm() {
  flashcardForm.reset();
  hideErrors();
}

function hideErrors() {
  questionError.style.display = 'none';
  answerError.style.display = 'none';
}

function showError(element, message) {
  element.textContent = message;
  element.style.display = 'block';
}

function handleSubmit(e) {
  e.preventDefault();
  
  const question = questionInput.value.trim();
  const answer = answerInput.value.trim();
  
  // Validação
  let isValid = true;
  
  if (!question) {
    showError(questionError, 'Por favor, digite uma pergunta');
    isValid = false;
  }
  
  if (!answer) {
    showError(answerError, 'Por favor, digite uma resposta');
    isValid = false;
  }
  
  if (!isValid) return;
  
  if (isEditing) {
    updateFlashcard(currentEditId, question, answer);
  } else {
    addFlashcard(question, answer);
  }
  
  closeModal();
}

function addFlashcard(question, answer) {
  const newFlashcard = {
    id: Date.now().toString(),
    question,
    answer
  };
  
  flashcards.push(newFlashcard);
  saveToLocalStorage();
  renderFlashcards();
}

function updateFlashcard(id, question, answer) {
  const index = flashcards.findIndex(card => card.id === id);
  
  if (index !== -1) {
    flashcards[index].question = question;
    flashcards[index].answer = answer;
    saveToLocalStorage();
    renderFlashcards();
  }
}

function deleteFlashcard(id) {
  flashcards = flashcards.filter(card => card.id !== id);
  saveToLocalStorage();
  renderFlashcards();
}

function editFlashcard(id) {
  const flashcard = flashcards.find(card => card.id === id);
  
  if (flashcard) {
    questionInput.value = flashcard.question;
    answerInput.value = flashcard.answer;
    modalTitle.textContent = 'Editar Flashcard';
    isEditing = true;
    currentEditId = id;
    modal.classList.add('active');
  }
}

function renderFlashcards() {
  if (flashcards.length === 0) {
    cardContainer.innerHTML = `
      <div class="empty-state">
        <p>Nenhum flashcard encontrado. Clique no botão "Novo Flashcard" para começar.</p>
      </div>
    `;
    return;
  }
  
  cardContainer.innerHTML = '';
  
  flashcards.forEach(flashcard => {
    const cardElement = document.createElement('div');
    cardElement.className = 'flashcard-container';
    
    cardElement.innerHTML = `
      <div class="flashcard">
        <div class="flashcard-face flashcard-front">
          <div class="question-div">${flashcard.question}</div>
        </div>
        <div class="flashcard-face flashcard-back">
          <div class="question-div">${flashcard.question}</div>
          <div class="answer-div">${flashcard.answer}</div>
          <div class="card-actions">
            <button class="action-btn edit-btn" data-id="${flashcard.id}">
              <i class="fas fa-pen-to-square"></i>
            </button>
            <button class="action-btn delete-btn" data-id="${flashcard.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    
    cardContainer.appendChild(cardElement);
  });
  
  // Adiciona event listeners para os botões de ação
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      editFlashcard(btn.dataset.id);
    });
  });
  
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('Tem certeza que deseja excluir este flashcard?')) {
        deleteFlashcard(btn.dataset.id);
      }
    });
  });
}

function saveToLocalStorage() {
  localStorage.setItem('flashcards', JSON.stringify(flashcards));
}