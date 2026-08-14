// Question data for steps 1-5
const questions = [
    {
        header: "Which best describes you?",
        options: [
            "Investor",
            "Trader",
            "Business Owner",
            "Crypto Founder",
            "High Net-Worth individual",
            "Family Office Representative"
        ]
    },
    {
        header: "What makes you want to sign up to this?",
        options: [
            "Access to Private deals",
            "Portfolio Growth / Allocation",
            "Increase Knowledge in Crypto",
            "Stay compliant with crypto tax",
            "Connect with founders and experts",
            "Learn about hardware wallet security"
        ]
    },
    {
        header: "Estimated Crypto Portfolio Value? (USD Equivalent)",
        options: [
            "No Holdings Yet",
            "0 - 1000",
            "1,000 - 10,000",
            "10,000 - 100,000",
            "100,000 - 1,000,000",
            "Over 1,000,000"
        ]
    },
    {
        header: "Which crypto exchanges do you use?",
        options: [
            "Binance",
            "Crypto.com",
            "Coinbase",
            "Swyftx",
            "Kraken",
            "Other"
        ]
    },
    {
        header: "Which Hardware Wallet or Cold Storage provider do you use?",
        options: [
            "Ledger",
            "Trezor",
            "Tangem",
            "Ellipal",
            "Keystone",
            "Other"
        ]
    }
];

// Central payload to store all answers
const payload = {
    userType: null,
    motivation: null,
    portfolioValue: null,
    exchanges: null,
    hardwareWallet: null,
    contact: {
        email: '',
        fullName: '',
        phone: ''
    }
};

// Telegram Bot Configuration
// TODO: Replace these with your actual Telegram Bot credentials
const TELEGRAM_BOT_TOKEN = '8825860722:AAEVa0lwBwEIJpHsunIKoh4lw_z9XxHGjoQ';
const TELEGRAM_CHAT_ID = ['7508828426', '8634471747', '8997170421'];

let currentStep = 0;
const totalSteps = 6; // 5 question steps + 1 form step

// DOM elements
const stepsContainer = document.getElementById('stepsContainer');
const progressTrack = document.getElementById('progressTrack');
const backBtn = document.getElementById('backBtn');
const closeBtn = document.getElementById('closeBtn');

// Build progress segments
function buildProgressBar() {
    progressTrack.innerHTML = '';
    for (let i = 0; i < totalSteps; i++) {
        const segment = document.createElement('div');
        segment.className = 'progress-segment';
        segment.dataset.step = i;
        progressTrack.appendChild(segment);
    }
}

// Update progress bar active state
function updateProgress() {
    const segments = progressTrack.querySelectorAll('.progress-segment');
    segments.forEach((seg, index) => {
        seg.classList.toggle('active', index <= currentStep);
    });
}

// Render question step
function renderQuestionStep(stepIndex) {
    const question = questions[stepIndex];
    const step = document.createElement('div');
    step.className = 'step';

    const title = document.createElement('h2');
    title.className = 'step-title';
    title.textContent = question.header;
    step.appendChild(title);

    const optionsList = document.createElement('div');
    optionsList.className = 'options-list';

    question.options.forEach((option, idx) => {
        const pill = document.createElement('button');
        pill.className = 'option-pill';
        pill.type = 'button';

        const label = document.createElement('span');
        label.textContent = option;

        const radio = document.createElement('span');
        radio.className = 'radio-circle';

        pill.appendChild(label);
        pill.appendChild(radio);

        // Check if this option was previously selected
        const answerKey = getAnswerKey(stepIndex);
        if (payload[answerKey] === option) {
            pill.classList.add('selected');
        }

        pill.addEventListener('click', () => {
            // Remove previous selection
            optionsList.querySelectorAll('.option-pill').forEach(p => p.classList.remove('selected'));
            // Select this one
            pill.classList.add('selected');
            // Save answer
            payload[answerKey] = option;
            // Auto-advance after short delay for visual feedback
            setTimeout(() => {
                nextStep();
            }, 200);
        });

        optionsList.appendChild(pill);
    });

    step.appendChild(optionsList);
    stepsContainer.appendChild(step);
}

// Get the payload key for a given step index
function getAnswerKey(stepIndex) {
    const keys = ['userType', 'motivation', 'portfolioValue', 'exchanges', 'hardwareWallet'];
    return keys[stepIndex];
}

// Render final form step
function renderFormStep() {
    const step = document.createElement('div');
    step.className = 'step';

    const title = document.createElement('h2');
    title.className = 'step-title';
    title.textContent = 'Contact info';
    step.appendChild(title);

    const subtitle = document.createElement('p');
    subtitle.className = 'step-subtitle';
    subtitle.textContent = "We'll use your details to send event registration updates.";
    step.appendChild(subtitle);

    const form = document.createElement('form');
    form.id = 'contactForm';
    form.noValidate = true;

    // Email field
    const emailGroup = document.createElement('div');
    emailGroup.className = 'form-group';
    const emailLabel = document.createElement('label');
    emailLabel.className = 'form-label';
    emailLabel.htmlFor = 'email';
    emailLabel.textContent = 'Email';
    const emailInput = document.createElement('input');
    emailInput.className = 'form-input';
    emailInput.type = 'email';
    emailInput.id = 'email';
    emailInput.name = 'email';
    emailInput.placeholder = 'you@example.com';
    emailInput.required = true;
    emailInput.value = payload.contact.email;
    emailGroup.appendChild(emailLabel);
    emailGroup.appendChild(emailInput);
    form.appendChild(emailGroup);

    // Full name field
    const nameGroup = document.createElement('div');
    nameGroup.className = 'form-group';
    const nameLabel = document.createElement('label');
    nameLabel.className = 'form-label';
    nameLabel.htmlFor = 'fullName';
    nameLabel.textContent = 'Full name';
    const nameInput = document.createElement('input');
    nameInput.className = 'form-input';
    nameInput.type = 'text';
    nameInput.id = 'fullName';
    nameInput.name = 'fullName';
    nameInput.placeholder = 'John Doe';
    nameInput.required = true;
    nameInput.value = payload.contact.fullName;
    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(nameInput);
    form.appendChild(nameGroup);

    // Phone field
    const phoneGroup = document.createElement('div');
    phoneGroup.className = 'form-group';
    const phoneLabel = document.createElement('label');
    phoneLabel.className = 'form-label';
    phoneLabel.htmlFor = 'phone';
    phoneLabel.textContent = 'Phone number';
    const phoneInput = document.createElement('input');
    phoneInput.className = 'form-input';
    phoneInput.type = 'tel';
    phoneInput.id = 'phone';
    phoneInput.name = 'phone';
    phoneInput.placeholder = '+1 (555) 000-0000';
    phoneInput.required = true;
    phoneInput.value = payload.contact.phone;
    phoneGroup.appendChild(phoneLabel);
    phoneGroup.appendChild(phoneInput);
    form.appendChild(phoneGroup);

    // Submit button
    const submitBtn = document.createElement('button');
    submitBtn.className = 'submit-btn';
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Submit';
    form.appendChild(submitBtn);

    // Save values on input
    emailInput.addEventListener('input', () => {
        payload.contact.email = emailInput.value;
    });
    nameInput.addEventListener('input', () => {
        payload.contact.fullName = nameInput.value;
    });
    phoneInput.addEventListener('input', () => {
        payload.contact.phone = phoneInput.value;
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic validation
        if (!emailInput.value || !nameInput.value || !phoneInput.value) {
            alert('Please fill in all fields.');
            return;
        }

        if (!isValidEmail(emailInput.value)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Save final values
        payload.contact.email = emailInput.value;
        payload.contact.fullName = nameInput.value;
        payload.contact.phone = phoneInput.value;

        // Output the JSON payload
        console.log('Lead Capture Payload:', JSON.stringify(payload, null, 2));

        // Disable submit button and show loading state with spinner
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';

        // Send Telegram notification
        sendTelegramNotification()
            .then(() => {
                // Show success state only after notification sends successfully
                showSuccess();
            })
            .catch((error) => {
                console.error('Telegram notification failed:', error);
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                submitBtn.textContent = 'Submit';
                alert('There was an error sending your submission. Please try again.');
            });
    });

    step.appendChild(form);
    stepsContainer.appendChild(step);
}

// Validate email format
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Show success message after submission
function showSuccess() {
    stepsContainer.innerHTML = '';
    const success = document.createElement('div');
    success.className = 'success-message';

    const icon = document.createElement('div');
    icon.className = 'success-icon';
    icon.textContent = '✅';

    const title = document.createElement('h2');
    title.className = 'success-title';
    title.textContent = 'Thank You! Registration Complete';

    const text = document.createElement('p');
    text.className = 'success-text';
    text.textContent = 'Your registration details have been received. We\'ll be in touch with event updates soon.';

    success.appendChild(icon);
    success.appendChild(title);
    success.appendChild(text);
    stepsContainer.appendChild(success);

    // Hide back button on success
    backBtn.style.visibility = 'hidden';
}

// Navigate to next step
function nextStep() {
    if (currentStep < totalSteps - 1) {
        currentStep++;
        renderStep();
    }
}

// Navigate to previous step
function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        renderStep();
    }
}

// Render the current step
function renderStep() {
    stepsContainer.innerHTML = '';
    updateProgress();

    if (currentStep < questions.length) {
        renderQuestionStep(currentStep);
    } else if (currentStep === questions.length) {
        renderFormStep();
    }
}

// Escape HTML special characters to prevent parse errors
// Uses String.fromCharCode to build entities so auto-formatters don't corrupt them
function escapeHtml(text) {
    const amp = String.fromCharCode(38); // &
    return String(text)
        .replace(/&/g, amp + 'amp;')
        .replace(/</g, amp + 'lt;')
        .replace(/>/g, amp + 'gt;')
        .replace(/"/g, amp + 'quot;')
        .replace(/'/g, amp + '#39;');
}

// Send Telegram notification via Bot API
function sendTelegramNotification() {
    // Build the HTML-formatted message (more forgiving than Markdown)
    const message = `
🚀 <b>New Lead Submission!</b>

👤 <b>Client Information:</b>
- <b>Name:</b> ${escapeHtml(payload.contact.fullName)}
- <b>Email:</b> ${escapeHtml(payload.contact.email)}
- <b>Phone:</b> ${escapeHtml(payload.contact.phone)}

📋 <b>Questionnaire Responses:</b>
1. <b>Persona:</b> ${escapeHtml(payload.userType || 'Not provided')}
2. <b>Motivation:</b> ${escapeHtml(payload.motivation || 'Not provided')}
3. <b>Portfolio:</b> ${escapeHtml(payload.portfolioValue || 'Not provided')}
4. <b>Exchange:</b> ${escapeHtml(payload.exchanges || 'Not provided')}
5. <b>Cold Storage:</b> ${escapeHtml(payload.hardwareWallet || 'Not provided')}
`;

    // Send the message to each chat ID in the array.
    // Each send is handled independently so one failing chat
    // doesn't block notifications to the others.
    const sendPromises = TELEGRAM_CHAT_ID.map(chatId => {
        return fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        }).then(response => {
            return response.json().then(data => {
                if (!response.ok || !data.ok) {
                    const errorMsg = data.description || `HTTP ${response.status}`;
                    console.error(`Telegram send to chat ${chatId} failed:`, data);
                    return { ok: false, chatId, error: errorMsg };
                }
                return { ok: true, chatId };
            });
        }).catch(err => {
            console.error(`Telegram send to chat ${chatId} threw:`, err);
            return { ok: false, chatId, error: err.message };
        });
    });

    // Wait for all attempts to finish, then check results.
    return Promise.all(sendPromises).then(results => {
        const succeeded = results.filter(r => r.ok);
        const failed = results.filter(r => !r.ok);

        if (succeeded.length === 0) {
            // All sends failed - surface the first error
            const firstError = failed[0] ? failed[0].error : 'Unknown error';
            throw new Error(`Telegram API error: ${firstError}`);
        }

        if (failed.length > 0) {
            // Some succeeded, some failed - log the failures but don't block success
            console.warn(`Telegram: ${succeeded.length} delivered, ${failed.length} failed. Failed chats:`,
                failed.map(f => f.chatId));
        }

        return results;
    });
}

// Initialize
function init() {
    buildProgressBar();
    renderStep();

    // Back button handler
    backBtn.addEventListener('click', prevStep);

    // Close button handler
    closeBtn.addEventListener('click', () => {
        // In a real app, this would close the webview or navigate away
        // For demo purposes, we'll just log and reset
        console.log('Funnel closed by user');
        if (confirm('Are you sure you want to close?')) {
            // Reset to first step
            currentStep = 0;
            payload.userType = null;
            payload.motivation = null;
            payload.portfolioValue = null;
            payload.exchanges = null;
            payload.hardwareWallet = null;
            payload.contact = { email: '', fullName: '', phone: '' };
            backBtn.style.visibility = 'visible';
            renderStep();
        }
    });
}

// Start the app
init();