from django import forms
from .models import FlashCard


class FlashCardForm(forms.ModelForm):
    class Meta:
        model = FlashCard
        fields = ["question", "answer"]
        labels = {
            "question": "Question:",
            "answer": "Answer:",
        }
        widgets = {
            "question": forms.Textarea(
                attrs={
                    "class": "input",
                    "id": "question",
                    "rows": 2,
                    "placeholder": "Type the question here...",
                }
            ),
            "answer": forms.Textarea(
                attrs={
                    "class": "input",
                    "id": "answer",
                    "rows": 4,
                    "placeholder": "Type the answer here...",
                }
            ),
        }
        error_messages = {
            "question": {
                "required": "Input fields cannot be empty!",
            },
            "answer": {
                "required": "Input fields cannot be empty!",
            },
        }

    def clean_question(self):
        q = self.cleaned_data.get("question", "").strip()
        if len(q) < 5:
            raise forms.ValidationError("A pergunta deve ter no mínimo 5 caracteres.")
        return q

    def clean_answer(self):
        a = self.cleaned_data.get("answer", "").strip()
        if len(a) < 5:
            raise forms.ValidationError("A resposta deve ter no mínimo 5 caracteres.")
        return a
