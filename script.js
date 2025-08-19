document.addEventListener('DOMContentLoaded', () => {
    const charactersContainer = document.getElementById('characters-container');
    const sentenceInput = document.getElementById('sentence-input');
    let sentence = sentenceInput.value;
    let sentenceIndex = 0;
    let selectedCharacter = null;
    // Store nudge offsets instead of absolute positions
    let visemeOffsets = JSON.parse(localStorage.getItem('visemeOffsets')) || {};
    // Store scaling factors for each character
    let visemeScales = JSON.parse(localStorage.getItem('visemeScales')) || {};

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

    sentenceInput.addEventListener('input', (event) => {
        sentence = event.target.value.toLowerCase();
        sentenceIndex = 0;
    });

    // Add save button functionality
    const saveButton = document.getElementById('save-button');
    saveButton.addEventListener('click', () => {
        // Save current settings to localStorage
        localStorage.setItem('visemeOffsets', JSON.stringify(visemeOffsets));
        localStorage.setItem('visemeScales', JSON.stringify(visemeScales));
        
        // Provide visual feedback
        const originalText = saveButton.textContent;
        saveButton.textContent = 'Saved!';
        saveButton.style.backgroundColor = '#28a745';
        
        setTimeout(() => {
            saveButton.textContent = originalText;
            saveButton.style.backgroundColor = '#007bff';
        }, 1000);
    });

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

        // Get saved offsets and scale or default values
        const offset = visemeOffsets[characterId] || { x: 0, y: 0 };
        const scale = visemeScales[characterId] || 1.0;
        visemeImg.style.transform = `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${scale})`;


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

        const characterId = selectedCharacter.dataset.characterId;
        const viseme = selectedCharacter.querySelector('.viseme');

        // Get current offsets and scale for the selected character
        const currentOffset = visemeOffsets[characterId] || { x: 0, y: 0 };
        const currentScale = visemeScales[characterId] || 1.0;
        let { x, y } = currentOffset;
        let scale = currentScale;

        switch (event.key) {
            case 'ArrowUp':
                y -= 1;
                break;
            case 'ArrowDown':
                y += 1;
                break;
            case 'ArrowLeft':
                x -= 1;
                break;
            case 'ArrowRight':
                x += 1;
                break;
            case 'q':
            case 'Q':
                scale = Math.min(scale + 0.1, 3.0); // Max scale of 3x
                break;
            case 'a':
            case 'A':
                scale = Math.max(scale - 0.1, 0.1); // Min scale of 0.1x
                break;
            default:
                return; // Don't save if no valid key was pressed
        }

        // Apply the new transform
        viseme.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`;

        // Save the new offsets and scale
        visemeOffsets[characterId] = { x, y };
        visemeScales[characterId] = scale;
        localStorage.setItem('visemeOffsets', JSON.stringify(visemeOffsets));
        localStorage.setItem('visemeScales', JSON.stringify(visemeScales));
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
        if (sentence.length === 0) {
            const visemeImages = document.querySelectorAll('.viseme');
            visemeImages.forEach(visemeImg => {
                visemeImg.src = 'Visemes/b-m-p-neutral.png';
            });
            return;
        }
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

    setInterval(animateVisemes, 150);
});
