from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser
from django.contrib.auth import authenticate


class SignUpForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = CustomUser
        fields = [
            'username',
            'email',
            'password1',
            'password2',
            'phone',
            'country_code',
            'national_card',
            'verification_video',
            'newsletter',
        ]

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        user.username = self.cleaned_data['username']
        user.phone = self.cleaned_data.get('phone')
        user.country_code = self.cleaned_data.get('country_code')
        user.newsletter = self.cleaned_data.get('newsletter', False)
        if commit:
            user.save()
        return user


class EmailLoginForm(forms.Form):
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)

    def clean(self):
        email = self.cleaned_data.get('email')
        password = self.cleaned_data.get('password')

        user = authenticate(username=email, password=password)
        if not user:
            raise forms.ValidationError("ایمیل یا رمز اشتباه است")

        self.user = user
        return self.cleaned_data
