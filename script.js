// Twój klucz API OpenAI
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';

// Twój endpoint API OpenAI
const OPENAI_API_URL = 'https://api.openai.com/v1/engines/davinci-codex/completions';

// Tworzenie kart z wskaźnikami mentalnymi
const indicators = [
    { id: 'kto', prompt: 'Osoba zaangażowana w sytuację to {INPUT}. Jakie kroki powinna podjąć?' },
    { id: 'co', prompt: 'Zadanie do wykonania to {INPUT}. Jakie są potencjalne strategie do jego realizacji?' },
    { id: 'kiedy', prompt: 'Zadanie powinno zostać wykonane {INPUT}. Jakie są kluczowe kroki do podjęcia w tym czasie?' },
    { id: 'gdzie', prompt: 'Zadanie ma być wykonane w miejscu {INPUT}. Jakie są specyficzne dla tego miejsca czynniki do rozważenia?' },
    { id: 'jak', prompt: 'Metoda do zastosowania to {INPUT}. Jakie są szczegółowe kroki do wykonania tej metody?' },
    { id: 'dlaczego', prompt: 'Celem jest {INPUT}. Jakie kroki powinny być podjęte, aby osiągnąć ten cel?' },
    { id: 'zalety', prompt: 'Zalety to {INPUT}. Jakie kroki powinny być podjęte, biorąc pod uwagę te czynniki?' },
    { id: 'wady', prompt: 'Wady to {INPUT}. Jakie kroki powinny być podjęte, biorąc pod uwagę te czynniki?' },
    { id: 'interesujące', prompt: 'Interesujące aspekty to {INPUT}. Jakie kroki powinny być podjęte, biorąc pod uwagę te czynniki?' },
    { id: 'alternatywy', prompt: 'Dostępne alternatywy to {INPUT}. Jakie są potencjalne skutki każdej z tych opcji?' },
    { id: 'możliwości', prompt: 'Możliwości to {INPUT}. Jakie są potencjalne skutki każdej z tych opcji?' },
    { id: 'wybory', prompt: 'Wybory to {INPUT}. Jakie są potencjalne skutki każdej z tych opcji?' },
    { id: 'czynniki', prompt: 'Wszystkie czynniki do rozważenia to {INPUT}. Jakie kroki powinny być podjęte, biorąc pod uwagę te czynniki?' },
    { id: 'punkty_widzenia', prompt: 'Inne punkty widzenia to {INPUT}. Jak te perspektywy mogą wpłynąć na plan działania?' },
    { id: 'priorytety', prompt: 'Podstawowe priorytety to {INPUT}. Jakie kroki powinny być podjęte, aby sprostać tym priorytetom?' },
    { id: 'skutki', prompt: 'Potencjalne skutki i następstwa to {INPUT}. Jakie kroki powinny być podjęte, aby zarządzać tymi skutkami?' },
    { id: 'ludzie', prompt: 'Ludzie zaangażowani to {INPUT}. Jakie kroki powinny być podjęte, biorąc pod uwagę ich role i cele?' },
    { id: 'przeszkody', prompt: 'Potencjalne przeszkody to {INPUT}. Jakie kroki powinny być podjęte, aby je pokonać?' },
    { id: 'prognoza', prompt: 'Prognoza dla sytuacji to {INPUT}. Jakie kroki powinny być podjęte, biorąc pod uwagę te przewidywania?' },
    { id: 'teren', prompt: 'Teren, na którym sytuacja ma miejsce, to {INPUT}. Jakie kroki powinny być podjęte, biorąc pod uwagę specyfikę tego terenu?' },
    { id: 'zasoby', prompt: 'Dostępne zasoby to {INPUT}. Jakie kroki powinny być podjęte, aby optymalnie wykorzystać te zasoby?' },
    { id: 'ryzyko', prompt: 'Potencjalne ryzyko to {INPUT}. Jakie kroki powinny być podjęte, aby zarządzać tym ryzykiem?' }
];

const container = document.getElementById('container');

indicators.forEach(indicator => {
    const card = document.createElement('div');
    card.className = 'card';

    const front = document.createElement('div');
    front.className = 'front';
    front.textContent = indicator.prompt;

    const back = document.createElement('div');
    back.className = 'back';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = indicator.id;

    back.appendChild(input);
    card.appendChild(front);
    card.appendChild(back);
    container.appendChild(card);
});

// Generowanie planu
document.getElementById('generate-plan').addEventListener('click', async () => {
    const plan = document.getElementById('plan');

    let finalPrompt = 'Na podstawie wszystkich informacji, które otrzymałeś - ';

    for (const indicator of indicators) {
        const userInput = document.getElementById(indicator.id).value;
        const prompt = indicator.prompt.replace('{INPUT}', userInput);

        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({ prompt: prompt, max_tokens: 100 })
        });

        const data = await response.json();
        finalPrompt += data.choices[0].text + ' ';
    }

    finalPrompt += '- stwórz bardzo szczegółowy i rozbudowany plan działania. Plan powinien zawierać konkretne kroki, które muszą zostać podjęte, z uwzględnieniem wszystkich czynników, które zostały omówione. Każdy krok powinien zawierać jasne wytyczne dotyczące tego, co ma być zrobione, kto ma to zrobić, kiedy ma to być zrobione i jakie zasoby są potrzebne. Plan powinien również uwzględniać potencjalne przeszkody i ryzyka, a także strategie na ich pokonanie. Proszę, aby plan był jak najbardziej kompleksowy i przemyślany, z uwzględnieniem wszystkich możliwych scenariuszy i warunków.';

    const finalResponse = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({ prompt: finalPrompt, max_tokens: 500 })
    });

    const finalData = await finalResponse.json();
    plan.textContent = finalData.choices[0].text;
});
