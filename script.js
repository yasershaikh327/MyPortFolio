function changeMessage() {
    const messages = [
        "Hello World! 🌍",
        "Welcome to Vercel! 🚀",
        "Deployment Success! ✨",
        "Amazing! You did it! 🎉",
        "JavaScript is awesome! 💻"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    document.getElementById('helloMessage').textContent = randomMessage;
}

// Add a console message for fun
console.log("Hello World - Deployed on Vercel!");