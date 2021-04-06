import { notification } from 'antd';

export function Notification(type, title, description) {
  notification[type]({
    message: title,
    description: description,
  });
}
