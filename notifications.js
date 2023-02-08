var config = {
  apiKey: "AIzaSyDHfCOlxqcCBNwJ0FD4uHljXotLPNeaDLE",
  authDomain: "push-notification-51f57.firebaseapp.com",
  databaseURL: "https://push-notification-51f57.firebaseio.com",
  projectId: "push-notification-51f57",
  storageBucket: "push-notification-51f57.appspot.com",
  messagingSenderId: "219899714622",
  
};



// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  
};

firebase.initializeApp(config);

if (
  window.location.protocol === "https:" &&
  "Notification" in window &&
  "serviceWorker" in navigator &&
  "localStorage" in window &&
  "fetch" in window &&
  "postMessage" in window
) {
  var messaging = firebase.messaging();
  var push_btn = create_push_button(
    document.getElementById("push-notification-bunner")
  );
 

  getToken();
} else {
  if (window.location.protocol !== "https:") {
    console.error("Is not from HTTPS");
  } else if (!("Notification" in window)) {
    console.error("Notification not supported");
  } else if (!("serviceWorker" in navigator)) {
    console.error("ServiceWorker not supported");
  } else if (!("localStorage" in window)) {
    console.error("LocalStorage not supported");
  } else if (!("fetch" in window)) {
    console.error("fetch not supported");
  } else if (!("postMessage" in window)) {
    console.error("postMessage not supported");
  }

  console.warn("This browser does not support desktop notification.");
  console.log("Is HTTPS", window.location.protocol === "https:");
  console.log("Support Notification", "Notification" in window);
  console.log("Support ServiceWorker", "serviceWorker" in navigator);
  console.log("Support LocalStorage", "localStorage" in window);
  console.log("Support fetch", "fetch" in window);
  console.log("Support postMessage", "postMessage" in window);
}

function create_push_button(elem) {
  var _push_button = {
    state: function (state = "") {
      if (elem) {
        elem.textContent = state;
      }
    },

    show: function () {
      if (elem && elem.hidden) {
        elem.hidden = false;
        _push_button.addEvents();
        elem.classList.remove('subscribe__button-submit-hidden')
      }
    },

    addEvents: function () {
      if (elem) {
        elem.addEventListener("click", function () {
          window.ga('send', 'event', 'warning-push-notification', 'Click')
          getToken(true);
        });
      }
    },

    hidden: function() {
      if (elem) {
        elem.remove()
      }
    }
  };

  return _push_button;
}

let timerId

function showTooltip() {
  clearTimeout(timerId)
  const $notification = document.querySelector('#warning-notification-js')
  if($notification) {
    $notification.classList.add('Warning-block__notification-show')
    timerId = setTimeout(() => {
      $notification.classList.remove('Warning-block__notification-show')
    }, 3000)
  }
}

// Подписываемся
function getToken(click = false) {
  // push_btn.state("Загрузка...");

  // 1. Запрос разрешения у пользователя (всплывающее окно "разрешить/запретить")
  messaging
    .requestPermission()
    .then(function (permission) {
      console.log("permission", permission);
      // 2.1 Если пользователь разрешил, то получаем токен
      messaging.getToken().then(function (token) {
        console.log("token", token);
        fetch("/fcm/register/" + token, {
          method: "POST",
          "Content-Type": "application/json",
        })
          .then(function (res) {
            // Если подписка разрешена, то получим объект с данными подписки
            console.log("/fcm/register/ responsed: ", res);
            push_btn.hidden();
            // push_btn.state("вы подписаны на push уведомления");
          })
          .catch(function (error) {
            console.error("Unable to get permission to notify.", error);
            push_btn.state("تفعيل التنبيهات");
          });
      });
    })
    .catch(function (error) {
      // 2.2 Если пользователь запретил подписку эта функция будет выполняться
      // при каждой загрузке страницы
      push_btn.show();
      if(click) {
        showTooltip()
      }
     
      console.error("Unable to get permission to notify.", error);
      push_btn.state("تفعيل التنبيهات");
    });
}
