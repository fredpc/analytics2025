## Tutorial de Django

- Disciplina de Business e Analytics.
- UFTM - 1s 2025

<img src="thumb.png" width="400px">

## Requisitos

- Instalado Vs Code
- Instalado Python
- Templates: https://codingartistweb.com/2022/08/flashcard-app-with-javascript/
- Link do repositório: https://github.com/leandrocl2005/flashcards
- Pegar *readme.md* no repositório indicado na aula

### Commit e264859

## Configuração inicial

- Crie uma pasta chamada *flashcards* (será a pasta raiz do projeto)
- Abra esta pasta com o Vs Code
- Crie um ambiente virtual: `python -m venv env`
- Ative o ambiente virtual: `. env/Scripts/activate`
- Instale as seguintes extensões do Vs Code:
    - Python
    - Pylance
    - autopep8
    - Better Jinja
    - Black Formatter
    - Flake8
    - Live Server
    - Python Environments
- Conecte seu VS code ao seu ambiente virtual
- Adicione a raíz do projeto as configurações *.vscode* (ver repositório)
- Adicione a raíz do projeto o arquivo .gitignore (ver repositório)
- Instale o django: `pip install django`
- Crie o projeto Django: `django-admin startproject config .`
- Crie o app flash cards: `python manage.py startapp flashcards`
- Adicione *'flashcards'* em *config/settings.py* em `INSTALLED_APPS`
- Crie o modelo FlashCard em *flashcards/models.py* (ver repositório)
- Crie as migrações: `python manage.py makemigrations`
- Execute as migrações: `python manage.py migrate`
- Crie o superuser: `python manage.py createsuperuser`
- Registre o modelo FlashCard no admin do django (ver repositório *flashcards/admin.py*)
- Rode seu projeto no servidor local: `python manage.py runserver`
- Acesse `http://localhost:8000/admin` no seu navegador de internet
- Faça login com o superuser
- Crie 4 flash cards.

# Renderizando templates

- Pare o servidor apertando CTRL+C no terminal
- Na raiz do projeto crie uma pasta chamada *templates*
- Coloque o arquivo *index.html* nesta pasta
- Em *config/settings.py* em `TEMPLATES` adicone `"DIRS": [BASE_DIR / "templates"],`
- Crie um arquivo *flashcards/urls.py*
- Em *config/urls.py* inclua o arquivo acima (ver repositório)
- Em *flashcards/urls.py* aponte para a view de listagem de cards (ver repositório)
- Em *flashcards/views.py* crie uma view para renderizar o template *index.html* (ver repositório)
- Rode o servidor: `python manage.py runserver`
- Acesse `http://localhost:8000`

### Commit ae6b8c9

# Arquivos estáticos

- Pare o servidor apertando CTRL+C no terminal
- Crie uma pasta *static* na raiz do projeto
- Adicione *style.css* e *script.js* a pasta *static*
- Em *config/settings.py*, abaixo de STATIC_URL adicione `STATICFILES_DIRS = (os.path.join(BASE_DIR, "static"),)`
- Depois mais abaixo, `STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")`
- em *config/urls.py*, adicione o caminho para os arquivos estáticos
- Em *templates/index.html*:
    - No topo adicione `{% load static %}`
    - Troque `href="style.css"` por `href="{% static 'style.css' %}"`
    - Troque `src="script.js"` por `src="{% static 'script.js' %}"`
- Rode o servidor: `python manage.py runserver`
- Acesse `http://localhost:8000`

# Momento importante

- Se criar um card, ele aparecerá, mas ao apertar F5 ele some. 
- Queremos persistir essas informações no banco de dados.
- Com o Django buscaremos esses objetos e enviaremos para o template via contexto na view.

# Adaptações no template para listar os cards

- Apague a função view_list no *script.js*
- Altere o conteúdo da div de classe "card-list-container" como abaixo:
```html
<div class="card-list-container">
    <div class="card">
        <p class="question-div">Pergunta de teste</p>
        <a href="#" class="show-hide-btn">Show/Hide</a>
        <p class="answer-div hide">Resposta de teste</p>
        <div class="btn-con">
            <button class="edit"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="delete"><i class="fa-solid fa-trash-can"></i></button>
        </div>
    </div>
    <div class="card">
        <p class="question-div">Pergunta de teste</p>
        <a href="#" class="show-hide-btn">Show/Hide</a>
        <p class="answer-div hide">Resposta de teste</p>
        <div class="btn-con">
            <button class="edit"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="delete"><i class="fa-solid fa-trash-can"></i></button>
        </div>
    </div>
</div>
```
- Em script.js, abaixo de `const closeBtn = document.getElementById("close-btn");`
```js
const showHideBtn = document.querySelectorAll(".show-hide-btn");
showHideBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const answerDiv = e.target.nextElementSibling;
    answerDiv.classList.toggle("hide");
  });
});
```
- Rode o servidor: `python manage.py runserver`
- Acesse `http://localhost:8000`

# View Context

- Na view adicione ao context os cards criados pelo superuser (ver repositório *flashcads/views.py*).
- No index.html:
```html
<div class="card-list-container">
    {% for card in flashcards %}
    <div class="card">
        <p class="question-div">{{card.question}}</p>
        <a href="#" class="show-hide-btn">Show/Hide</a>
        <p class="answer-div hide">{{card.answer}}</p>
        <div class="btn-con">
            <button class="edit"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="delete"><i class="fa-solid fa-trash-can"></i></button>
        </div>
    </div>
    {% endfor %}
</div>
```
- Rode o servidor: `python manage.py runserver`
- Acesse `http://localhost:8000`

### Commit 27fe0fc

# Deletar cards

- No *index.html* troque `<button class="edit"><i class="fa-solid fa-pen-to-square"></i></button>` por
```html
<form method="POST" action="#">
    {% csrf_token %}
    <input type="hidden" name="id" value="{{ card.id }}">
    <button class="edit"><i class="fa-solid fa-pen-to-square"></i></button>
</form>
```
- No *index.html* troque `<button class="delete"><i class="fa-solid fa-trash-can"></i></button>` por
```html
<form method="POST" action="#">
    {% csrf_token %}
    <input type="hidden" name="id" value="{{ card.id }}">
    <button class="delete"><i class="fa-solid fa-trash-can"></i></button>
</form>
```
- No css `btn-con`
- Em *flashcards/urls.py* adicione o path `/delete` (ver repositório)
- Em *flashcards/views.py* adicione a função para deletar o card (ver repositório)
- No form para deletar, altere action para `action="{% url 'delete_flashcard' id=card.id %}"`

### Criar flashcards
- Crie o FlashCardForm em *flashcards/forms.py* (ver repositório)
- No *index.html* troque toda div "question-container" por
```html
<div class="question-container {% if not form.errors %}hide{% endif %}" id="add-question-card">
    <h2>Add Flashcard</h2>
    <form method="POST" action="{% url 'create_flashcard' %}">
    {% csrf_token %}

    <div class="wrapper">
        <!-- Error message -->
        <div class="error-con">
        <span id="error">{{ form.non_field_errors }}</span>
        <span id="error">{{ form.question.errors }}</span>
        <span id="error"> {{ form.answer.errors }}</span>
        </div>
        <!-- Close Button -->
        <i class="fa-solid fa-xmark" id="close-btn"></i>
    </div>

    <label for="question">Question:</label>
    {{form.question}}

    <label for="answer">Answer:</label>
    {{form.answer}}
    
    <button id="save-btn" type="submit">Save</button>
    </form>
</div>
```
- Faça a seguinte alteração na div container:
```html
<div class="container {% if form.errors %}hide{% endif %}">
```
- No css em `#save-btn` adicione  `width: 100%;`
- Em *flashcards/urls.py* adicione o path `/create` (ver repositório)
- Em *flashcards/views.py* adicione a função para criar o card (ver repositório)
- Rode o servidor: `python manage.py runserver`
- Testes:
    - Teste se é possível criar um novo card
    - Verifique no admin se foi criado
    - Teste se é possível remover um card
    - Verifique no admin se foi deletado
    - Teste se é possível criar perguntas e respostas com menos de 5 caracteres
