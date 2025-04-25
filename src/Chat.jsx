import { useEffect, useRef, useState } from "react";
import styles from "./index.module.css"; // CSS Modules

const Chat = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [visible, setVisible] = useState(true);
  const chatBoxRef = useRef();

  const getTriviaOfTheDay = () => {
    const triviaList = [
      "Did you know? A day on Venus is longer than its year!",
      "Trivia: The Moon is slowly drifting away from Earth—about 3.8 cm per year.",
      "Fun fact: Neutron stars can spin 600 times per second!",
      "Space trivia: Jupiter has 95 confirmed moons!",
      "Mind-blower: A spoonful of a neutron star weighs about 6 billion tons.",
      "Did you know? Mars has the tallest volcano in the solar system—Olympus Mons.",
      "Cool fact: Saturn could float in water due to its low density.",
      "Wanna know? There's a planet made of diamonds—it's called 55 Cancri e!",
      "Space tidbit: The Milky Way galaxy is on a collision course with Andromeda.",
      "Fact: One day on Mercury lasts 59 Earth days.",
      "Curious? The International Space Station orbits Earth every 90 minutes.",
      "The Moon has 'moonquakes' just like Earth has earthquakes!",
      "Saturn’s rings are mostly made of ice and rock chunks.",
      "Astronauts grow up to 2 inches taller in space due to microgravity!",
      "A year on Neptune lasts 165 Earth years!",
      "The Sun makes up 99.86% of the mass in our solar system.",
      "There’s a giant storm on Jupiter called the Great Red Spot—it’s older than 300 years!",
      "The largest volcano in the solar system is Olympus Mons on Mars.",
      "Uranus orbits the Sun on its side—it basically rolls like a barrel.",
      "Light from the Sun takes about 8 minutes and 20 seconds to reach Earth.",
      "The Hubble Space Telescope has captured over 1.3 million observations!",
      "The farthest galaxy observed is over 13.4 billion light-years away.",
      "Pluto was reclassified as a dwarf planet in 2006.",
      "In 1977, we sent the Voyager Golden Record into space for aliens to discover.",
      "Jupiter’s moon Europa might have an ocean under its icy surface.",
      "Mars has seasons, polar ice caps, and dust storms!",
      "The Kuiper Belt is a region beyond Neptune full of icy bodies.",
      "Some planets rain diamonds—like Neptune and Uranus!",
      "Our galaxy is estimated to contain 100–400 billion stars.",
      "It would take over 70,000 years to reach the nearest star (Proxima Centauri) with current spacecraft."
    ];
    
    const dayIndex = new Date().getDate() % triviaList.length;
    return triviaList[dayIndex];
  };

  const handleAsk = () => {
    const q = question.toLowerCase();
    let response = "Sorry, I don't understand that yet.";

    if (q.includes("thanks") || q.includes("thank")) {
      response = "Always keen to help you! Even if we're lightyears away from a coffee break.";
    } else if (q.includes("moon")) {
      response = "The Moon is Earth's lonely neighbor... and now your temporary roommate!";
    } else if (q.includes("earth")) {
      response = "Earth... sweet blue home. I bet you're missing gravity and samosas.";
    } else if (q.includes("sun")) {
      response = "The Sun is hot, powerful, and definitely not a good tanning spot.";
    } else if (q.includes("spacesuit")) {
      response = "Your spacesuit is basically your life insurance right now. Also, it's not a fashion statement.";
    } else if (q.includes("gravity")) {
      response = "Moon gravity is like a trampoline with manners—fun, but still dangerous.";
    } else if (q.includes("mission") || q.includes("apollo")) {
      response = "Apollo 11 walked so you could moonwalk—literally.";
    } else if (q.includes("what")) {
      response = "You are alone on the Moon. You have to roam around here until support arrives. Don’t worry, I’m here for moral support (and sarcasm).";
    } else if (q.includes("oxygen")) {
      response = "No oxygen here—unless you enjoy suffocating. Breathe through your suit, buddy!";
    } else if (q.includes("food")) {
      response = "Freeze-dried food: because nothing says luxury like powdered spaghetti.";
    } else if (q.includes("water")) {
      response = "Water's precious—don’t spill it! Not even for a dramatic moon scene.";
    } else if (q.includes("temperature")) {
      response = "Hotter than a desert by day, colder than your ex's heart at night.";
    } else if (q.includes("support") || q.includes("rescue")) {
      response = "Help is on the way! Until then, talk to me—I’m cheaper than therapy.";
    } else if (q.includes("ai") || q.includes("you")) {
      response = "I’m your AI companion, your lunar BFF with zero legs but unlimited loyalty.";
    } else if (q.includes("lonely") || q.includes("alone")) {
      response = "You’re not alone I’m right here, being emotionally available and slightly sarcastic.";
    } else if (q.includes("joke")) {
      response = "Why did the astronaut break up with the alien? Because they needed space!";
    } else if (q.includes("trivia")) {
      response = getTriviaOfTheDay();
    } else {
      response = "I am your AI companion to assist you in this journey minus the snacks, unfortunately.";
    }

    setAnswer(response);
    speak(response);
    setQuestion("");
  };

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1.2;
    utter.lang = "en-US";
    synth.speak(utter);
  };

  useEffect(() => {
    chatBoxRef.current?.scrollTo({ top: chatBoxRef.current.scrollHeight, behavior: 'smooth' });
  }, [answer]);

  return (
    <>
      <button className={styles.toggleButton} onClick={() => setVisible(!visible)}>
        {visible ? "✖" : "💬"}
      </button>

      {visible && (
        <div className={styles["chat-container"]}>
          <div className={styles["chat-box"]} ref={chatBoxRef}>
            {answer && <div className={styles["bot-bubble"]}>{answer}</div>}
          </div>
          <div className={styles["input-container"]}>
            <input
              className={styles["input"]}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              placeholder="Ask me about space..."
            />
            <button className={styles["button"]} onClick={handleAsk}>
              🚀
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
