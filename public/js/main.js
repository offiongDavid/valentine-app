
const pathParts = window.location.pathname.split('/');
const pageName = pathParts[pathParts.length - 1];
let generatedLink = '';
let statusLink = '';



const id = pathParts.length > 2 ? pathParts[pathParts.length - 1] : null;


async function createLink() {
  const senderName = document.getElementById('sender').value.trim();
  const receiverName = document.getElementById('receiver').value.trim();

  const error = document.getElementById('error');
  const loading = document.getElementById('loading');
  const btn = document.getElementById('generateBtn');

  error.classList.add('hidden');

 
  if (!senderName || !receiverName) {
    error.innerText = 'Please enter both names 💕';
    error.classList.remove('hidden');
    return;
  }

  loading.classList.remove('hidden');
  btn.disabled = true;

  const res = await fetch('/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ senderName, receiverName })
  });

  loading.classList.add('hidden');
  btn.disabled = false;
  const data = await res.json();

  generatedLink = data.askLink;
statusLink = data.statusLink;

const linkBox = document.getElementById('linkBox');

linkBox.classList.remove('hidden');
linkBox.innerHTML = `
  <div class="space-y-3 text-sm break-all">

    <p class="font-semibold text-gray-700">
      💌 Share this link
    </p>
    <a href="${generatedLink}" target="_blank"
       class="text-pink-600 underline">
      ${generatedLink}
    </a>

    <p class="font-semibold text-gray-700 mt-4">
      👀 Check response
    </p>
    <a href="${statusLink}" target="_blank"
       class="text-blue-600 underline">
      ${statusLink}
    </a>

  </div>
`;


  document.getElementById('previewText').innerText =
    `${senderName} is asking ${receiverName} to be their Valentine 💖`;
}

function copyLink() {
  if (!generatedLink) {
    alert('No link to copy');
    return;
  }

  navigator.clipboard.writeText(generatedLink);
  alert('Link copied 💖');
}

function shareWhatsApp() {
  if (!generatedLink) {
    alert('No link to share');
    return;
  }

  const msg = `Someone is asking you something special 💖\n${generatedLink}`;
  window.open(
    `https://wa.me/?text=${encodeURIComponent(msg)}`,
    '_blank'
  );
}


async function loadAskPage() {
  if (!id) return;

  const res = await fetch(`/data/${id}`);
  const data = await res.json();

  const questionEl = document.getElementById('question');
  const buttons = document.getElementById('buttons');

  if (!data) {
    questionEl.innerText = 'Invalid or expired link 💔';
    return;
  }

  if (data.response) {
    questionEl.innerText =
      data.response === 'yes'
        ? 'This Valentine request was accepted 💖'
        : 'This Valentine request was declined 💔';
    buttons.style.display = 'none';
    return;
  }

  questionEl.innerText =
    `Hi ${data.receiverName}, it's ${data.senderName} 💕\nWill you be my Valentine?`;
}

async function respond(answer) {
  if (!id) return;

  await fetch(`/respond/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ response: answer })
  });

  window.location.href = `/views/response.html?ans=${answer}`;
}


function loadResponsePage() {
  const messageEl = document.getElementById('message');
  if (!messageEl) return;

  const params = new URLSearchParams(window.location.search);
  const ans = params.get('ans');

  if (!ans) return;

  messageEl.innerText =
    ans === 'Yes'
      ? '🎉 YES accepted! Valentine secured 💖'
      : '💔 Maybe next time…';
}


document.addEventListener('DOMContentLoaded', () => {
  loadAskPage();
  loadResponsePage();
});

const musicTracks = [
   "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
];

const bgMusic = document.getElementById("bgMusic");
const musicText = document.getElementById("musicText");

let isPlaying = false;


bgMusic.src = musicTracks[Math.floor(Math.random() * musicTracks.length)];
function toggleMusic() {
  if (!isPlaying) {
    bgMusic.play();
    musicText.innerText = "Pause Music";
  } else {
    bgMusic.pause();
    musicText.innerText = "Play Music";
  }
  isPlaying = !isPlaying;
}


function updateCountdown() {
  const now = new Date();
  const valentines = new Date(now.getFullYear(), 1, 14); // Feb = 1

  if (now > valentines) {
    document.getElementById("countdown").innerText =
      "Happy Valentine’s Day 💖";
    return;
  }

  const diff = valentines - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

  document.getElementById("countdown").innerText =
    `${days} days, ${hours} hours to Valentine’s Day 💘`;
}

updateCountdown();
setInterval(updateCountdown, 60_000);

async function checkResponse() {
  if (!id) return;

  const res = await fetch(`/api/status/${id}`);
  const data = await res.json();

  const el = document.getElementById('senderResult');
  if (!el) return;

  if (!data || !data.response) {
    el.innerText = 'Waiting for response… 💌';
  } else if (data.response === 'yes') {
    el.innerText = '🎉 YES 💖';
  } else {
    el.innerText = '💔 NO';
  }
}


