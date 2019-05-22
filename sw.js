/**
 * * Not ready for production yet
 * TODO: Make request to server when notifications was received
 */


// ? Should i use this variable name for URL?
var link

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

  /**
   * Response on ping request
   * @param {Object} data 
   */
  const sendPongOnPing = (data) => {
    console.log(data)

    if(!isNaN(data.clientId)){ return }
    
    const promiseChain = fetch(link)
      .then(res => {
        console.log(res)
      })

    event.waitUntil(promiseChain)
  }
  
  const data = event.data.json()
  link = data.url

  if(data.ping === true){
    event.waitUntil(sendPongOnPing(data))
  } else {
    event.waitUntil(sendNotification(data))
  }
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close() // Android needs explicit close.
  event.waitUntil(
    clients.matchAll({type: 'window'}).then(windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i]
        // If so, just focus it.
        if (client.url === link && 'focus' in client) {
          return client.focus()
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(link)
      }
    })
  )
})
