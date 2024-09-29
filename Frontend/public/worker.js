self.addEventListener('push',async  function(e) {
    const notification=e.data.json()
    console.log(notification)
    
    self.registration.showNotification(
        notification.notification.title,
        {
            body: notification.notification.body,
        }
    );
})