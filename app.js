window.onload = function () {
    const editor = new Quill("#editor", {
      theme: "snow"
    });
  
    // diğer kodlar buraya
  
  
document.getElementById("fullscreenBtn").onclick = () => {
    const editorElem = document.querySelector("#editor");
    if (editorElem.requestFullscreen) {
      editorElem.requestFullscreen();
    } else {
      alert("Tarayıcınız tam ekranı desteklemiyor.");
    }
  };

      // Firebase config (senin çalıştığın yapı)
      const firebaseConfig = {
        apiKey: "AIzaSyA5EQy1pt2a3vTLiTt8tLBvceZK6AJ1B1s",
        authDomain: "note-app-decba.firebaseapp.com",
        projectId: "note-app-decba",
        storageBucket: "note-app-decba.firebasestorage.app",
        messagingSenderId: "1031496051582",
        appId: "1:1031496051582:web:6b372c0e5d713eb218a12f",
        measurementId: "G-SZP39BMH3N"
      };
      function logout() {
    auth.signOut()
      .then(() => {
        document.getElementById("status").textContent = "✅ Çıkış yapıldı!";
        document.getElementById("noteSection").style.display = "none";
      })
      .catch(err => {
        document.getElementById("status").textContent = "❌ " + err.message;
      });
  };
  
      firebase.initializeApp(firebaseConfig);
      const auth = firebase.auth();
      const db = firebase.firestore();
      document.getElementById("clearNoteBtn").addEventListener("click", () => {
    const confirmClear = confirm("Not alanı tamamen temizlenecek. Emin misiniz?");
    if (confirmClear) {
      editor.root.innerHTML = "";
    }
  });
  
  
      // Quill editörü başlat
     
  const toolbarOptions = [
    [{ 'font': [] }],
    [{ 'header': [1, 2, 3, 4, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ["link", "image"],
    ['clean']  // temizleme aracı
  ];
  
  
  
  
      // Dropdown'ları doldur
      document.addEventListener("DOMContentLoaded", () => {
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
      });// Dropdown'ları doldur
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
  
      function getNoteId(user) {
        const grade = gradeSelect.value;
        const unit = unitSelect.value;
        return `${user.uid}_${grade}_${unit}`;
      }
  
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
  
      async function loadNote() {
    const user = auth.currentUser;
    if (!user) return alert("Lütfen önce giriş yapın.");
  
    const noteId = getNoteId(user); // aynı şekilde oluştur
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
  
  
  
      auth.onAuthStateChanged(user => {
        if (user) {
          document.getElementById("noteSection").style.display = "block";
        }
      });
      auth.onAuthStateChanged(user => {
    if (user) {
      document.getElementById("noteSection").style.display = "block";
  
      // Varsayılan seçimle notu otomatik getir
      setTimeout(() => {
        loadNote(); // sınıf ve ünite seçiliyse otomatik yükleme
      }, 500);
    }
  })
};