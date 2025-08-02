from django.urls import path
from .views import list_flashcards, delete_flashcard, create_flashcard

urlpatterns = [
    path("", list_flashcards, name="list_flashcards"),
    path("create", create_flashcard, name="create_flashcard"),
    path("delete/<int:id>/", delete_flashcard, name="delete_flashcard"),
]
