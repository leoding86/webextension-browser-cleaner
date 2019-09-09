import browser from '@/modules/Browser';

class Notification {
  static instance = null;

  /**
   * @returns {Notification}
   */
  static getNotification() {
    if (this.instance === null) {
      Notification.instance = Notification.createNotification();
    }

    return Notification.instance;
  }

  /**
   * @returns {Notification}
   */
  static createNotification() {
    return new Notification();
  }

  constructor() {
    this.notificationId = null;

    /**
     * There is need a better way to maintain the notification close event for refreshing the notificationId property
     * in the instance.
     */
    browser.notifications.onClosed.addListener((notificationId, byUser) => {
      if (this.notificationId === notificationId) {
        this.notificationId = null;
      }
    });
  }

  show({
    type,
    iconUrl,
    title,
    message
  }) {
    if (this.notificationId === null) {
      browser.notifications.create({
        type: type,
        iconUrl: iconUrl,
        title: title,
        message: message
      }, notificationId => {
        this.notificationId = notificationId;
      });
    } else {
      browser.notifications.update(this.notificationId, {
        type: type,
        iconUrl: iconUrl,
        title: title,
        message: message
      });
    }
  }
}

export default Notification;
