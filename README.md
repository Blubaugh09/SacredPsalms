# Lectio Divina - Sacred Reading Guide

A beautiful, mobile-friendly application for guided spiritual reading through the ancient practice of Lectio Divina.

## About Lectio Divina

Lectio Divina ("Divine Reading") is a traditional contemplative practice of engaging with scripture in a prayerful manner. It invites readers to slow down and deeply engage with the text, allowing the Holy Spirit to speak through the words.

The practice involves four main steps:
1. **Lectio (Read)** - Slowly read the scripture passage
2. **Meditatio (Meditate)** - Reflect on a word or phrase that stands out
3. **Oratio (Pray)** - Respond to the text in prayer
4. **Contemplatio (Contemplate)** - Rest in God's presence

This application guides users through these steps while providing a reverent atmosphere for reflection.

## Features

- Step-by-step guidance through the Lectio Divina process
- Beautiful, distraction-free interface optimized for mobile and desktop
- Text highlighting for meditation on specific passages
- Journal areas to record reflections and prayers
- Contemplation timer
- Optional calming background sounds
- Saves your session progress

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/lectio-divina.git
cd lectio-divina
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Add a background sound file:
The application expects an ambient sound file at `public/sounds/ambient.mp3`. You'll need to add your own royalty-free ambient sound file here, or adjust the path in the `BackgroundSound.tsx` component.

### Running the Application

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

```bash
npm run build
# or
yarn build
```

## Customization

- **Scripture Passages**: To change the default scripture passage, edit the `sampleScripture` object in `src/context/LectioContext.tsx`.
- **Styling**: The application uses styled-components. You can customize colors, fonts, and other design elements in `src/app/globals.css` and `src/components/StyledComponents.tsx`.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the ancient monastic practice of Lectio Divina
- Created to provide a reverent, focused environment for scripture meditation
