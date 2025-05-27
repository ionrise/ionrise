:root {
    --primary-color: #2A5C8F;   /* Firemní modrá */
    --secondary-color: #4CAF50; /* Firemní zelená */
}

body {
    font-family: 'Arial', sans-serif;
    padding-top: 80px; /* Offset pro fixed navbar */
}

#uvod {
    background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('../images/pozadi.jpg');
    background-size: cover;
    color: white;
}

.navbar {
    background-color: var(--primary-color) !important;
}

.btn-primary {
    background-color: var(--secondary-color);
    border: none;
}

/* Responzivní design pro mobily */
@media (max-width: 768px) {
    #uvod h1 {
        font-size: 2rem;
    }
}
.contact-list h5 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
}

.img-placeholder {
    background: #f0f0f0;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
}