// import { YasumuEmailMessage } from '@yasumu/core';

export const mails: any[] = [
  {
    id: 1,
    from: 'williamsmith@example.com',
    to: ['johndoe@gmail.com'],
    subject: 'Meeting Tomorrow',
    body: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.\n\nPlease come prepared with any questions or insights you may have. Looking forward to our meeting!\n\nBest regards, William",
    created_at: '2023-10-22T09:00:00',
    read: true,
  },
  {
    id: 2,
    from: 'bobjohnson@example.com',
    to: ['johndoe@gmail.com'],
    subject: 'Weekend Plans',
    body: "Any plans for the weekend? I was thinking of going hiking in the nearby mountains. It's been a while since we had some outdoor fun.\n\nIf you're interested, let me know, and we can plan the details. It'll be a great way to unwind and enjoy nature.\n\nLooking forward to your response!\n\nBest, Bob",
    created_at: '2023-04-10T11:45:00',
    read: true,
  },
  {
    id: 3,
    from: 'michaelwilson@example.com',
    to: ['sarahbrown@example.com'],
    subject: 'Important Announcement',
    body: "I have an important announcement to make during our team meeting. It pertains to a strategic shift in our approach to the upcoming product launch. We've received valuable feedback from our beta testers, and I believe it's time to make some adjustments to better meet our customers' needs.\n\nThis change is crucial to our success, and I look forward to discussing it with the team. Please be prepared to share your insights during the meeting.\n\nRegards, Michael",
    created_at: '2023-03-10T15:00:00',
    read: false,
  },
];
