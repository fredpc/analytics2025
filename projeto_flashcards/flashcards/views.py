from django.shortcuts import render, redirect
from .models import FlashCard
from .forms import FlashCardForm


def list_flashcards(request):
    context = {}
    flashcards = FlashCard.objects.all()
    context["flashcards"] = flashcards
    form = FlashCardForm()
    context["form"] = form
    return render(
        request,
        "index.html",
        context,
    )


def create_flashcard(request):
    if request.method == "POST":
        form = FlashCardForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("list_flashcards")
        else:
            flashcards = FlashCard.objects.all()
            context = {
                "flashcards": flashcards,
                "form": form,
                "error": "Formulário inválido",
            }
            return render(request, "index.html", context)
    else:
        return redirect("list_flashcards")
    return render(request, "index.html", {"form": form})


def delete_flashcard(request, id):
    if request.method == "POST":
        try:
            flashcard = FlashCard.objects.get(id=id)
            flashcard.delete()
        except FlashCard.DoesNotExist:
            pass

    return redirect("list_flashcards")
