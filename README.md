# **Space Invaders Game**

Welcome to the **Space Invaders Game**! This retro-inspired 2D game is built using **TypeScript** and the **HTML5 Canvas API**, with a focus on modularity and a **pub/sub architecture**. Test your skills by shooting down all the enemies before they reach the bottom of the screen. Good luck!

---


## **Demo**
Play the live demo here: [Space Invaders Game](https://space-invaders-dusky-two.vercel.app/)


---

## **Table of Contents**

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Getting Started](#getting-started)
4. [Gameplay Instructions](#gameplay-instructions)
5. [Contributing](#contributing)
6. [To-Do](#to-do)
7. [Credits](#credits)
8. [License](#license)

---

## **Features**

- **Smooth Gameplay**:
  - Move the player using arrow keys.
  - Fire projectiles with the spacebar.
- **Retro Look**:
  - Designed with a retro theme using the "Press Start 2P" font.
- **Score Tracking**:
  - Earn points by hitting enemies with projectiles.
- **Win & Game Over Conditions**:
  - Win by destroying all enemies.
  - Lose if any enemy reaches the bottom of the screen.
- **Pub/Sub Architecture**:
  - Decoupled design for handling events like score updates and collisions.

---

## **Technologies Used**

- **TypeScript**: For strong typing and modular architecture.
- **HTML5 Canvas API**: For rendering graphics.
- **Pub/Sub Pattern**: For modular and event-driven communication.

---

## **Getting Started**

### **1. Clone the Repository**

```bash
git clone https://github.com/yourusername/space-invaders-game.git
cd space-invaders-game
```

### **2. Install Dependencies**

This project requires a local development server. You can use **Vite**, **http-server**, or any similar tool.

If using Vite:

```bash
npm install
```

### **3. Run the Development Server**

Start the server to view the game in your browser.

If using Vite:

```bash
npm run dev
```

---

## **Gameplay Instructions**

1. **Controls**:
   - Move left: **Arrow Left**
   - Move right: **Arrow Right**
   - Shoot: **Spacebar**
2. **Objective**:
   - Destroy all the enemies before they reach the bottom of the screen.

## **Contributing**

We welcome contributions! Follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

---

## **To-Do**

- Add player lives for increased challenge.
- Introduce power-ups and special abilities.
- Optimize for mobile devices.

---

## **Credits**

- "Press Start 2P" Font by [Google Fonts](https://fonts.google.com/specimen/Press+Start+2P).
- Game logic and design inspired by the classic **Space Invaders**.

---

## **License**

This project is licensed under the [MIT License](LICENSE).

---

Feel free to fork, play, and contribute to this project! 🚀
