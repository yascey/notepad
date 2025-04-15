// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA5EQy1pt2a3vTLiTt8tLBvceZK6AJ1B1s",
  authDomain: "note-app-decba.firebaseapp.com",
  projectId: "note-app-decba",
  storageBucket: "note-app-decba.appspot.com",
  messagingSenderId: "1031496051582",
  appId: "1:1031496051582:web:6b372c0e5d713eb218a12f",
  measurementId: "G-SZP39BMH3N"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Quill editörü
const toolbarOptions = [
  [{ 'font': [] }],
  [{ 'header': [1, 2, 3, 4, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'align': [] }],
  ['link', 'image'],
  ['clean']
];

const editor = new Quill("#editor", {
  theme: "snow",
  modules: {
    toolbar: toolbarOptions
  }
});

// Dropdownları doldur
const gradeSelect = document.getElementById("gradeSelect");
const unitSelect = document.getElementById("unitSelect");

for (let i = 5; i <= 8; i++) {
  const option = document.createElement("option");
  option.value = `sinif${i}`;
  option.textContent = `${i}. Sınıf`;
  gradeSelect.appendChild(option);
}

for (let i = 1; i <= 10; i++) {
  const option = document.createElement("option");
  option.value = `unite${i}`;
  option.textContent = `${i}. Ünite`;
  unitSelect.appendChild(option);
}

// Kullanıcı fonksiyonları
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("status").textContent = "✅ Kayıt başarılı!";
    })
    .catch(err => {
      document.getElementById("status").textContent = "❌ " + err.message;
    });
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("status").textContent = "✅ Giriş başarılı!";
      document.getElementById("noteSection").style.display = "block";
    })
    .catch(err => {
      document.getElementById("status").textContent = "❌ " + err.message;
    });
}

function logout() {
  auth.signOut()
    .then(() => {
      document.getElementById("status").textContent = "✅ Çıkış yapıldı!";
      document.getElementById("noteSection").style.display = "none";
    })
    .catch(err => {
      document.getElementById("status").textContent = "❌ " + err.message;
    });
}

// Not ID oluştur
function getNoteId(user) {
  const grade = gradeSelect.value;
  const unit = unitSelect.value;
  return `${user.uid}_${grade}_${unit}`;
}

// Not kaydet
async function saveNote() {
  const user = auth.currentUser;
  if (!user) return alert("Lütfen önce giriş yapın.");
  const content = editor.root.innerHTML;
  const noteId = getNoteId(user);

  await db.collection("notes").doc(noteId).set({
    userId: user.uid,
    grade: gradeSelect.value,
    unit: unitSelect.value,
    content: content,
    timestamp: new Date()
  });

  alert("✅ Not kaydedildi!");
}

// Not yükle
async function loadNote() {
  const user = auth.currentUser;
  if (!user) return alert("Lütfen önce giriş yapın.");

  const noteId = getNoteId(user);
  const docRef = db.collection("notes").doc(noteId);

  try {
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      editor.root.innerHTML = docSnap.data().content;
      alert("✅ Not yüklendi!");
    } else {
      alert("❌ Kayıtlı not bulunamadı.");
    }
  } catch (error) {
    console.error("Yükleme hatası:", error);
    alert("❌ Yüklenirken hata oluştu.");
  }
}

// Tam ekran
document.getElementById("fullscreenBtn").addEventListener("click", () => {
  const editorElem = document.getElementById("editor");
  if (editorElem.requestFullscreen) {
    editorElem.requestFullscreen();
  } else {
    alert("Tarayıcınız tam ekranı desteklemiyor.");
  }
});

// Temizle
document.getElementById("clearNoteBtn").addEventListener("click", () => {
  const confirmClear = confirm("Not alanı tamamen temizlenecek. Emin misiniz?");
  if (confirmClear) {
    editor.root.innerHTML = "";
  }
});

// Otomatik not yükle
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("noteSection").style.display = "block";
    setTimeout(() => {
      loadNote();
    }, 500);
  }
});
document.getElementById("signupBtn").addEventListener("click", signup);
document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("logoutBtn").addEventListener("click", logout);
document.getElementById("saveNoteBtn").addEventListener("click", saveNote);
document.getElementById("loadNoteBtn").addEventListener("click", loadNote);

// Fonksiyonları globalde erişilebilir hale getir
window.signup = signup;
window.login = login;
window.logout = logout;
window.saveNote = saveNote;
window.loadNote = loadNote;
