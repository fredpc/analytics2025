from django.db import models


class FlashCard(models.Model):
    question = models.TextField(
        verbose_name="Pergunta",
        help_text="Digite aqui o texto da pergunta.",
    )
    answer = models.TextField(
        verbose_name="Resposta",
        help_text="Digite aqui o texto da resposta.",
    )
