document.addEventListener('DOMContentLoaded', () => {
    const charactersContainer = document.getElementById('characters-container');
    const sentence = "the quick brown fox jumps over the lazy dog";
    let sentenceIndex = 0;
    let selectedCharacter = null;
    let visemePositions = JSON.parse(localStorage.getItem('visemePositions')) || {};

    // Hardcoded character and viseme file paths. In a real application,
    // this list would likely be fetched from a server. For this static app,
    // we list the files found in the provided folders.
    const characterFiles = [
        'Characters/1.png',
        'Characters/2.png',
        'Characters/3.png',
        'Characters/4.png',
        'Characters/5.png',
        'Characters/6.jpg',
        'Characters/7.jpg'
    ];

    const visemeMap = {
        'a': 'Visemes/a-e-i.png', 'e': 'Visemes/a-e-i.png', 'i': 'Visemes/a-e-i.png',
        'b': 'Visemes/b-m-p-neutral.png', 'm': 'Visemes/b-m-p-neutral.png', 'p': 'Visemes/b-m-p-neutral.png', ' ': 'Visemes/b-m-p-neutral.png',
        'c': 'Visemes/c-d-g-k-n-s-t-x-y-z.png', 'd': 'Visemes/c-d-g-k-n-s-t-x-y-z.png', 'g': 'Visemes/c-d-g-k-n-s-t-x-y-z.png', 'k': 'Visemes/c-d-g-k-n-s-t-x-y-z.png', 'n': 'Visemes/c-d-g-k-n-s-t-x-y-z.png', 's': 'Visemes/c-d-g-k-n-s-t-x-y-z.png', 't': 'Visemes/c-d-g-k-n-s-t-x-y-z.png', 'x': 'Visemes/c-d-g-k-n-s-t-x-y-z.png', 'y': 'Visemes/c-d-g-k-n-s-t-x-y-z.png', 'z': 'Visemes/c-d-g-k-n-s-t-x-y-z.png',
        'ch': 'Visemes/ch-sh-j.png', 'sh': 'Visemes/ch-sh-j.png', 'j': 'Visemes/ch-sh-j.png',
        'ee': 'Visemes/ee.png',
        'f': 'Visemes/f-v.png', 'v': 'Visemes/f-v.png',
        'l': 'Visemes/l.png',
        'o': 'Visemes/o.png',
        'q': 'Visemes/q-w.png', 'w': 'Visemes/q-w.png',
        'r': 'Visemes/r.png',
        'th': 'Visemes/th.png',
        'u': 'Visemes/u.png'
    };

    characterFiles.forEach((characterFile, index) => {
        const characterId = index;
        const characterDiv = document.createElement('div');
        characterDiv.classList.add('character');
        characterDiv.dataset.characterId = characterId;

        const characterImg = document.createElement('img');
        characterImg.src = characterFile;
        characterImg.alt = `Character ${index + 1}`;

        const visemeImg = document.createElement('img');
        visemeImg.classList.add('viseme');
        visemeImg.src = 'Visemes/b-m-p-neutral.png'; // Default to neutral
        visemeImg.alt = 'Viseme';

        const position = visemePositions[characterId] || { top: '50%', left: '50%' };
        visemeImg.style.top = position.top;
        visemeImg.style.left = position.left;

        characterDiv.appendChild(characterImg);
        characterDiv.appendChild(visemeImg);
        charactersContainer.appendChild(characterDiv);
    });

    charactersContainer.addEventListener('click', (event) => {
        const clickedCharacter = event.target.closest('.character');
        if (clickedCharacter) {
            if (selectedCharacter) {
                selectedCharacter.classList.remove('selected');
            }
            selectedCharacter = clickedCharacter;
            selectedCharacter.classList.add('selected');
        }
    });

    document.addEventListener('keydown', (event) => {
        if (!selectedCharacter) return;

        const viseme = selectedCharacter.querySelector('.viseme');
        let top = parseFloat(viseme.style.top);
        let left = parseFloat(viseme.style.left);

        switch (event.key) {
            case 'ArrowUp':
                top -= 1;
                break;
            case 'ArrowDown':
                top += 1;
                break;
            case 'ArrowLeft':
                left -= 1;
                break;
            case 'ArrowRight':
                left += 1;
                break;
        }

        viseme.style.top = `${top}%`;
        viseme.style.left = `${left}%`;

        const characterId = selectedCharacter.dataset.characterId;
        visemePositions[characterId] = { top: viseme.style.top, left: viseme.style.left };
        localStorage.setItem('visemePositions', JSON.stringify(visemePositions));
    });

    function getVisemeForChar(char, nextChar) {
        // Check for digraphs first
        if (visemeMap[char + nextChar]) {
            return { viseme: visemeMap[char + nextChar], consumed: 2 };
        }
        if (visemeMap[char]) {
            return { viseme: visemeMap[char], consumed: 1 };
        }
        return { viseme: 'Visemes/b-m-p-neutral.png', consumed: 1 }; // Default to neutral if not found
    }

    function animateVisemes() {
        if (sentenceIndex >= sentence.length) {
            sentenceIndex = 0; // Loop back to the beginning
        }

        const char = sentence[sentenceIndex];
        const nextChar = sentence[sentenceIndex + 1];

        const { viseme, consumed } = getVisemeForChar(char, nextChar);

        const visemeImages = document.querySelectorAll('.viseme');
        visemeImages.forEach(visemeImg => {
            visemeImg.src = viseme;
        });

        sentenceIndex += consumed;
    }

    setInterval(animateVisemes, 150); // Adjust timing as needed
});
