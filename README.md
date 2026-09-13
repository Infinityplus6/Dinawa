# Dinawa

Indigenous languages have been dying for over 500 years. Taking advantage of the AI revolution and all the other cool stuff, Dinawa aims to try and solve that by raising awareness and educating the masses about the particular language in the Mississauga region, Ojibwe.

Built by chat gippity, the big CC, and 4 young locked-in SWEs.

This web app was built for the SaugaHacks Hackathon (12 hrs).

## Purpose

Dinawa is designed to make learning about Indigenous languages more accessible and interactive.

The idea is simple. When you encounter Ojibwe in the real world, whether it is on a sign, poster, building, or somewhere else, you can take a photo of it and let Dinawa do the work of figuring out what it means.

Rather than just giving you a translation, Dinawa also provides context about the word or phrase so that you can understand what you are actually looking at and why it matters.

The goal is to encourage people to notice and engage with Indigenous languages around them, while using modern AI tools to make that process easier.

btw Diwana means kind in Ojibwe, named this because the theme was about goodness and improving the community

## How it works

Dinawa has four main features:

### 1. Upload

* The point of the app is to take a photo of instances where you encounter Ojibwe and upload it.

### 2. Translation

* Using the Tesseract.js library, we extract the Ojibwe text from the uploaded image (~95% accuracy).
* We then translate it to English using an Ojibwe dictionary TSV combined with a heuristic powered by Gemini to get the most accurate translation.

### 3. Contextualization

* Gemini then also adds ~1 paragraph of context to your analysis, giving you some info about the meaning and cultural significance of the word/phrase.

### 4. Saving & Flashcards

* Your request gets saved and turned into an information card, which you can access in the *Learning* tab. It contains all the info associated with that request, including the image upload, translation, and context.
* This allows you to easily reference and remember your encounters.
* We have not implemented a DB/Local Storage yet. It just lives in the current session. Feature coming out sometime in the near future.


## Tech Stack

* React + Vite for the web app
* Tesseract.js for OCR and extracting text from images
* Ojibwe Dictionary TSV for the underlying language data
* Google Gemini for translation cleanup, interpretation, and contextualization
* JavaScript for the application logic

## Using it

Clone the repo:

`https://github.com/Infinityplus6/Dinawa.git`

In the terminal, run:

```bash
cd Dinawa
npm run dev
```

The site should then be live on `localhost` for your usage.

---

Uhh favicon SVG go brr
*(Did not change b4 demo, F11 goes hard)*
