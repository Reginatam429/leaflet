# 🌿 Leaflet

Leaflet is a Django-powered plant care tracker that helps you grow your personal indoor jungle. Whether you're managing a windowsill herb garden or a living room full of greenery, Leaflet makes it easy to track your plants, learn about their care needs, and keep a wishlist of species you want to bring home.


[![Python](https://img.shields.io/badge/Python-3.11-green)](https://www.python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![Django](https://img.shields.io/badge/Django-5.0-green)](https://www.djangoproject.com/)
[![Perenual API](https://img.shields.io/badge/API-Perenual-forestgreen)](https://perenual.com/docs/api)

---

## ✨ Features

- 🌱 **My Plants** – Add and track your real-life plants. Store species info, care needs, and images.
- 🌼 **Wishlist** – Save plants you’d like to add to your collection.
- 🔍 **Plant Search** – Use the Perenual API to find plant info by name.
- 📷 **Image Uploads** – Add a personal photo or use the default image from the API.
- 🧠 **Care Information** – View watering needs, sunlight exposure, temperature range, and native region.
- 🔒 **User Accounts** – Sign up/log in to manage your private plant collection and wishlist.

---

## 🛠 Tech Stack

**Frontend**  

- HTML/CSS with Django Templates  
- Vanilla JavaScript

**Backend**  

- Python 3.11  
- Django 5.0  
- PostgreSQL  
- Django ORM

**APIs and Libraries**  

- [Perenual API](https://perenual.com/docs/api)  
- Cloudinary or Amazon S3 (optional for image uploads)  
- Bootstrap (optional styling framework)


---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/leaflet.git
cd leaflet
```

### 2. Install dependencies

```bash
pipenv install
pipenv shell
```

### 3. Create a `.env` file

```env
SECRET_KEY=your_secret_key
DEBUG=True
DATABASE_URL=your_postgresql_url
PERENUAL_API_KEY=your_api_key
```

### 4. Migrate and seed database

```bash
python manage.py migrate
```

### 5. Run the server

```bash
python manage.py runserver
```

---

## 🧪 Roadmap

- ✅ CRUD for plant collection  
- ✅ Wishlist functionality  
- ✅ Perenual API integration  
- ⏳ Image-based plant identification (planned)  
- ⏳ Care reminders and calendar view  
- ⏳ Mobile responsiveness improvements

---

## 🙌 Acknowledgements

- [Perenual API](https://perenual.com/docs/api) for plant data  
- [Django](https://www.djangoproject.com/) for the web framework  
- [Heroku](https://www.heroku.com/) for deployment
