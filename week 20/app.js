document.addEventListener('DOMContentLoaded', () => {
    // Array to store all entered scores
    const scores = [];
    
    // Frequency array initialized to 0 for scores 0-100
    // Index represents the score, value represents frequency
    const freqCount = new Array(101).fill(0);

    // DOM Elements
    const form = document.getElementById('score-form');
    const scoreInput = document.getElementById('score-input');
    const recentScoresList = document.getElementById('recent-scores-list');
    
    const uiTotal = document.getElementById('total-count');
    const uiMin = document.getElementById('min-score');
    const uiMax = document.getElementById('max-score');
    const uiMode = document.getElementById('mode-score');
    
    const chartContainer = document.getElementById('frequency-chart');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const scoreVal = parseInt(scoreInput.value, 10);
        
        if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 100) {
            alert('Please enter a valid score between 0 and 100.');
            return;
        }

        // Add score to array and update frequency array
        scores.push(scoreVal);
        freqCount[scoreVal]++;
        
        // Clear input
        scoreInput.value = '';
        
        // Update the application state and UI
        addScoreToRecent(scoreVal);
        updateStatistics();
        updateChart();
    });

    function addScoreToRecent(score) {
        const li = document.createElement('li');
        li.className = 'score-badge';
        li.textContent = score;
        recentScoresList.prepend(li);
    }

    function updateStatistics() {
        if (scores.length === 0) return;

        let min = 101; 
        let max = -1;
        
        // Linear traversal for Min and Max over the scores array
        for (let i = 0; i < scores.length; i++) {
            if (scores[i] < min) {
                min = scores[i];
            }
            if (scores[i] > max) {
                max = scores[i];
            }
        }

        // Linear traversal for Mode over the frequency array
        let highestFreq = 0;
        let modes = [];
        
        for (let i = 0; i < freqCount.length; i++) {
            if (freqCount[i] > highestFreq) {
                highestFreq = freqCount[i];
                modes = [i]; // New highest found
            } else if (freqCount[i] === highestFreq && highestFreq > 0) {
                modes.push(i); // Another mode found
            }
        }

        // Update UI Text
        uiTotal.textContent = scores.length;
        uiMin.textContent = min;
        uiMax.textContent = max;
        uiMode.textContent = modes.join(', ');
    }

    function updateChart() {
        // Clear empty state or old bars
        chartContainer.innerHTML = '';
        
        // Find the maximum frequency to scale the bars relative to it
        let maxFreqForScale = 1;
        for (let count of freqCount) {
            if (count > maxFreqForScale) maxFreqForScale = count;
        }

        // Generate bars linearly based on frequency
        let hasData = false;
        for (let i = 0; i < freqCount.length; i++) {
            if (freqCount[i] > 0) {
                hasData = true;
                
                const wrapper = document.createElement('div');
                wrapper.className = 'bar-wrapper';
                
                const bar = document.createElement('div');
                bar.className = 'bar';
                // Calculate height percentage based on max frequency
                const heightPct = (freqCount[i] / maxFreqForScale) * 100;
                // Leave a little room at top (e.g. 85% instead of 100% so tooltip looks okay)
                bar.style.height = `${Math.max(5, heightPct * 0.85)}%`;
                bar.setAttribute('data-count', `Freq: ${freqCount[i]}`);
                
                const label = document.createElement('div');
                label.className = 'bar-label';
                label.textContent = i;
                
                wrapper.appendChild(bar);
                wrapper.appendChild(label);
                chartContainer.appendChild(wrapper);
            }
        }
        
        if (!hasData) {
            chartContainer.innerHTML = '<p class="empty-state">No scores added yet.</p>';
        }
    }
});
