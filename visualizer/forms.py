from django import forms

class SerializedForm(forms.Form):
    serialized = forms.CharField(label='Your name')
