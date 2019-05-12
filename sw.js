var url

self.addEventListener('push', function (event) {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return
  }

  const sendNotification = (data) => {
    console.log('data', data)
    const payload = {
      title: data.title,
      body: data.body,
      image: data.image,
      requireInteraction: data.requireInteraction
      // data: {},
      // icon: data.icon,
      // vibrate: data.vibrate,
      // sound: data.sound,
      // dir: data.dir,
      // tag: data.tag,
      // renotify: data.renotify,
      // silent: data.silent,
      // actions: data.actions
    }

    console.log('payload', payload)
    const promiseChain = self.registration.showNotification(payload.title, payload)
    event.waitUntil(promiseChain)
  }

  const data = event.data.json()
  url = data.url
  event.waitUntil(sendNotification(data))
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close() // Android needs explicit close.
  event.waitUntil(
    clients.matchAll({type: 'window'}).then(windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i]
        // If so, just focus it.
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})
