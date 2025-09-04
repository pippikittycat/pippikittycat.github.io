// -- BACKGROUND PARTICLE EFFECT -- //

if (window.innerWidth > 768) {
    const container = document.querySelector(".container");

    let boundX = window.innerWidth;
    let boundY = window.innerHeight;

    //Mouse, Current, Move
    /**
     * @type {[MouseX, CurrentX, MoveX]}
     */
    const commandX = [0, 0, 0];
    /**
     * @type {[MouseY, CurrentY, MoveY]}
     */
    const commandY = [0, 0, 0];

    const easeAmount = 0.1;
    const moveOuterDivisor = 8;
    const moveInnersubtrahend = 0.5;
    const mouseWindowDivisor = 2;

    commandX[0] = boundX / mouseWindowDivisor;
    commandY[0] = boundY / mouseWindowDivisor;

    function animate() {
        //X
        commandX[1] += (commandX[0] - commandX[1]) * easeAmount;
        commandX[2] =
            (commandX[1] / boundX - moveInnersubtrahend) * moveOuterDivisor;

        //Y
        commandY[1] += (commandY[0] - commandY[1]) * easeAmount;
        commandY[2] =
            (commandY[1] / boundY - moveInnersubtrahend) * moveOuterDivisor;

        console.log(commandX, commandY)

        container.style.transform = `translate(${commandX[2]}px, ${commandY[2]}px)`;

        requestAnimationFrame(animate);
    }

    //Events
    window.addEventListener("resize", () => {
        boundX = window.innerWidth;
        boundY = window.innerHeight;
    });

    window.addEventListener("mousemove", (e) => {
        commandX[0] = e.clientX;
        commandY[0] = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
        commandX[0] = boundX / mouseWindowDivisor;
        commandY[0] = boundY / mouseWindowDivisor;
    });

    animate();
}

const container = document.querySelector('.floating-particles-background-effect');

// Increase particle density
const width = window.innerWidth;
let particleCount;

if (width > 1200) {
    particleCount = 250; // desktop
} else if (width > 768) {
    particleCount = 180; // tablet
} else {
    particleCount = 100;  // mobile
}

for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    // Random size (layered depth)
    const sizeCategory = Math.random();
    let size, opacity, twinkleMax, drift;
    if (sizeCategory < 0.3) { // small
        size = Math.random() * 3 + 1;   // 1px - 4px
        opacity = 0.7 + Math.random() * 0.2; // 0.7 - 0.9
        twinkleMax = 0.9 + Math.random() * 0.1; // 0.9 - 1
        drift = Math.random() * 30 - 15;
    } else if (sizeCategory < 0.7) { // medium
        size = Math.random() * 4 + 2;   // 2px - 6px
        opacity = 0.75 + Math.random() * 0.2; // 0.75 - 0.95
        twinkleMax = 0.95 + Math.random() * 0.05; // 0.95 - 1
        drift = Math.random() * 40 - 20;
    } else { // large
        size = Math.random() * 6 + 4;   // 4px - 10px
        opacity = 0.8 + Math.random() * 0.2; // 0.8 - 1
        twinkleMax = 0.95 + Math.random() * 0.05; // 0.95 - 1
        drift = Math.random() * 50 - 25;
    }

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}vw`;

    // Random start slightly above viewport
    particle.style.top = `${Math.random() * -15}vh`;

    // Random animation durations
    const fallDuration = Math.random() * 60 + 40; // 40s - 100s
    const twinkleDuration = Math.random() * 6 + 4; // 4s - 10s
    particle.style.animationDuration = `${fallDuration}s, ${twinkleDuration}s`;

    // Random animation delays
    particle.style.animationDelay = `${Math.random() * 60}s, ${Math.random() * 6}s`;

    // CSS variables for drift and twinkle
    particle.style.setProperty('--drift', `${drift}px`);
    particle.style.setProperty('--opacity', opacity);
    particle.style.setProperty('--twinkle-max', twinkleMax);

    container.appendChild(particle);
}

// -- HOVER PIC TO MP4 -- //
document.querySelectorAll('.gridcard-container > .gridcard').forEach(card => {
    const video = card.querySelector('.hover-video');
    if (video) {
        card.addEventListener('mouseenter', () => video.play());
        card.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    }
});

// -- PRELOAD VIDEO FOR GRID CARDS --
document.querySelectorAll('.hover-video').forEach(video => {
  video.addEventListener('loadeddata', () => {
    video.currentTime = 0; // show first frame
    video.pause();         // don’t autoplay until hover
  });

  video.parentElement.addEventListener('mouseenter', () => {
    video.play();
  });

  video.parentElement.addEventListener('mouseleave', () => {
    video.pause();
    video.currentTime = 0; // reset back to first frame
  });
});
